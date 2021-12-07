export class ReconciliationReportResponse{
reconciliationId: number;
payerId:string;
duration:string;
 totalSubmittedAmount :any;
totalReceived :any;
 totalOutstandingAmount :any;
 promptDiscount :any;
 volumeDiscount	:any;
reconciliationAmount	: any;
 finalRejectionAmount	:any;
 totalReceivedPerc :any;
 promptDiscountPerc :any;
volumeDiscountPerc:any;
 finalRejectionAmountPerc :any;
}


export class SearchDiscountReconciliationReportResponse{
    duration:string;
    totalSubmittedAmount :any;
    totalReceived :any;
 totalOutstandingAmount :any;
}