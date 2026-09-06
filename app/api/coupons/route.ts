import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminRequest } from '@/lib/auth/adminAuth';
import { recordAuditLog } from '@/lib/auth/adminAudit';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const subtotalStr = searchParams.get('subtotal');

    // 1. Validation request (e.g. from Public Checkout)
    if (code) {
      const cleanCode = code.trim().toUpperCase();
      const subtotal = subtotalStr ? parseInt(subtotalStr, 10) : 0;

      const coupon = await prisma.coupon.findUnique({
        where: { code: cleanCode },
      });

      if (!coupon) {
        return NextResponse.json({
          success: false,
          valid: false,
          message: `Coupon code "${cleanCode}" is invalid.`,
        });
      }

      if (!coupon.isActive) {
        return NextResponse.json({
          success: false,
          valid: false,
          message: `Coupon code "${cleanCode}" is no longer active.`,
        });
      }

      if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
        return NextResponse.json({
          success: false,
          valid: false,
          message: `Coupon code "${cleanCode}" has expired.`,
        });
      }

      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return NextResponse.json({
          success: false,
          valid: false,
          message: `Coupon code "${cleanCode}" has reached its maximum redemption limit.`,
        });
      }

      if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
        return NextResponse.json({
          success: false,
          valid: false,
          message: `Order subtotal must be at least NPR ${coupon.minOrderAmount.toLocaleString()} to use this coupon.`,
        });
      }

      // Calculate discount amount in NPR
      let discount = 0;
      if (coupon.discountType === 'PERCENTAGE') {
        discount = Math.round((subtotal * coupon.discountValue) / 100);
        if (coupon.maxDiscountNPR && discount > coupon.maxDiscountNPR) {
          discount = coupon.maxDiscountNPR;
        }
      } else {
        discount = coupon.discountValue;
      }

      return NextResponse.json({
        success: true,
        valid: true,
        discount,
        code: coupon.code,
        message: coupon.description || `Coupon ${coupon.code} applied successfully!`,
        coupon,
      });
    }

    // 2. Fetch all coupons (Protected: Admin Only)
    const isAdmin = await verifyAdminRequest();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin session required to view full coupon list.' },
        { status: 401 }
      );
    }

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, coupons });
  } catch (err) {
    console.error('Error in Coupons API GET:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch coupons from database.' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const isAdmin = await verifyAdminRequest();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin session required to create coupons.' },
        { status: 401 }
      );
    }

    const data = await req.json();
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountNPR,
      usageLimit,
      expiresAt,
      isActive,
    } = data;

    if (!code || !discountType || typeof discountValue !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Coupon code, discount type, and discount value are required.' },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase().replace(/\s+/g, '');

    const newCoupon = await prisma.coupon.upsert({
      where: { code: cleanCode },
      update: {
        description: description || null,
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount) || 0,
        maxDiscountNPR: maxDiscountNPR ? Number(maxDiscountNPR) : null,
        usageLimit: usageLimit ? Number(usageLimit) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: typeof isActive === 'boolean' ? isActive : true,
      },
      create: {
        code: cleanCode,
        description: description || null,
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount) || 0,
        maxDiscountNPR: maxDiscountNPR ? Number(maxDiscountNPR) : null,
        usageLimit: usageLimit ? Number(usageLimit) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: typeof isActive === 'boolean' ? isActive : true,
      },
    });

    const allCoupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });

    recordAuditLog({
      eventType: 'COUPON_CREATED',
      actor: 'Store Owner',
      ipAddress: 'Admin Session',
      details: `Created/Updated promotional coupon "${cleanCode}" (${discountType} ${discountValue})`,
      severity: 'INFO',
    });

    return NextResponse.json({ success: true, coupon: newCoupon, coupons: allCoupons });
  } catch (err: unknown) {
    console.error('Error creating coupon:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to create coupon in database.' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const isAdmin = await verifyAdminRequest();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin session required to modify coupons.' },
        { status: 401 }
      );
    }

    const { id, isActive } = await req.json();
    if (!id || typeof isActive !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Coupon ID and active boolean required.' },
        { status: 400 }
      );
    }

    const updated = await prisma.coupon.update({
      where: { id },
      data: { isActive },
    });

    recordAuditLog({
      eventType: 'COUPON_STATUS_CHANGED',
      actor: 'Store Owner',
      ipAddress: 'Admin Session',
      details: `Coupon ID "${id}" active status changed to ${isActive}`,
      severity: 'INFO',
    });

    const allCoupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ success: true, coupon: updated, coupons: allCoupons });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to toggle coupon status.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const isAdmin = await verifyAdminRequest();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin session required to delete coupons.' },
        { status: 401 }
      );
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Coupon ID required.' },
        { status: 400 }
      );
    }

    await prisma.coupon.delete({ where: { id } });

    recordAuditLog({
      eventType: 'COUPON_DELETED',
      actor: 'Store Owner',
      ipAddress: 'Admin Session',
      details: `Permanently deleted coupon with ID "${id}"`,
      severity: 'WARNING',
    });

    const allCoupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ success: true, coupons: allCoupons });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete coupon.' },
      { status: 500 }
    );
  }
}
