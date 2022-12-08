import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DatePipe, formatDate } from '@angular/common';

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
        organizationId?: string,
        batchId?: string,
        uploadId?: string,
        casetype?: string,
        claimRefNo?: string,
        memberId?: string,
        invoiceNo?: string,
        patientFileNo?: string,
        policyNo?: string,
        nationalId?: string) {
        let requestURL = `/providers/${providerId}/claims?`;
        if (fromDate != null && toDate != null && (payerId != null || organizationId != null)) {
            requestURL += 'fromDate=' + this.formatDate(fromDate)
                + '&toDate=' + this.formatDate(toDate) + (payerId != null ? ('&payerId=' + payerId) : ('&organizationId=' + organizationId)) + '&';
            if (casetype != null) {
                requestURL += 'casetype=' + casetype + '&';
            }
        }
        if (batchId != null) {
            if (batchId.includes('-')) {
                batchId = batchId.split('-')[1];
            }
            requestURL += `batchId=${batchId}&`;
        }
        if (uploadId != null) {
            requestURL += `uploadId=${uploadId}&`;
        }

        if (invoiceNo != null) {
            requestURL += `invoiceNo=${invoiceNo}&`;
        }

        if (policyNo != null) {
            requestURL += `policyNo=${policyNo}&`;
        }
        if (claimRefNo != null) {
            requestURL += `claimRefNo=${claimRefNo}&`;
        }
        if (memberId != null) {
            requestURL += `memberId=${memberId}&`;
        }
        if (patientFileNo != null) {
            requestURL += `patientFileNo=${patientFileNo}&`;
        }
        if (nationalId != null) {
            requestURL += `nationalId=${nationalId}&`;
        }
        requestURL += `status=${statuses.toString()}`;
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
        organizationId?: string,
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
        drName?: string,
        nationalId?: string,
        claimDate?: string,
        netAmount?: string,
        batchNo?: string) {
        if (page == null) { page = 0; }
        if (pageSize == null) { pageSize = 10; }
        let requestURL = `/providers/${providerId}/claims/details?`;
        if (fromDate != null && toDate != null && (payerId != null || organizationId != null)) {
            requestURL += 'fromDate=' + this.formatDate(fromDate)
                + '&toDate=' + this.formatDate(toDate) + (payerId != null ? ('&payerId=' + payerId) : ('&organizationId=' + organizationId)) + '&';
            if (casetype != null) {
                requestURL += 'casetype=' + casetype + '&';
            }
        }
        if (batchId != null) {
            if (batchId.includes('-')) {
                batchId = batchId.split('-')[1];
            }
            requestURL += `batchId=${batchId}&`;
        }
        if (uploadId != null) {
            requestURL += `uploadId=${uploadId}&`;
        }

        if (invoiceNo != null) {
            requestURL += `invoiceNo=${invoiceNo}&`;
        }

        if (policyNo != null) {
            requestURL += `policyNo=${policyNo}&`;
        }
        if (claimRefNo != null) {
            requestURL += `claimRefNo=${claimRefNo}&`;
        }
        if (memberId != null) {
            requestURL += `memberId=${memberId}&`;
        }
        if (patientFileNo != null) {
            requestURL += `patientFileNo=${patientFileNo}&`;
        }
        if (drName != null && drName !== '' && drName !== undefined) {
            requestURL += `drName=${drName}&`;
        }
        if (nationalId != null && nationalId !== '' && nationalId !== undefined) {
            requestURL += `nationalId=${nationalId}&`;
        }
        if (claimDate != null && claimDate !== '' && claimDate !== undefined) {
            requestURL += `claimDate=${claimDate}&`;
        }
        if (netAmount != null && netAmount !== '' && netAmount !== undefined) {
            requestURL += `netAmount=${netAmount}&`;
        }
        if (batchNo != null && batchNo !== '' && batchNo !== undefined) {
            requestURL += `batchNo=${batchNo}&`;
        }
        requestURL += `status=${statuses.toString()}` + '&page=' + page + '&size=' + pageSize;
        const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
        return this.http.request(request);
    }

    downloadSummaries(
        providerId: string,
        statuses: string[],
        fromDate?: string,
        toDate?: string,
        payerId?: string,
        organizationId?: string,
        batchId?: string,
        uploadId?: string,
        claimRefNo?: string,
        memberId?: string,
        invoiceNo?: string,
        patientFileNo?: string,
        policyNo?: string,
        drname?: string,
        nationalId?: string,
        claimDate?: string,
        netAmount?: string,
        batchNo?: string) {
        let requestURL = `/providers/${providerId}/claims?status=${statuses.toString()}`;
        if (fromDate != null && toDate != null && (payerId != null || organizationId != null) && (uploadId === null || uploadId === undefined)) {
            requestURL += `&fromDate=${this.formatDate(fromDate)}&toDate=${this.formatDate(toDate)}&payerId=${payerId}&organizationId=${organizationId}`;
        } else if (batchId != null && (uploadId === null || uploadId === undefined)) {
            if (batchId.includes('-')) {
                batchId = batchId.split('-')[1];
            }
            requestURL += `&batchId=${batchId}`;
        }
        if (uploadId != null) {
            requestURL += `&uploadId=${uploadId}`;
        }
        if (claimRefNo != null && (uploadId === null || uploadId === undefined)) {
            requestURL += `&claimRefNo=${claimRefNo}`;
        }
        if (memberId != null && (uploadId === null || uploadId === undefined)) {
            requestURL += `&memberId=${memberId}`;
        }
        if (invoiceNo != null && (uploadId === null || uploadId === undefined)) {
            requestURL += `&invoiceNo=${invoiceNo}`;
        }
        if (patientFileNo != null && (uploadId === null || uploadId === undefined)) {
            requestURL += `&patientFileNo=${patientFileNo}`;
        }
        if (policyNo != null && (uploadId === null || uploadId === undefined)) {
            requestURL += `&policyNo=${policyNo}`;
        }
        if (drname != null && drname !== '' && drname !== undefined) {
            requestURL += `&drname=${drname}`;
        }
        if (nationalId != null && nationalId !== '' && nationalId !== undefined) {
            requestURL += `&nationalId=${nationalId}`;
        }
        if (claimDate != null && claimDate !== '' && claimDate !== undefined) {
            requestURL += `&claimDate=${claimDate}`;
        }
        if (netAmount != null && netAmount !== '' && netAmount !== undefined) {
            requestURL += `&netAmount=${netAmount}`;
        }
        if (batchNo != null && batchNo !== '' && batchNo !== undefined) {
            requestURL += `&batchNo=${batchNo}`;
        }
        const request = new HttpRequest('GET', environment.claimsDownloadsService + requestURL, '', { responseType: 'text', reportProgress: true });
        return this.http.request(request);
    }

    downloadMultiSheetSummaries(
        providerId: string,
        statuses: string[],
        fromDate?: string,
        toDate?: string,
        payerId?: string,
        organizationId?: string,
        batchId?: string,
        uploadId?: string,
        claimRefNo?: string,
        memberId?: string,
        invoiceNo?: string,
        patientFileNo?: string,
        policyNo?: string,
        drname?: string,
        nationalId?: string,
        claimDate?: string,
        netAmount?: string,
        batchNo?: string) {
        let requestURL = `/providers/${providerId}/claims/multisheet?status=${statuses.toString()}`;
        if (fromDate != null && toDate != null && (payerId != null || organizationId != null) && (uploadId === null || uploadId === undefined)) {
            requestURL += `&fromDate=${this.formatDate(fromDate)}&toDate=${this.formatDate(toDate)}&payerId=${payerId}&organizationId=${organizationId}`;
        } else if (batchId != null && (uploadId === null || uploadId === undefined)) {
            if (batchId.includes('-')) {
                batchId = batchId.split('-')[1];
            }
            requestURL += `&batchId=${batchId}`;
        }
        if (uploadId != null) {
            requestURL += `&uploadId=${uploadId}`;
        }
        if (claimRefNo != null && (uploadId === null || uploadId === undefined)) {
            requestURL += `&claimRefNo=${claimRefNo}`;
        }
        if (memberId != null && (uploadId === null || uploadId === undefined)) {
            requestURL += `&memberId=${memberId}`;
        }
        if (invoiceNo != null && (uploadId === null || uploadId === undefined)) {
            requestURL += `&invoiceNo=${invoiceNo}`;
        }
        if (patientFileNo != null && (uploadId === null || uploadId === undefined)) {
            requestURL += `&patientFileNo=${patientFileNo}`;
        }
        if (policyNo != null && (uploadId === null || uploadId === undefined)) {
            requestURL += `&policyNo=${policyNo}`;
        }
        if (drname != null && drname !== '' && drname !== undefined) {
            requestURL += `&drname=${drname}`;
        }
        if (nationalId != null && nationalId !== '' && nationalId !== undefined) {
            requestURL += `&nationalId=${nationalId}`;
        }
        if (claimDate != null && claimDate !== '' && claimDate !== undefined) {
            requestURL += `&claimDate=${claimDate}`;
        }
        if (netAmount != null && netAmount !== '' && netAmount !== undefined) {
            requestURL += `&netAmount=${netAmount}`;
        }
        if (batchNo != null && batchNo !== '' && batchNo !== undefined) {
            requestURL += `&batchNo=${batchNo}`;
        }
        const request = new HttpRequest('GET', environment.claimsDownloadsService + requestURL, '', { responseType: 'text', reportProgress: true });
        return this.http.request(request);
    }

    downloadExcelSummaries(
        providerId: string,
        statuses: string[],
        fromDate?: string,
        toDate?: string,
        payerId?: string,
        organizationId?: string,
        batchId?: string,
        uploadId?: string,
        claimRefNo?: string,
        memberId?: string,
        invoiceNo?: string,
        patientFileNo?: string,
        policyNo?: string,
        drname?: string,
        nationalId?: string,
        claimDate?: string,
        netAmount?: string,
        batchNo?: string) {
        let requestURL = `/providers/${providerId}/claims/download/excel?status=${statuses.toString()}`;
        if (fromDate != null && toDate != null && (payerId != null || organizationId != null) && (uploadId === null || uploadId === undefined)) {
            requestURL += `&fromDate=${this.formatDate(fromDate)}&toDate=${this.formatDate(toDate)}&payerId=${payerId}&organizationId=${organizationId}`;
        } else if (batchId != null && (uploadId === null || uploadId === undefined)) {
            if (batchId.includes('-')) {
                batchId = batchId.split('-')[1];
            }
            requestURL += `&batchId=${batchId}`;
        }
        if (uploadId != null) {
            requestURL += `&uploadId=${uploadId}`;
        }
        if (claimRefNo != null && (uploadId === null || uploadId === undefined)) {
            requestURL += `&claimRefNo=${claimRefNo}`;
        }
        if (memberId != null && (uploadId === null || uploadId === undefined)) {
            requestURL += `&memberId=${memberId}`;
        }
        if (invoiceNo != null && (uploadId === null || uploadId === undefined)) {
            requestURL += `&invoiceNo=${invoiceNo}`;
        }
        if (patientFileNo != null && (uploadId === null || uploadId === undefined)) {
            requestURL += `&patientFileNo=${patientFileNo}`;
        }
        if (policyNo != null && (uploadId === null || uploadId === undefined)) {
            requestURL += `&policyNo=${policyNo}`;
        }
        if (drname != null && drname !== '' && drname !== undefined) {
            requestURL += `&drname=${drname}`;
        }
        if (nationalId != null && nationalId !== '' && nationalId !== undefined) {
            requestURL += `&nationalId=${nationalId}`;
        }
        if (claimDate != null && claimDate !== '' && claimDate !== undefined) {
            requestURL += `&claimDate=${claimDate}`;
        }
        if (netAmount != null && netAmount !== '' && netAmount !== undefined) {
            requestURL += `&netAmount=${netAmount}`;
        }
        if (batchNo != null && batchNo !== '' && batchNo !== undefined) {
            requestURL += `&batchNo=${batchNo}`;
        }
        const request = new HttpRequest('GET', environment.claimsDownloadsService + requestURL, '', { responseType: 'text', reportProgress: true });
        return this.http.request(request);
    }

    getClaim(providerId: string, claimId: string) {
        const requestURL = `/providers/${providerId}/claims/${claimId}`;
        const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
        return this.http.request(request);
    }


    getClaimsSummary(providerId: string, payerId: string, fromDate: string, toDate: string, statuses: string[]) {
        const requestURL = `/providers/${providerId}/payerId/${payerId}/ClaimsSummary?fromDate=${this.formatDate(fromDate)}&toDate=${this.formatDate(toDate)}&statuses=${statuses.toString()}`;
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

    getGssData(providerId: string, payer: string, fromDate: string, toDate: string, page?: number, size?: number) {

        const requestUrl = `/providers/${providerId}/gss?payer=${payer}&fromDate=${fromDate}&toDate=${toDate}&page=${page}&pageSize=${size}`;
        const request = new HttpRequest('GET', environment.claimSearchHost + requestUrl);
        return this.http.request(request);
    }
    downloadGssReport(providerId: string, payer: string[], fromDate: string, toDate: string) {
        const requestUrl = `/providers/${providerId}/gss/pdf?payer=${payer.join(',')}&fromDate=${fromDate}&toDate=${toDate}`;
        const headers: HttpHeaders = new HttpHeaders('Content-Type: application/pdf');
        // tslint:disable-next-line:max-line-length
        const request = new HttpRequest('GET', environment.claimsDownloadsService + requestUrl, '', { responseType: 'text', reportProgress: true, headers: headers });
        return this.http.request(request);
    }

    getPayerClaimReportResults(providerId: string, payer: string, statuses: string[], fromDate: string, toDate: string, page: Number = 0, pageSize: Number = 10) {
        const requestUrl = `/admin/payer-report?payerId=${payer}&fromDate=${fromDate}&toDate=${toDate}&statuses=${statuses}&providerId=${providerId}&page=${page}&size=${pageSize}`;
        const request = new HttpRequest('GET', environment.claimSearchHost + requestUrl);
        return this.http.request(request);
    }

    //
    generatePayerClaimsReport(providerId: string, payerId: string, fromDate: string, toDate: string, statuses?: string[]) {
        const requestUrl = `/admin/payer-report?providerId=${providerId}&payerId=${payerId}&fromDate=${fromDate}&toDate= ${toDate}&statuses=${statuses}`;

        const request = new HttpRequest('GET', environment.claimsDownloadsService + requestUrl, '', { responseType: 'text', reportProgress: true });
        return this.http.request(request);
    }

    getClaimAlerts(providerId: string) {
        const requestUrl = `/providers/${providerId}/claims/alerts`;
        const request = new HttpRequest('GET', environment.claimSearchHost + requestUrl);
        return this.http.request(request);
    }

}
