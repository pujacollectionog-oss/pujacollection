import { NextResponse } from 'next/server';
import { verifyOtpCode } from '@/lib/auth/otpStore';

export async function POST(req: Request) {
  try {
    const { email, phone, target, code } = await req.json();

    const targetIdentifier = String(email || target || phone || '').trim().toLowerCase();

    if (!targetIdentifier || !code) {
      return NextResponse.json(
        { success: false, error: 'Recipient address and 6-digit verification code are required.' },
        { status: 400 }
      );
    }

    const cleanCode = String(code).trim();

    if (cleanCode.length !== 6) {
      return NextResponse.json(
        { success: false, error: 'Verification code must be exactly 6 digits.' },
        { status: 400 }
      );
    }

    const result = verifyOtpCode(targetIdentifier, cleanCode);

    if (!result.valid) {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      verificationToken: result.verificationToken,
    });
  } catch (err: unknown) {
    console.error('Error in POST /api/verify-otp:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to verify verification code.' },
      { status: 500 }
    );
  }
}
