import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { SummaryType } from 'src/app/models/allCreditSummaryDetailsModels/summaryType';
import { UploadSummary } from 'src/app/models/uploadSummary';
import { environment } from 'src/environments/environment';

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
        { label: 'B.2 Charges / service included, bundled or part of billed procedure / consultation or management.', type: SummaryType.management },
        { label: 'B.3 Duplicate / Repeated Billing / Finally Settled ', type: SummaryType.finSettled },
        { label: '"C- Pricelist Shortfall / Billed"<br>"Above Contractual / Agreed Prices"', type: SummaryType.priceShortFall },
        { label: 'C.1 Not covered by the effective insurance policy (condition /service) / within the waiting period', type: SummaryType.waitingPeriod },
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
    ]
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

    getCreditReportSummary(batchId: string) {
        const requestUrl = `/providers/${batchId}/history`;
        const request = new HttpRequest('GET', environment.uploaderHost + requestUrl);
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

    pushFileToStorage(batchId: string, file: File): Observable<any> {
        const formdata: FormData = new FormData();
        formdata.append('file', file, file.name);
        const req = new HttpRequest('POST', environment.claimSearchHost + `/providers/${batchId}/report/rejected/upload`, formdata);
        return this.http.request(req);
    }
}