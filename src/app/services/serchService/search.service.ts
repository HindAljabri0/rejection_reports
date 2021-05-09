import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  getSummaries(
    providerId: string,
    statuses: string[],
    fromDate?: string,
    toDate?: string,
    payerId?: string,
    batchId?: string,
    uploadId?: string,
    casetype?: string,
    claimRefNo?: string,
    memberId?: string,
    invoiceNo?: string,
    patientFileNo?: string,
    policyNo?: string) {
    let requestURL = `/providers/${providerId}/claims?`;
    if (fromDate != null && toDate != null && payerId != null && (uploadId === null || uploadId === undefined)) {
      requestURL += 'fromDate=' + this.formatDate(fromDate)
        + '&toDate=' + this.formatDate(toDate) + '&payerId=' + payerId + '&status=' + statuses.toString();
      if (casetype != null) {
        requestURL += '&casetype=' + casetype;
      }
    }
    if (batchId != null && (uploadId === null || uploadId === undefined)) {
      if (batchId.includes('-')) {
        batchId = batchId.split('-')[1];
      }
      requestURL += 'batchId=' + batchId + '&status=' + statuses.toString();
    }
    if (uploadId != null) {
      requestURL += 'uploadId=' + uploadId + '&status=' + statuses.toString();
    }
    if (claimRefNo != null && (uploadId === null || uploadId === undefined)) {
      requestURL += `claimRefNo=${claimRefNo}` + '&status=' + statuses.toString();
    }
    if (memberId != null && (uploadId === null || uploadId === undefined)) {
      requestURL += `memberId=${memberId}` + '&status=' + statuses.toString();
    }
    if (invoiceNo != null && (uploadId === null || uploadId === undefined)) {
      requestURL += `invoiceNo=${invoiceNo}&status=${statuses.toString()}`;
    }
    if (patientFileNo != null && (uploadId === null || uploadId === undefined)) {
      requestURL += `patientFileNo=${patientFileNo}&status=${statuses.toString()}`;
    }
    if (policyNo != null && (uploadId === null || uploadId === undefined)) {
      requestURL += `policyNo=${policyNo}&status=${statuses.toString()}`;
    }
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
    return this.http.request(request);
  }
  formatDate(date: string) {
    const splittedDate = date.split('-');
    if (splittedDate[2].length == 4) {
      const formattedDate = `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`;
      return formattedDate;
    } else { return date; }
  }

  getResults(
    providerId: string,
    fromDate?: string,
    toDate?: string,
    payerId?: string,
    statuses?: string[],
    page?: number,
    pageSize?: number,
    batchId?: string,
    uploadId?: string,
    casetype?: string,
    claimRefNo?: string,
    memberId?: string,
    invoiceNo?: string,
    patientFileNo?: string,
    policyNo?: string,
    drname?: string,
    nationalId?: string,
    claimDate?: string) {
    if (page == null) { page = 0; }
    if (pageSize == null) { pageSize = 10; }
    let requestURL = `/providers/${providerId}/claims/details?`;
    if (fromDate != null && toDate != null && payerId != null && (uploadId === null || uploadId === undefined)) {
      requestURL += 'fromDate=' + this.formatDate(fromDate)
        + '&toDate=' + this.formatDate(toDate) + '&payerId=' + payerId + '&status=' + statuses.toString() +
        '&page=' + page + '&size=' + pageSize;
      if (casetype != null) { requestURL += '&casetype=' + casetype; }
    }
    if (batchId != null && (uploadId === null || uploadId === undefined)) {
      if (batchId.includes('-')) {
        batchId = batchId.split('-')[1];
      }
      requestURL += 'batchId=' + batchId + '&status=' + statuses.toString() + '&page=' + page + '&size=' + pageSize;
    }
    if (uploadId != null) {
      requestURL += 'uploadId=' + uploadId + '&status=' + statuses.toString() + '&page=' + page + '&size=' + pageSize;
      if (drname != null && drname !== '' && drname !== undefined) {
        requestURL += `&drname=${drname}`;
      }
      if (nationalId != null && nationalId !== '' && nationalId !== undefined) {
        requestURL += `&nationalId=${nationalId}`;
      }
      if (claimDate != null && claimDate !== '' && claimDate !== undefined) {
        requestURL += `&claimDate=${claimDate}`;
      }
      if (claimRefNo != null && claimRefNo !== '' && claimRefNo !== undefined) {
        requestURL += `&claimRefNo=${claimRefNo}`;
      }
      if (memberId != null && memberId !== '' && memberId !== undefined) {
        requestURL += `&memberId=${memberId}`;
      }
      if (patientFileNo != null && patientFileNo !== '' && patientFileNo !== undefined) {
        requestURL += `&patientFileNo=${patientFileNo}`;
      }
    }
    if (claimRefNo != null && (uploadId === null || uploadId === undefined)) {
      requestURL += `claimRefNo=${claimRefNo}` + '&status=' + statuses.toString() + '&page=' + page + '&size=' + pageSize;
    }
    if (memberId != null && (uploadId === null || uploadId === undefined)) {
      requestURL += `memberId=${memberId}` + '&status=' + statuses.toString() + '&page=' + page + '&size=' + pageSize;
    }
    if (invoiceNo != null && (uploadId === null || uploadId === undefined)) {
      requestURL += `invoiceNo=${invoiceNo}&status=${statuses.toString()}` + '&page=' + page + '&size=' + pageSize;
    }
    if (patientFileNo != null && (uploadId === null || uploadId === undefined)) {
      requestURL += `patientFileNo=${patientFileNo}&status=${statuses.toString()}` + '&page=' + page + '&size=' + pageSize;
    }
    if (policyNo != null && (uploadId === null || uploadId === undefined)) {
      requestURL += `policyNo=${policyNo}&status=${statuses.toString()}` + '&page=' + page + '&size=' + pageSize;
    }
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
    return this.http.request(request);
  }

  downloadSummaries(
    providerId: string,
    statuses: string[],
    fromDate?: string,
    toDate?: string,
    payerId?: string,
    batchId?: string,
    uploadId?: string,
    claimRefNo?: string,
    memberId?: string,
    invoiceNo?: string,
    patientFileNo?: string,
    policyNo?: string,
    drname?: string,
    nationalId?: string,
    claimDate?: string) {
    let requestURL = `/providers/${providerId}/claims/download?status=${statuses.toString()}`;
    if (fromDate != null && toDate != null && payerId != null && (uploadId === null || uploadId === undefined)) {
      requestURL += `&fromDate=${this.formatDate(fromDate)}&toDate=${this.formatDate(toDate)}&payerId=${payerId}`;
    } else if (batchId != null && (uploadId === null || uploadId === undefined)) {
      if (batchId.includes('-')) {
        batchId = batchId.split('-')[1];
      }
      requestURL += `&batchId=${batchId}`;
    } else if (uploadId != null) {
      requestURL += `&uploadId=${uploadId}`;
      if (drname != null && drname !== '' && drname !== undefined) {
        requestURL += `&drname=${drname}`;
      }
      if (nationalId != null && nationalId !== '' && nationalId !== undefined) {
        requestURL += `&nationalId=${nationalId}`;
      }
      if (claimDate != null && claimDate !== '' && claimDate !== undefined) {
        requestURL += `&claimDate=${claimDate}`;
      }
      if (claimRefNo != null && claimRefNo !== '' && claimRefNo !== undefined) {
        requestURL += `&claimRefNo=${claimRefNo}`;
      }
      if (memberId != null && memberId !== '' && memberId !== undefined) {
        requestURL += `&memberId=${memberId}`;
      }
      if (patientFileNo != null && patientFileNo !== '' && patientFileNo !== undefined) {
        requestURL += `&patientFileNo=${patientFileNo}`;
      }

    } else if (claimRefNo != null && (uploadId === null || uploadId === undefined)) {
      requestURL += `&claimRefNo=${claimRefNo}`;
    } else if (memberId != null && (uploadId === null || uploadId === undefined)) {
      requestURL += `&memberId=${memberId}`;
    } else if (invoiceNo != null && (uploadId === null || uploadId === undefined)) {
      requestURL += `&invoiceNo=${invoiceNo}`;
    } else if (patientFileNo != null && (uploadId === null || uploadId === undefined)) {
      requestURL += `&patientFileNo=${patientFileNo}`;
    } else if (policyNo != null && (uploadId === null || uploadId === undefined)) {
      requestURL += `&policyNo=${policyNo}`;
    }

    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL, '', { responseType: 'text' });
    return this.http.request(request);
  }

  getClaim(providerId: string, claimId: string) {
    const requestURL = `/providers/${providerId}/claims/${claimId}`;
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
    return this.http.request(request);
  }

  getTopFiveRejections(rejectionBy: string, providerId: string, payerId: string, fromDate: string, toDate: string) {
    const requestURL = `/providers/${providerId}/top/${rejectionBy.toUpperCase()}?payerId=${payerId}&fromDate=${this.formatDate(fromDate)}&toDate=${this.formatDate(toDate)}`;
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
    return this.http.request(request);
  }


  getUploadSummaries(providerId: string, page?: number, size?: number) {
    if (page == null) {
      page = 0;
    }
    if (size == null) {
      size = 10;
    }
    const requestUrl = `/providers/${providerId}/uploads?page=${page}&size=${size}`;
    const request = new HttpRequest('GET', environment.claimSearchHost + requestUrl);
    return this.http.request(request);
  }
}
