import { Paginateable } from './paginateable';

export class PaymentReconciliation extends Paginateable {

  reconciliationId: number;
  periodStartDate: string;
  periodEndDate: string;
  createdDate: string;
  issuerNphiesId: string;
  outcome: string;
  disposition: string;
  paymentDate: string;
  paymentAmount: number;
  paymentIdentifierId: number;
  reconciliationIdentifierId: string;
  reconciliationIdentifierUrl: string;
  providerNphiesId: number;
  paymentNoticeStatus: string;
  issuerName: string;
  notificationId: number;
  notificationStatus: string;
  tpaName:string;
  destinationId:string

  constructor(body: {}) {
    super(body);
    this.reconciliationId = body["reconciliationId"];
    this.periodStartDate = body["periodStartDate"];
    this.periodEndDate = body["periodEndDate"];
    this.createdDate = body["createdDate"];
    this.issuerNphiesId = body["issuerNphiesId"];
    this.outcome = body["outcome"];
    this.disposition = body["disposition"];
    this.paymentDate = body["paymentDate"];
    this.paymentAmount = body["paymentAmount"];
    this.paymentIdentifierId = body["paymentIdentifierId"];
    this.reconciliationIdentifierId = body["reconciliationIdentifierId"];
    this.reconciliationIdentifierUrl = body["reconciliationIdentifierUrl"];
    this.providerNphiesId = body["providerNphiesId"];
    this.paymentNoticeStatus = body["paymentNoticeStatus"];
    this.notificationId =  body["notificationId"];
    this.notificationStatus =  body["notificationStatus"];
    this.destinationId =  body["destinationId"];
    
    
  }
}
