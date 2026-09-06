export interface SmsNotification {
  to: string; // 10-digit mobile number
  text: string;
  senderId: string; // e.g. "PUJA_COLLECTION" / "SPARROW_SMS"
  timestamp: string;
}

export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendCodVerificationSms = (phone: string, otp: string): SmsNotification => {
  return {
    to: phone,
    text: `Your Puja Collection COD verification code is: ${otp}. Valid for 5 minutes. Do not share this OTP with anyone.`,
    senderId: 'PUJA_CLOTHING',
    timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  };
};

export const sendOrderConfirmedSms = (phone: string, orderId: string, totalNPR: number): SmsNotification => {
  return {
    to: phone,
    text: `Namaste! Your Puja Collection order #${orderId} for रू ${totalNPR.toLocaleString('en-IN')} has been confirmed. Quality inspection and packaging in progress. Delivery in 4-5 days.`,
    senderId: 'PUJA_CLOTHING',
    timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  };
};
