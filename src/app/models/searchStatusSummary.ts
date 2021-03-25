export class SearchStatusSummary {
  statuses: string[];
  totalClaims = 0;
  totalNetAmount = 0;
  totalVatNetAmount = 0;
  gross?: number = 0;
  uploadName: string;

  constructor(body: {}) {
    if (body != null) {
      this.statuses = body['statuses'];
      this.totalClaims = body['totalNumber'];
      this.totalNetAmount = body['amount'];
      this.totalVatNetAmount = body['netVatAmount'];
      this.gross = body['gross'];
      this.uploadName = body['uploadName'];
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
      gross: 0
    };
  }
}
