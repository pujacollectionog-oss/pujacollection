export interface Coupon {
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number; // percentage (e.g. 10) or fixed amount in NPR (e.g. 2000)
  minOrderNPR?: number;
  description: string;
}

export const VALID_COUPONS: Record<string, Coupon> = {
  PUJA2026: {
    code: 'PUJA2026',
    type: 'PERCENTAGE',
    value: 10,
    minOrderNPR: 10000,
    description: '10% Festive Discount on orders above रू 10,000',
  },
  BRIDAL5000: {
    code: 'BRIDAL5000',
    type: 'FIXED',
    value: 5000,
    minOrderNPR: 50000,
    description: 'रू 5,000 Off on Luxury Bridal Lehengas & Pure Silks',
  },
  FESTIVE: {
    code: 'FESTIVE',
    type: 'FIXED',
    value: 2000,
    minOrderNPR: 20000,
    description: 'रू 2,000 Seasonal Celebration Discount',
  },
};

export const applyCoupon = (code: string, subtotal: number): { valid: boolean; discount: number; message: string } => {
  const normalized = code.trim().toUpperCase();
  const coupon = VALID_COUPONS[normalized];

  if (!coupon) {
    return { valid: false, discount: 0, message: 'Invalid or expired coupon code' };
  }

  if (coupon.minOrderNPR && subtotal < coupon.minOrderNPR) {
    return {
      valid: false,
      discount: 0,
      message: `Requires minimum order value of रू ${coupon.minOrderNPR.toLocaleString('en-IN')}`,
    };
  }

  const discount =
    coupon.type === 'PERCENTAGE'
      ? Math.round((subtotal * coupon.value) / 100)
      : coupon.value;

  return {
    valid: true,
    discount,
    message: `Coupon "${coupon.code}" applied: ${coupon.description}`,
  };
};
