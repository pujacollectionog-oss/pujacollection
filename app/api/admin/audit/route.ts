import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/auth/adminAuth';
import { getRecentAuditLogs } from '@/lib/auth/adminAudit';

export async function GET() {
  try {
    const isAdmin = await verifyAdminRequest();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin session required to view audit logs.' },
        { status: 401 }
      );
    }

    const logs = getRecentAuditLogs(50);
    return NextResponse.json({ success: true, logs });
  } catch (err) {
    console.error('Error fetching audit logs:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve security audit logs.' },
      { status: 500 }
    );
  }
}
