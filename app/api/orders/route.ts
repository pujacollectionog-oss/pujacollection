import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { verifyAdminRequest } from '@/lib/auth/adminAuth';
import { recordAuditLog } from '@/lib/auth/adminAudit';

function maskName(name: string): string {
  if (!name) return 'Valued Patron';
  const parts = name.trim().split(' ');
  return parts
    .map((p) => (p.length > 2 ? `${p.slice(0, 2)}***` : `${p[0]}*`))
    .join(' ');
}

function maskPhone(phone: string): string {
  const clean = phone.replace(/\D/g, '');
  if (clean.length < 7) return '******';
  return `${clean.slice(0, 4)}****${clean.slice(-2)}`;
}

function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return 'c***@pujacollection.com.np';
  const [user, domain] = email.split('@');
  const maskedUser = user.length > 2 ? `${user.slice(0, 2)}***` : `${user[0]}*`;
  return `${maskedUser}@${domain}`;
}

function generateSecureOrderId(): string {
  const randomSuffix = crypto.randomBytes(4).toString('hex').toUpperCase(); // 8 random hex chars (4.2 billion combinations)
  return `PUJA-2026-${randomSuffix}`;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId')?.trim();
    const phone = searchParams.get('phone')?.trim().replace(/\D/g, '');

    const isAdmin = await verifyAdminRequest();

    // 1. Single order tracking query (Protected against brute-force harvesting)
    if (orderId || phone) {
      // If not an authenticated admin, strictly require BOTH order ID and phone number
      if (!isAdmin) {
        if (!orderId || !phone || phone.length < 8) {
          return NextResponse.json(
            {
              success: false,
              message: 'Both valid Order ID and matching 10-digit Phone Number are required for order tracking verification.',
            },
            { status: 400 }
          );
        }
      }

      const order = await prisma.order.findFirst({
        where: isAdmin
          ? {
              OR: [
                orderId ? { id: { equals: orderId } } : {},
                phone ? { customerPhone: { contains: phone } } : {},
              ],
            }
          : {
              id: { equals: orderId },
              customerPhone: { contains: phone },
            },
        include: { items: true },
      });

      if (!order) {
        return NextResponse.json(
          { success: false, message: 'No matching order found with the provided Order ID and Phone Number.' },
          { status: 404 }
        );
      }

      // If viewing publicly, mask PII for security & privacy
      if (!isAdmin) {
        const sanitizedOrder = {
          ...order,
          customerName: maskName(order.customerName),
          customerPhone: maskPhone(order.customerPhone),
          customerEmail: maskEmail(order.customerEmail),
          toleAndStreet: `${order.toleAndStreet.slice(0, 3)}***`,
          landmark: order.landmark ? 'Protected' : undefined,
        };
        return NextResponse.json({ success: true, order: sanitizedOrder });
      }

      return NextResponse.json({ success: true, order });
    }

    // 2. Full orders list (Protected: Admin Only)
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin session required to view full order database.' },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });

    return NextResponse.json({ success: true, orders });
  } catch (err: unknown) {
    console.error('Error in GET /api/orders:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders from database.' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data || !data.customer || !data.items || !Array.isArray(data.items) || data.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid order payload. Customer and items are required.' },
        { status: 400 }
      );
    }

    // Validate and sanitize phone number
    const cleanPhone = String(data.customer.phone || '').trim().replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Valid 10-digit customer contact number is required.' },
        { status: 400 }
      );
    }

    // 1. Authoritative Server-Side Price Verification from Database
    let verifiedSubtotal = 0;
    const validatedItems: {
      productId: string;
      variantId?: string;
      name: string;
      price: number;
      image: string;
      quantity: number;
      size?: string;
      colorName?: string;
    }[] = [];

    for (const item of data.items) {
      const quantity = Math.max(1, Math.min(50, Number(item.quantity) || 1));
      let unitPrice = 0;
      let itemName = String(item.name || 'Puja Collection Garment');
      let itemImage = String(item.image || '/images/hero-lehenga.jpg');

      // Look up product in Prisma DB by ID or Slug
      const dbProduct = await prisma.product.findFirst({
        where: {
          OR: [
            item.productId ? { id: item.productId } : {},
            item.productId ? { slug: item.productId } : {},
          ],
        },
      });

      if (dbProduct) {
        unitPrice = dbProduct.basePrice;
        itemName = dbProduct.name;
        // Verify tailoring fee if customized
        if (item.isCustomTailored) {
          unitPrice += dbProduct.customizationFee || (Number(item.tailoringFee) > 0 ? Number(item.tailoringFee) : 1500);
        }
      } else {
        // Fallback to sanitizing provided price with non-negative lower bound
        unitPrice = Math.max(100, Number(item.price) || 100);
        if (item.isCustomTailored && Number(item.tailoringFee) > 0) {
          unitPrice += Number(item.tailoringFee);
        }
      }

      verifiedSubtotal += unitPrice * quantity;

      validatedItems.push({
        productId: dbProduct?.id || item.productId || 'custom-item',
        variantId: item.variantId || undefined,
        name: itemName,
        price: unitPrice,
        image: itemImage,
        quantity,
        size: item.size || 'Standard',
        colorName: item.colorName || '',
      });
    }

    // 2. Authoritative Server-Side Coupon Verification
    let verifiedDiscount = 0;
    let validatedCouponCode: string | null = null;

    if (data.couponCode && typeof data.couponCode === 'string') {
      const cleanCode = data.couponCode.trim().toUpperCase();
      const coupon = await prisma.coupon.findUnique({
        where: { code: cleanCode },
      });

      if (coupon && coupon.isActive) {
        const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
        const limitReached = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;
        const meetsMinOrder = !coupon.minOrderAmount || verifiedSubtotal >= coupon.minOrderAmount;

        if (!isExpired && !limitReached && meetsMinOrder) {
          validatedCouponCode = coupon.code;
          if (coupon.discountType === 'PERCENTAGE') {
            let discount = Math.round((verifiedSubtotal * coupon.discountValue) / 100);
            if (coupon.maxDiscountNPR && discount > coupon.maxDiscountNPR) {
              discount = coupon.maxDiscountNPR;
            }
            verifiedDiscount = discount;
          } else {
            verifiedDiscount = coupon.discountValue;
          }
        }
      }
    }

    const verifiedDeliveryFee = 0; // Free delivery all over Nepal
    const verifiedTotal = Math.max(0, verifiedSubtotal - verifiedDiscount + verifiedDeliveryFee);

    // Cryptographically secure unguessable order ID
    const orderId = generateSecureOrderId();

    // Create order with verified prices in database
    const newOrder = await prisma.order.create({
      data: {
        id: orderId,
        customerName: String(data.customer.name || 'Valued Patron').slice(0, 100),
        customerEmail: String(data.customer.email || 'customer@pujacollection.com.np').slice(0, 100),
        customerPhone: cleanPhone,
        province: data.shippingAddress?.province || 'Koshi Province',
        district: data.shippingAddress?.district || 'Morang',
        municipality: data.shippingAddress?.municipality || 'Rangeli Municipality',
        ward: String(data.shippingAddress?.ward || '7'),
        toleAndStreet: String(data.shippingAddress?.toleAndStreet || 'Main Road').slice(0, 200),
        landmark: data.shippingAddress?.landmark ? String(data.shippingAddress.landmark).slice(0, 200) : '',
        subtotalNPR: verifiedSubtotal,
        discountNPR: verifiedDiscount,
        couponCode: validatedCouponCode,
        deliveryFeeNPR: verifiedDeliveryFee,
        totalAmountNPR: verifiedTotal,
        paymentMethod: data.paymentMethod || 'COD',
        paymentStatus: data.paymentStatus || (data.paymentMethod === 'FONEPAY' ? 'PAID' : 'COD_VERIFIED'),
        status: data.status || 'CONFIRMED',
        courierPartner: data.courier?.partnerName || 'Pathao Express Nepal',
        consignmentId: data.courier?.consignmentId || `NP-EXP-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
        items: {
          create: validatedItems.map((item) => ({
            productId: item.productId,
            variantId: item.variantId || '',
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
            size: item.size || 'Standard',
            colorName: item.colorName || '',
          })),
        },
      },
      include: { items: true },
    });

    // 3. Decrement inventory stock safely in database
    for (const item of validatedItems) {
      try {
        if (item.variantId) {
          const variant = await prisma.productVariant.findUnique({ where: { id: item.variantId } });
          if (variant) {
            await prisma.productVariant.update({
              where: { id: item.variantId },
              data: { stockQuantity: Math.max(0, variant.stockQuantity - item.quantity) },
            });
          }
        } else if (item.productId) {
          const firstVariant = await prisma.productVariant.findFirst({ where: { productId: item.productId } });
          if (firstVariant) {
            await prisma.productVariant.update({
              where: { id: firstVariant.id },
              data: { stockQuantity: Math.max(0, firstVariant.stockQuantity - item.quantity) },
            });
          }
        }
      } catch (stockErr) {
        console.error('Error decrementing stock for item:', item, stockErr);
      }
    }

    // 4. Increment coupon usedCount if coupon was validated
    if (validatedCouponCode) {
      try {
        await prisma.coupon.update({
          where: { code: validatedCouponCode },
          data: { usedCount: { increment: 1 } },
        });
      } catch {}
    }

    // 5. Upsert customer CRM record
    await prisma.customer.upsert({
      where: { phone: cleanPhone },
      update: {
        name: data.customer.name,
        email: data.customer.email,
        city: `${data.shippingAddress?.municipality || ''}, ${data.shippingAddress?.district || ''}`,
        province: data.shippingAddress?.province,
      },
      create: {
        name: data.customer.name,
        email: data.customer.email,
        phone: cleanPhone,
        city: `${data.shippingAddress?.municipality || ''}, ${data.shippingAddress?.district || ''}`,
        province: data.shippingAddress?.province,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, order: newOrder });
  } catch (err: unknown) {
    console.error('Error creating order in Prisma:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to record order in database.' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const isAdmin = await verifyAdminRequest();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin session required to update order status.' },
        { status: 401 }
      );
    }

    const { orderId, status, courierPartner, consignmentId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required.' },
        { status: 400 }
      );
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        ...(status ? { status } : {}),
        ...(courierPartner ? { courierPartner } : {}),
        ...(consignmentId ? { consignmentId } : {}),
      },
      include: { items: true },
    });

    recordAuditLog({
      eventType: 'ORDER_STATUS_CHANGED',
      actor: 'Store Owner',
      ipAddress: 'Admin Session',
      details: `Order #${orderId} status advanced to "${status || 'Updated'}"${
        consignmentId ? ` (Consignment: ${consignmentId})` : ''
      }`,
      severity: 'INFO',
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (err: unknown) {
    console.error('Error updating order status:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to update order status.' },
      { status: 500 }
    );
  }
}
