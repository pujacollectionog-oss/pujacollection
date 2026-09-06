export interface FonepayQRData {
  merchantName: string;
  merchantCode: string;
  panNumber: string;
  amountNPR: number;
  traceId: string;
  remarks: string;
  qrPayload: string;
}

export const generateFonepayQR = (amountNPR: number, orderId: string): FonepayQRData => {
  const traceId = `FNP-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  
  // Standard EMVCo-compatible QR string format for Nepal Fonepay QR network
  const qrPayload = `00020101021226500010np.fonepay0113PUJA-COLLECT02109767784053520456915303524540${amountNPR.toString().length}${amountNPR}5802NP5922PUJA COLLECTION PVT6007RANGELI62${(orderId.length + 4).toString().padStart(2, '0')}01${orderId.length.toString().padStart(2, '0')}${orderId}6304`;

  return {
    merchantName: 'PUJA COLLECTION PVT. LTD.',
    merchantCode: 'PUJA-084-RANGELI',
    panNumber: '619842103',
    amountNPR,
    traceId,
    remarks: `Puja Collection Order #${orderId}`,
    qrPayload,
  };
};
