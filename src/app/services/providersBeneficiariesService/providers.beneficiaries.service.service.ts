import { HttpClient, HttpErrorResponse, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BeneficiaryModel } from 'src/app/models/nphies/BeneficiaryModel';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProvidersBeneficiariesService {
  uploading = false;
  uploadingObs: Subject<boolean> = new Subject<boolean>();
  progress: { percentage: number } = { percentage: 0 };
  progressChange: Subject<{ percentage: number }> = new Subject();
  errorChange: Subject<string> = new Subject();
  error: string;
  summary: any;
  summaryChange: Subject<any> = new Subject<any>();

  constructor(private httpClient: HttpClient) {
    this.httpClient = httpClient;
    /*this.summary = new UploadSummary();
    this.summaryChange.subscribe((value) => {
        this.summary = value;
    });*/
    this.progressChange.subscribe(value => {
        this.progress = value;
    });
    this.errorChange.subscribe(value => this.error = value); }

  getBeneficiaryById(providerId: string, beneficiaryId: string, simplified: boolean = false) {
    const requestUrl = `/providers/${providerId}/beneficiaryId/${beneficiaryId}?simplified=${simplified}`;
    const httpRequest = new HttpRequest('GET', environment.providersBeneficiariesService + requestUrl);
    return this.httpClient.request(httpRequest);
  }

  saveBeneficiaries(beneficiaryModel: BeneficiaryModel, providerId: string) {
    const requestUrl = `/providers/${providerId}`;
    let body: any = { ...beneficiaryModel };
    const httpRequest = new HttpRequest('POST', environment.providersBeneficiariesService + requestUrl, body);
    return this.httpClient.request(httpRequest);
  }

  getPayers() {
    const requestUrl = `/lov/payers`;
    const httpRequest = new HttpRequest('GET', environment.providersBeneficiariesService + requestUrl);
    return this.httpClient.request(httpRequest);
  }

  beneficiaryFullTextSearch(providerId: string, query: string) {
    const requestUrl = `/providers/${providerId}/search?query=${query}`;
    const request = new HttpRequest('GET', environment.providersBeneficiariesService + requestUrl);
    return this.httpClient.request(request);
  }


  editBeneficiaries(providerId: string, beneficiaryId: string , beneficiaryModel: BeneficiaryModel){
    const requestUrl = `/providers/${providerId}/beneficiaryId/${beneficiaryId}`;
    let body: any = { ...beneficiaryModel };
    const httpRequest = new HttpRequest('PUT', environment.providersBeneficiariesService + requestUrl, body);
    return this.httpClient.request(httpRequest);

  }

  getPayees() {
    const requestUrl = `/lov/providers`;
    const httpRequest = new HttpRequest('GET', environment.providersBeneficiariesService + requestUrl);
    return this.httpClient.request(httpRequest);
  }

  getBeneficiaryFromCCHI(providerId: string,patientKey: string) {
    const requestUrl = `/providers/${providerId}/patientKey/${patientKey}`;
    const request = new HttpRequest('GET', environment.providersBeneficiariesService + requestUrl);
    return this.httpClient.request(request);
  }

  pushBeneFileToStorage(providerID: string, file: File) {
    if (this.uploading) { return; }
    this.uploading = true;
    this.uploadingObs.next(true);
    const formdata: FormData = new FormData();

    formdata.append('file', file, file.name);
    const req = new HttpRequest('POST', environment.providersBeneficiariesService + `/providers/${providerID}/beneficiaryUpload/file`, formdata, {
        reportProgress: true,
    });

    this.httpClient.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
            this.progressChange.next({ percentage: Math.round(100 * event.loaded / event.total) });
        } else if (event instanceof HttpResponse) {
            this.uploading = false;
            this.uploadingObs.next(false);
            const summary: any = JSON.parse(JSON.stringify(event.body));
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
