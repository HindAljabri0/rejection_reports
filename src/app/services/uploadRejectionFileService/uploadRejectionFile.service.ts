import { UploadSummary } from 'src/app/models/uploadSummary';
import { Subject } from 'rxjs';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export class UploadRejectionFileService {
    summary: UploadSummary;
    summaryChange: Subject<UploadSummary> = new Subject<UploadSummary>();
    uploading = false;
    progress: { percentage: number } = { percentage: 0 };
    progressChange: Subject<{ percentage: number }> = new Subject();
    uploadingObs: Subject<boolean> = new Subject<boolean>();
    error: string;
    errorChange: Subject<string> = new Subject();
    constructor(private http: HttpClient) {
        this.http = http;
        this.summary = new UploadSummary();
        this.summaryChange.subscribe((value) => {
            this.summary = value;
        });
        this.progressChange.subscribe(value => {
            this.progress = value;
        });
        this.errorChange.subscribe(value => this.error = value);
    }


    getUploadedSummary(batchId: string, uploadId: number) {
        const requestUrl = `/providers/${batchId}/history/${uploadId}?`;
        const request = new HttpRequest('GET', environment.uploaderHost + requestUrl);
        return this.http.request(request);
    }

    getUploadedClaimsDetails(batchId: string, uploadId: number, status?: string, page?: number, pageSize?: number) {
        const requestUrl = `/providers/${batchId}/history/${uploadId}/details?` + (status != null ? `status=${status}&` : '')
            + (page != null ? `page=${page}&` : '') + (pageSize != null ? `size=${pageSize}` : '');
        const request = new HttpRequest('GET', environment.uploaderHost + requestUrl);
        return this.http.request(request);
    }


    pushFileToStorage(batchId: string, file: File) {
        if (this.uploading) { return; }
        this.uploading = true;
        this.uploadingObs.next(true);
        const formdata: FormData = new FormData();

        formdata.append('file', file, file.name);
        const req = new HttpRequest('POST', environment.uploaderHost + `/providers/${batchId}/file`, formdata, {
            reportProgress: true,
        });

        this.http.request(req).subscribe(event => {
            if (event.type === HttpEventType.UploadProgress) {
                this.progressChange.next({ percentage: Math.round(100 * event.loaded / event.total) });
            } else if (event instanceof HttpResponse) {
                this.uploading = false;
                this.uploadingObs.next(false);
                const summary: UploadSummary = JSON.parse(JSON.stringify(event.body));
                this.summaryChange.next(summary);
                this.progressChange.next({ percentage: 101 });
            }
        }, errorEvent => {
            this.uploading = false;
            this.uploadingObs.next(false);
            if (errorEvent instanceof HttpErrorResponse) {
                if (errorEvent.status >= 500) {
                    this.errorChange.next('Server could not handle your request at the moment. Please try again later.');
                } else if (errorEvent.status >= 400) {
                    this.errorChange.next(errorEvent.error['message']);
                } else { this.errorChange.next('Server could not be reached at the moment. Please try again later.'); }
            }
        });
    }


}