export class InsurancePlan {
  payerId: string;
  expiryDate: Date;
  memberCardId: string;
  isPrimary?: boolean;
  relationWithSubscriber: string;
  coverageType: string;
  payerNphiesId: string;
  maxLimit: number;
  patientShare: number;
  tpaNphiesId: string;
}
