import { NextResponse } from 'next/server';
import {
  getAllProductsFromDb,
  addProductToDb,
  deleteProductFromDb,
  updateStockInDb,
} from '@/lib/db/productsDb';
import { verifyAdminRequest } from '@/lib/auth/adminAuth';
import { recordAuditLog } from '@/lib/auth/adminAudit';
import type { MockProduct } from '@/lib/mock/products';

export async function GET() {
  const products = await getAllProductsFromDb();
  return NextResponse.json({ success: true, products });
}

export async function POST(req: Request) {
  try {
    const isAdmin = await verifyAdminRequest();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin session required to add products.' },
        { status: 401 }
      );
    }

    const product: MockProduct = await req.json();
    if (!product || !product.name || !product.id) {
      return NextResponse.json(
        { success: false, error: 'Valid product data required.' },
        { status: 400 }
      );
    }

    const updatedList = await addProductToDb(product);

    recordAuditLog({
      eventType: 'PRODUCT_ADDED',
      actor: 'Store Owner',
      ipAddress: 'Admin Session',
      details: `Added new product "${product.name}" (ID: ${product.id}, Price: NPR ${product.basePrice})`,
      severity: 'INFO',
    });

    return NextResponse.json({ success: true, products: updatedList });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: 'Failed to add product to database.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const isAdmin = await verifyAdminRequest();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin session required to delete products.' },
        { status: 401 }
      );
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID required.' },
        { status: 400 }
      );
    }

    const updatedList = await deleteProductFromDb(id);

    recordAuditLog({
      eventType: 'PRODUCT_DELETED',
      actor: 'Store Owner',
      ipAddress: 'Admin Session',
      details: `Removed product with ID "${id}" from catalog`,
      severity: 'WARNING',
    });

    return NextResponse.json({ success: true, products: updatedList });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete product.' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const isAdmin = await verifyAdminRequest();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin session required to adjust inventory stock.' },
        { status: 401 }
      );
    }

    const { id, delta } = await req.json();
    if (!id || typeof delta !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Product ID and delta required.' },
        { status: 400 }
      );
    }

    const updatedList = await updateStockInDb(id, delta);

    recordAuditLog({
      eventType: 'STOCK_UPDATED',
      actor: 'Store Owner',
      ipAddress: 'Admin Session',
      details: `Adjusted inventory stock for product ID "${id}" by ${delta > 0 ? `+${delta}` : delta}`,
      severity: 'INFO',
    });

    return NextResponse.json({ success: true, products: updatedList });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: 'Failed to update stock.' },
      { status: 500 }
    );
  }
}
