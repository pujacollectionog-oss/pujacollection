/**
 * Resend Email Dispatcher for Puja Collection
 * 
 * Supports:
 * 1. Resend API via HTTPS endpoint (https://api.resend.com/emails)
 * 2. Automatic fallback to local server terminal in development mode if RESEND_API_KEY is not set.
 */

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmailWithResend({
  to,
  subject,
  html,
  from = process.env.RESEND_FROM_EMAIL || 'Puja Collection <orders@pujacollection.com.np>',
}: SendEmailParams): Promise<{ success: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject,
          html,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Resend API Error:', data);
        return { success: false, error: data.message || 'Failed to dispatch email via Resend' };
      }

      return { success: true, id: data.id };
    } catch (err: any) {
      console.error('Resend Network Error:', err);
      return { success: false, error: err.message || 'Network error communicating with Resend' };
    }
  }

  // Development / Local Test Mode: Log email to server console
  console.log('\n========================================');
  console.log('✉️  [RESEND EMAIL DISPATCH - DEV SIMULATION]');
  console.log(`To: ${to}`);
  console.log(`From: ${from}`);
  console.log(`Subject: ${subject}`);
  console.log('========================================\n');

  return { success: true, id: `sim_${Date.now()}` };
}

/**
 * Renders the official Puja Collection luxury HTML template for OTP verification
 */
export function renderEmailOtpTemplate(otpCode: string, customerName?: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Verify Your Puja Collection Order</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f6; margin: 0; padding: 40px 10px; color: #1a1c1b; }
        .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 24px; border: 1px solid #e2bec2; padding: 36px 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); text-align: center; }
        .logo-title { font-family: Georgia, serif; font-size: 26px; font-weight: bold; color: #a00041; letter-spacing: 0.5px; margin: 0 0 4px; }
        .subtitle { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #735c00; font-weight: 600; margin-bottom: 24px; }
        .divider { height: 1px; background: #f0e6e7; margin: 20px 0; }
        .otp-box { background: #fdf2f4; border: 2px dashed #a00041; border-radius: 16px; padding: 18px 24px; margin: 24px 0; }
        .otp-code { font-family: 'Courier New', monospace; font-size: 38px; font-weight: bold; letter-spacing: 10px; color: #a00041; margin: 0; }
        .note { font-size: 12px; color: #7a6669; line-height: 1.6; }
        .footer { margin-top: 28px; font-size: 11px; color: #9c8b8e; line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1 class="logo-title">PUJA COLLECTION</h1>
        <div class="subtitle">Rangeli-7, Morang, Nepal · Luxury Indian Ethnic Wear</div>
        <div class="divider"></div>
        
        <p style="font-size: 15px; color: #2d2426; margin: 0 0 10px;">
          Namaste${customerName ? ` <strong>${customerName}</strong>` : ''},
        </p>
        <p style="font-size: 13px; color: #5a4044; line-height: 1.5; margin: 0 0 20px;">
          Thank you for choosing Puja Collection. Please use the following 6-digit verification code to confirm your Cash on Delivery (COD) order.
        </p>
        
        <div class="otp-box">
          <div class="otp-code">${otpCode}</div>
        </div>
        
        <p class="note">
          ⏳ This verification code will expire in <strong>5 minutes</strong>.<br>
          For your security, never share this code with anyone.
        </p>
        
        <div class="divider"></div>
        
        <div class="footer">
          Puja Collection Boutique · Central Store, Rangeli-7, Morang, Nepal<br>
          Direct Inquiries / WhatsApp: +977 9811313666
        </div>
      </div>
    </body>
    </html>
  `;
}
