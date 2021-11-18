export class AgingReportResponseModel {
    payerId: number;
    outstandingAmount: string;
    totalAmount: string;
    aged1to30 = 0;
    aged31to60 = 0;
    aged61to90 = 0;
    aged91to120 = 0;
    aged121to150 = 0;
    aged151to180 = 0;
    aged181to365 = 0;
    aged365 = 0;
    sum = 0;

}