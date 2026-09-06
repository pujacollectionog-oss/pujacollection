export type CourierPartner = 'PATHAO' | 'UPAYA' | 'NEPAL_POST';

export interface CourierTrackingEvent {
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

export interface CourierShipment {
  consignmentId: string;
  partner: CourierPartner;
  partnerName: string;
  contactNumber: string;
  dispatchDate: string;
  estimatedDeliveryDate: string;
  origin: string;
  destination: string;
  trackingHistory: CourierTrackingEvent[];
}

export const assignCourierForDestination = (
  district: string,
  province: string
): { partner: CourierPartner; partnerName: string; contact: string; estDays: string } => {
  const valleyDistricts = ['Kathmandu', 'Lalitpur', 'Bhaktapur'];

  if (valleyDistricts.includes(district)) {
    return {
      partner: 'PATHAO',
      partnerName: 'Pathao Express Kathmandu',
      contact: '+977-1-5970099',
      estDays: '24–48 Hours',
    };
  }

  const remoteProvinces = ['Karnali', 'Sudurpashchim'];
  if (remoteProvinces.includes(province)) {
    return {
      partner: 'NEPAL_POST',
      partnerName: 'Nepal Post Express EMS',
      contact: '+977-1-4258836',
      estDays: '4–6 Days',
    };
  }

  return {
    partner: 'UPAYA',
    partnerName: 'Upaya CityCargo Nepal Logistics',
    contact: '+977-1-5970033',
    estDays: '3–4 Days',
  };
};

export const generateConsignmentNumber = (partner: CourierPartner): string => {
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  switch (partner) {
    case 'PATHAO':
      return `PTH-NP-${randomDigits}`;
    case 'UPAYA':
      return `UPY-NP-${randomDigits}`;
    case 'NEPAL_POST':
      return `EMS-NP-${randomDigits}`;
    default:
      return `NP-${randomDigits}`;
  }
};
