export class SearchStatusSummary {
  statuses: string[];
  totalClaims = 0;
  totalNetAmount = 0;
  totalVatNetAmount = 0;
  gross?: number = 0;
  uploadName: string;
  patientShare = 0;
  discount = 0;
  actualPaid = 0;
  actualDeducted = 0;

  constructor(body: {}) {
    if (body != null) {
      this.statuses = body['statuses'];
      this.totalClaims = body['totalNumber'];
      this.totalNetAmount = body['amount'];
      this.totalVatNetAmount = body['netVatAmount'];
      this.gross = body['gross'];
      this.uploadName = body['uploadName'];
      this.patientShare = body['patientShare'];
      this.discount - body['discount'];
      this.actualPaid = body['actualPaid'];
      this.actualDeducted = body['actualDeducted'];

    } else {
      this.statuses = ['-'];
    }
  }

  public static emptySummaryWithStatuses(statuses: string[]): SearchStatusSummary {
    return {
      statuses: statuses,
      totalClaims: 0,
      totalNetAmount: 0,
      totalVatNetAmount: 0,
      uploadName: null,
      gross: 0,
      patientShare: 0,
      discount: 0,
      actualPaid: 0,
      actualDeducted: 0
    };
  }
}
