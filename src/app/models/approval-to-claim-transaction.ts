import { Paginateable } from './paginateable';

export class ApprovalToClaimTransaction extends Paginateable {
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
  preparedTimeStamp: string;
  destinationId: string;
  episodeNo: string;
  preparedDate: string;
  totalPatientShare: number;
  totalPayerShare: number;
  convertToClaimEpisodeId: number;
  totalBenefit: number;

  constructor(body: {}) {
    super(body);

    this.beneficiaryName = body["beneficiaryName"];
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
    this.destinationId = body["destinationId"];
    this.episodeNo = body["episodeNo"];
    this.preparedDate = body["preparedDate"];
    this.totalPatientShare = body["totalPatientShare"];
    this.totalPayerShare = body["totalPayerShare"];
    this.convertToClaimEpisodeId = body["convertToClaimEpisodeId"];
    this.preparedTimeStamp = body["preparedTimeStamp"];
  }
}

class Item {
  itemSequenceNo: number;
  approvedNet: number;
  itemCode: string;
  itemDescription: string;
  itemId: number;
  itemType: string;
  net: number;
  patientShare: number;
  payerSahare: number;
  status: string;
  patientInvoiceNo: string;
  benefitTax: number;
  tax: number;
}
