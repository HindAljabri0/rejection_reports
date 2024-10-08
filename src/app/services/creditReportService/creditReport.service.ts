import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SummaryType } from 'src/app/models/allCreditSummaryDetailsModels/summaryType';
import { UploadSummary } from 'src/app/models/uploadSummary';
import { SearchObject } from 'src/app/modules/reports/components/tawuniya-credit-report-details/tawuniya-credit-report-details.component';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CreditReportService {
    detailsConfig = [
        { label: 'Invalid Membership', type: SummaryType.invalMem },
        { label: 'Difference in Computation', type: SummaryType.diffInCom },
        { label: 'Claims not Received', type: SummaryType.claNotRec },
        { label: 'Invalid Service Code', type: SummaryType.invaSouCod },
        { label: 'Late Submission', type: SummaryType.lateSub },
        { label: 'Subtotal batch difference', type: SummaryType.subTotBatDiff },
        { label: 'A. Appropriateness of Care', type: SummaryType.approCare },
        { label: 'B. Technical / Contractual', type: SummaryType.techContr },
        { label: 'B.1 Consultation within the free follow-up period ', type: SummaryType.followUpPeriod },
        {
            label: 'B.2 Charges / service included, bundled or part of billed procedure / consultation or management.',
            type: SummaryType.management
        },
        { label: 'B.3 Duplicate / Repeated Billing / Finally Settled ', type: SummaryType.finSettled },
        { label: '"C- Pricelist Shortfall / Billed"<br>"Above Contractual / Agreed Prices"', type: SummaryType.priceShortFall },
        {
            label: 'C.1 Not covered by the effective insurance policy (condition /service) / within the waiting period',
            type: SummaryType.waitingPeriod
        },
        { label: 'C.2 Out of validity of effective insurance policy. ', type: SummaryType.insPolicy },
        { label: 'C.3 Age / gender not matching with the type of service provided.', type: SummaryType.serProvided },
        { label: 'D. Policy Compliance', type: SummaryType.poliCompi },
        { label: 'E. Pre-authorization', type: SummaryType.preAuth },
        { label: 'D.1 Requires pre-authorisation per policy.', type: SummaryType.reqPolicy },
        { label: 'D.2 Not part of pre-authorisation request', type: SummaryType.authRequest },
        { label: 'D.3 Already rejected / Cancelled at pre-authorisation ', type: SummaryType.preAuthorization },
        { label: 'F. Unwarranted Variations', type: SummaryType.unwanTedVar },
        { label: 'G- Pharmacy Benefit Management', type: SummaryType.pharmecyBen },
        { label: 'Subtotal deductions', type: SummaryType.subTotDed },
        { label: 'Presented Net Billed', type: SummaryType.presentNetBill },
        { label: 'Batch Difference', type: SummaryType.batcDiff },
        { label: 'Discount Difference', type: SummaryType.disDiff },
        { label: 'Deductible Difference', type: SummaryType.dedDiff },
        { label: 'Deduction', type: SummaryType.deduct },
        { label: 'Pending', type: SummaryType.pending },
        { label: 'Grand Total Rejections amounts', type: SummaryType.grTotRejAm },
        { label: 'Approved to pay', type: SummaryType.approPay },
    ];
    summary: UploadSummary;
    summaryChange: Subject<UploadSummary> = new Subject<UploadSummary>();
    uploading = false;
    progress: { percentage: number } = { percentage: 0 };
    progressChange: Subject<{ percentage: number }> = new Subject();
    uploadingObs: Subject<boolean> = new Subject<boolean>();
    error: string;

    constructor(private http: HttpClient) {
        this.http = http;
    }

    getCreditReportSummary(providerId: string, data: any) {
        const requestUrl = `/providers/${providerId}/report/rejected/summary`;
        const formdata: FormData = new FormData();
        // data = JSON.stringify(data);
        const request = new HttpRequest('POST', environment.creditReportService + requestUrl, data);
        return this.http.request(request);
    }

    getCreditReportSumaryDetails(batchId: string, summaryType: number, status?: string, page?: number, pageSize?: number) {
        const requestUrl = `/providers/${batchId}/history/${summaryType}/details?` + (status != null ? `status=${status}&` : '')
            + (page != null ? `page=${page}&` : '') + (pageSize != null ? `size=${pageSize}` : '');
        const request = new HttpRequest('GET', environment.uploaderHost + requestUrl);
        return this.http.request(request);
    }

    getCreditReportsList(batchId: string) {
        const requestUrl = `/providers/${batchId}/history`;
        const request = new HttpRequest('GET', environment.uploaderHost + requestUrl);
        return this.http.request(request);
    }

    pushFileToStorage(batchId: string, payerId: any, file: File): Observable<any> {
        const formdata: FormData = new FormData();
        formdata.append('file', file, file.name);
        formdata.append('payerId', payerId);
        const req = new HttpRequest('POST', environment.creditReportService + `/providers/${batchId}/report/rejected/upload`, formdata);
        return this.http.request(req);
    }

    listBupaCreditReports(providerId: string, data: any) {
        if (data.receivedFromDate != null) {
            data.receivedFromDate = data.receivedFromDate.format('YYYY-MM-DD');
        }

        if (data.receivedToDate != null) {
            data.receivedToDate = data.receivedToDate.format('YYYY-MM-DD');
        }

        const requestURL = `/providers/${providerId}/report/rejected/list`;
        const request = new HttpRequest('POST', environment.creditReportService + requestURL, data);
        return this.http.request(request);
    }

    listTawuniyaCreditReports(
        providerId: string, status: string, fromDate: string, toDate: string, batchId: string, page: number,
        pageSize: number
    ) {
        let requestURL = `/providers/${providerId}?page=${page}&size=${pageSize}`;
        if (status != null && status != 'All') {
            requestURL += `&status=${status}`;
        }
        if (fromDate != null) {
            requestURL += `&fromDate=${fromDate}`;

        }
        if (toDate != null) {
            requestURL += `&toDate=${toDate}`;
        }
        if (batchId != null) {
            requestURL += `&batchId=${batchId}`;
        }

        const request = new HttpRequest('GET', environment.tawuniyaCreditReportService + requestURL);
        return this.http.request(request);
    }


    getTawuniyaCreditReport(providerId: string, batchId: string) {
        const requestURL = `/providers/${providerId}/batches/${batchId}`;
        const request = new HttpRequest('GET', environment.tawuniyaCreditReportService + requestURL);
        return this.http.request(request);
    }
    // , serviceCode: string, servicedescription: string, rejectionReason: string, comments: string, exceedPrice: string
    // , deductedAmount: string, agree: string,
    getTawuniyaCreditReportServices(
        providerId: string, batchId: string, serviceType: 'deducted-services' | 'rejected-services',  appliedFilters:SearchObject[],
        page: number, size: number) {
        let requestURL = `/providers/${providerId}/batches/${batchId}/${serviceType}?page=${page}&size=${size}`;

        if (appliedFilters != null && appliedFilters.length > 0 ) {
            for (var value  of appliedFilters)  {
                requestURL += `&${value.nameColumn}=${value.value}`;
            }
           
        }
        const request = new HttpRequest('GET', environment.tawuniyaCreditReportService + requestURL);
        return this.http.request(request);
    }

    getTawuniyaCreditReportDetail(providerId: string, batchId: string, serialNo: string, rejectionType: string) {
        const requestURL = `/providers/${providerId}/batches/${batchId}/serials/${serialNo}?rejectionType=${rejectionType}`;
        const request = new HttpRequest('GET', environment.tawuniyaCreditReportService + requestURL);
        return this.http.request(request);
    }

    submitTawuniyaCreditReport(providerId: string, batchId: string) {
        const requestURL = `/providers/${providerId}/${batchId}/submit`;
        const request = new HttpRequest('POST', environment.tawuniyaCreditReportService + requestURL, null);
        return this.http.request(request);
    }
    showsTwaniyaReportsError(providerId: string, batchId: string, page: number, pageSize: number) {
        const requestURL = `/providers/${providerId}/batches/${batchId}/errors?page=${page}&size=${pageSize}`;
        const request = new HttpRequest('GET', environment.tawuniyaCreditReportService + requestURL, null);
        return this.http.request(request);
    }

    sendTwaniyaReportsFeedback(
        providerId: string, batchId: string, serialNo: string, serviceType: 'deducted' | 'rejected',
        agree: boolean, comment: string, attachment: File) {
        const requestURL = `/providers/${providerId}/batches/${batchId}/${serialNo}/feedback`;
        const formData: FormData = new FormData();
        formData.append('rejectionType', serviceType);
        formData.append('agree', `${agree}`);
        formData.append('comment', comment);

        if (attachment !== undefined && attachment !== null && attachment.name !== undefined && attachment.name !== null) {
            formData.append('file', attachment, attachment.name);
        }

        const request = new HttpRequest('POST', environment.tawuniyaCreditReportService + requestURL, formData);
        return this.http.request(request);
    }

    sendTwaniyaReportsFeedbacks(
        providerId: string, batchId: string, serviceType: 'deducted' | 'rejected',
        body: { agree: true, serialNumbers: string[] } | { comment: string, agree: false, serialNumbers: string[] }) {
        const requestURL = `/providers/${providerId}/batches/${batchId}/feedback/${serviceType}`;
        const request = new HttpRequest('POST', environment.tawuniyaCreditReportService + requestURL, body);
        return this.http.request(request);
    }
}
