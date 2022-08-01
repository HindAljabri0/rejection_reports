export class SearchStatusSummary {
  statuses: string[];
  totalClaims = 0;
  totalNetAmount = 0;
  totalPatientShare = 0;
  totalPayerShare = 0;
  totalVatNetAmount = 0;
  totalTax = 0;
  gross?= 0;
  uploadName: string;
  uploadDate: string;
  patientShare = 0;
  discount = 0;
  actualPaid = 0;
  actualDeducted = 0;


  constructor(body: {}) {
    if (body != null) {
      this.statuses = body['statuses'];
      this.totalClaims = body['totalNumber'];
      this.totalNetAmount = body['amount'];
      this.totalPatientShare = body['totalPatientShare'];
      this.totalPayerShare = body['totalPayerShare'];
      this.totalVatNetAmount = body['netVatAmount'];
      this.totalTax = body['totalTax'];
      this.gross = body['gross'];
      this.uploadName = body['uploadName'];
      this.uploadDate = body['uploadDate'];
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
      statuses,
      totalClaims: 0,
      totalNetAmount: 0,
      totalPatientShare: 0,
      totalPayerShare: 0,
      totalVatNetAmount: 0,
      totalTax: 0,
      uploadName: null,
      uploadDate: null,
      gross: 0,
      patientShare: 0,
      discount: 0,
      actualPaid: 0,
      actualDeducted: 0
    };
  }
}
