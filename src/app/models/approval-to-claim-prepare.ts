import { Paginateable } from './paginateable';

export class ApprovalToClaimPrepare extends Paginateable {
  beneficiaryName: string;
  documentId: string;
  items: Item[];
  nphiesRequestId: string;
  payerId: string;
  preAuthRefNo: string;
  requestId: number;
  responseId: number;
  responseTimestamp: string;
  status: string;
  totalNet: number;
  transactionDate: string;

  destinationId: string;
  episodeNo: number;
  preparedDate: string;
  totalPatientShare: number;
  totalPayerShare: number;
  totalBenefit: number;
  totalDiscount: number;
  maxLimit: number;
  maxPercent: number;
  claimType: string;
  totalPayerShareWithVat: number;

  constructor(body: {}) {
    super(body);

    this.beneficiaryName = body["beneficiaryName"];
    this.destinationId = body["destinationId"];
    this.documentId = body["documentId"];
    this.items = body["items"];
    this.nphiesRequestId = body["nphiesRequestId"];
    this.payerId = body["payerId"];
    this.preAuthRefNo = body["preAuthRefNo"];
    this.requestId = body["requestId"];
    this.responseId = body["responseId"];
    this.responseTimestamp = body["responseTimestamp"];
    this.status = body["status"];
    this.totalNet = body["totalNet"];
    this.transactionDate = body["transactionDate"];
    this.episodeNo = body["episodeNo"];
    this.preparedDate = body["preparedDate"];
    this.totalPatientShare = body["totalPatientShare"];
    this.totalPayerShare = body["totalPayerShare"];
    this.totalDiscount = body["totalDiscount"];  
    this.totalPayerShareWithVat = body["totalPayerShareWithVat"];     
    this.maxLimit = body["maxLimit"];    
    this.maxPercent = body["maxPercent"];  
    this.claimType = body["claimType"];  
  }
}

class Item {
  itemSequenceNo: number;
  approvedNet: number;
  grossAmount: number;
  itemCode: string;
  itemDescription: string;
  itemId: number;
  itemType: string;
  net: number;
  patientShare: number;
  payerSahare: number;
  status: string;
  benefitTax: number;
  patientInvoiceNo: string;
  tax: number;
  discount: number;
  payerShareWithVat:number;
}
