export class ClaimsSummary
 {

  statuses: string[];
  all_total:Number;
  all_gross: Number;
  all_netAmount: Number;
  all_VatAmount: Number;
  all_Patientshare: Number;
  all_disCount: Number;

  accepted_total: string;
  failed_total: string;
  notaccepted_total: string;
  batched_total: string;
  outstanding_total: string;
  under_process_total: string;
  paid_total: string;
  partially_paid_total: string;
  rejected_Total: string;
  invalid_Total: string;
  returend_Total: string;
  downloadable_Total: string;

  accepted_gross: string;
  failed_gross: string;
  notaccepted_gross: string;
  batched_gross: string;
  outstanding_gross: string;
  under_process_gross: string;
  paid_gross: string;
  partially_paid_gross: string;
  rejected_gross: string;
  invalid_gross: string;
  returend_gross: string;
  downloadable_gross: string;

  accepted_netAmount: string;
  failed_netAmount: string;
  notaccepted_netAmount: string;
  batched_netAmount: string;
  outstanding_netAmount: string;
  under_process_netAmount: string;
  paid_netAmount: string;
  partially_paid_netAmount: string;
  rejected_netAmount: string;
  invalid_netAmount: string;
  returend_netAmount: string;
  downloadable_netAmount: string;

  accepted_VatAmount: string;
  failed_VatAmount: string;
  notaccepted_VatAmount: string;
  batched_VatAmount: string;
  outstanding_VatAmount: string;
  under_process_VatAmount: string;
  paid_VatAmount: string;
  partially_paid_VatAmount: string;
  rejected_VatAmount: string;
  invalid_VatAmount: string;
  returend_VatAmount: string;
  downloadable_VatAmount: string;

  accepted_Patientshare: string;
  failed_Patientshare: string;
  notaccepted_Patientshare: string;
  batched_Patientshare: string
  outstanding_Patientshare: string;
  under_process_Patientshare: string;
  paid_Patientshare: string;
  partially_paid_Patientshare: string;
  rejected_Patientshare: string;
  invalid_Patientshare: string;
  returend_Patientshare: string;
  downloadable_Patientshare: string;

  accepted_disCount: string;
  failed_disCount: string;
  notaccepted_disCount: string;
  batched_disCount: string
  outstanding_disCount: string;
  under_process_disCount: string;
  paid_disCount: string;
  partially_paid_disCount: string;
  rejected_disCount: string;
  invalid_disCount: string;
  returend_disCount: string;
  downloadable_disCount: string;

  constructor(body: {} ,statuses?) {

    if (body != null) {
  this.statuses=statuses;
      this.all_total = body['all_total'];
      this.all_gross = body['all_gross'];
      this.all_netAmount = body['all_netAmount'];
      this.all_VatAmount = body['all_VatAmount'];
      this.all_Patientshare = body['all_Patientshare'];
      this.all_disCount = body['all_disCount'];

      this.accepted_total = body['accepted_total'];
      this.failed_total = body['failed_total'];
      this.notaccepted_total = body['notaccepted_total'];
      this.batched_total = body['batched_total'];
      this.outstanding_total = body['outstanding_total'];
      this.under_process_total = body['under_process_total'];
      this.paid_total = body['paid_total'];
      this.partially_paid_total = body['partially_paid_total'];
      this.rejected_Total = body['rejected_Total'];
      this.invalid_Total = body['invalid_Total'];
      this.returend_Total = body['returend_Total'];
      this.downloadable_Total = body['downloadable_Total'];

      this.accepted_gross = body['accepted_gross'];
      this.failed_gross = body['failed_gross'];
      this.notaccepted_gross = body['notaccepted_gross'];
      this.batched_gross = body['batched_gross'];
      this.outstanding_gross = body['outstanding_gross'];
      this.under_process_gross = body['under_process_gross'];
      this.paid_gross = body['paid_gross'];
      this.partially_paid_gross = body['partially_paid_gross'];
      this.rejected_gross = body['rejected_gross'];
      this.invalid_gross = body['invalid_gross'];
      this.returend_gross = body['returend_gross'];
      this.downloadable_gross = body['downloadable_gross'];

      this.accepted_netAmount = body['accepted_netAmount'];
      this.failed_netAmount = body['failed_netAmount'];
      this.notaccepted_netAmount = body['notaccepted_netAmount'];
      this.batched_netAmount = body['batched_netAmount'];
      this.outstanding_netAmount = body['outstanding_netAmount'];
      this.under_process_netAmount = body['under_process_netAmount'];
      this.paid_netAmount = body['paid_netAmount'];
      this.partially_paid_netAmount = body['partially_paid_netAmount'];
      this.rejected_netAmount = body['rejected_netAmount'];
      this.invalid_netAmount = body['invalid_netAmount'];
      this.returend_netAmount = body['returend_netAmount'];
      this.downloadable_netAmount = body['downloadable_netAmount'];

      this.accepted_VatAmount = body['accepted_VatAmount'];
      this.failed_VatAmount = body['failed_VatAmount'];
      this.notaccepted_VatAmount = body['notaccepted_VatAmount'];
      this.batched_VatAmount = body['batched_VatAmount'];
      this.outstanding_VatAmount = body['outstanding_VatAmount'];
      this.under_process_VatAmount = body['under_process_VatAmount'];
      this.paid_VatAmount = body['paid_VatAmount'];
      this.partially_paid_VatAmount = body['partially_paid_VatAmount'];
      this.rejected_VatAmount = body['rejected_VatAmount'];
      this.invalid_VatAmount = body['invalid_VatAmount'];
      this.returend_VatAmount = body['returend_VatAmount'];
      this.downloadable_VatAmount = body['downloadable_VatAmount'];

      this.accepted_Patientshare = body['accepted_Patientshare'];
      this.failed_Patientshare = body['failed_Patientshare'];
      this.notaccepted_Patientshare = body['notaccepted_Patientshare'];
      this.batched_Patientshare = body['batched_Patientshare'];
      this.outstanding_Patientshare = body['outstanding_Patientshare'];
      this.under_process_Patientshare = body['under_process_Patientshare'];
      this.paid_Patientshare = body['paid_Patientshare'];
      this.partially_paid_Patientshare = body['partially_paid_Patientshare'];
      this.rejected_Patientshare = body['rejected_Patientshare'];
      this.invalid_Patientshare = body['invalid_Patientshare'];
      this.returend_Patientshare = body['returend_Patientshare'];
      this.downloadable_Patientshare = body['downloadable_Patientshare'];
      this.accepted_disCount = body['accepted_disCount'];
      this.failed_disCount = body['failed_disCount'];
      this.notaccepted_disCount = body['notaccepted_disCount'];
      this.batched_disCount = body['batched_disCount'];
      this.outstanding_disCount = body['outstanding_disCount'];
      this.under_process_disCount = body['under_process_disCount'];
      this.paid_disCount = body['paid_disCount'];
      this.partially_paid_disCount = body['partially_paid_disCount'];
      this.rejected_disCount = body['rejected_disCount'];
      this.invalid_disCount = body['invalid_disCount'];
      this.returend_disCount = body['returend_disCount'];
      this.downloadable_disCount = body['downloadable_disCount'];
    }
  }

  public static emptySummaryWithStatuses(statuses: string[]): ClaimsSummary {
    
    return {
      statuses: statuses,
      all_total: 0,
      all_gross: 0,
      all_netAmount: 0,
      all_VatAmount: 0,
      all_Patientshare: 0,
      all_disCount: 0,
    
      accepted_total: null,
      failed_total: null,
      notaccepted_total: null,
      batched_total: null,
      outstanding_total: null,
      under_process_total: null,
      paid_total: null,
      partially_paid_total: null,
      rejected_Total: null,
      invalid_Total: null,
      returend_Total: null,
      downloadable_Total: null,
    
      accepted_gross: null,
      failed_gross: null,
      notaccepted_gross: null,
      batched_gross: null,
      outstanding_gross: null,
      under_process_gross: null,
      paid_gross: null,
      partially_paid_gross: null,
      rejected_gross: null,
      invalid_gross: null,
      returend_gross: null,
      downloadable_gross:null,
      accepted_netAmount: null,
      failed_netAmount: null,
      notaccepted_netAmount: null,
      batched_netAmount: null,
      outstanding_netAmount: null,
      under_process_netAmount: null,
      paid_netAmount: null,
      partially_paid_netAmount: null,
      rejected_netAmount: null,
      invalid_netAmount: null,
      returend_netAmount: null,
      downloadable_netAmount: null,
    
      accepted_VatAmount: null,
      failed_VatAmount: null,
      notaccepted_VatAmount: null,
      batched_VatAmount: null,
      outstanding_VatAmount: null,
      under_process_VatAmount: null,
      paid_VatAmount: null,
      partially_paid_VatAmount: null,
      rejected_VatAmount: null,
      invalid_VatAmount: null,
      returend_VatAmount: null,
      downloadable_VatAmount: null,
    
      accepted_Patientshare: null,
      failed_Patientshare: null,
      notaccepted_Patientshare: null,
      batched_Patientshare:null,
      outstanding_Patientshare: null,
      under_process_Patientshare: null,
      paid_Patientshare: null,
      partially_paid_Patientshare: null,
      rejected_Patientshare: null,
      invalid_Patientshare: null,
      returend_Patientshare: null,
      downloadable_Patientshare: null,
    
      accepted_disCount: null,
      failed_disCount: null,
      notaccepted_disCount: null,
      batched_disCount:null,
      outstanding_disCount: null,
      under_process_disCount: null,
      paid_disCount: null,
      partially_paid_disCount: null,
      rejected_disCount: null,
      invalid_disCount: null,
      returend_disCount: null,
      downloadable_disCount: null  };
  }

}
