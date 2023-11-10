
export class ClaimCriteriaModel {

    fromDate?: string;

    toDate?: string;

    payerId?: string;

    organizationId?: string;

    batchId?: string;

    uploadId?: string;

    statuses?: string[];

    caseTypes?: string;

    claimIds?: string[];

    claimRefNo?: string;

    patientFileNo?: string;

    invoiceNo?: string;

    policyNo?: string;

    memberId?: string;

    drname?: string;

    nationalId?: string;

    claimDate?: string;
    claimSubmissionDate?: string;
    claimResponseDate?: string;
    netAmount?: string;

    batchNo?: string;

    page?: string;

    size?: string;

    requestBundleId?:string

    constructor() {

    }


    toQueryParams() {
        let params = '';
        if(this.fromDate != null && this.fromDate.trim().length > 0){
            params += `fromDate=${this.fromDate}&`
        }
        if(this.toDate != null && this.toDate.trim().length > 0){
            params += `toDate=${this.toDate}&`
        }
        if(this.payerId != null && this.payerId.trim().length > 0){
            params += `payerId=${this.payerId}&`
        }
        if(this.organizationId != null && this.organizationId.trim().length > 0){
            params += `organizationId=${this.organizationId}&`
        }
        if(this.batchId != null && this.batchId.trim().length > 0){
            params += `batchId=${this.batchId}&`
        }
        if(this.uploadId != null && this.uploadId.trim().length > 0){
            params += `uploadId=${this.uploadId}&`
        }
        if(this.statuses != null && this.statuses.length > 0){
            params += `statuses=${this.statuses.join(',')}&`
        }
        if(this.caseTypes != null && this.caseTypes.length > 0){
            params += `casetype=${this.caseTypes}&`
        }
        if(this.claimIds != null && this.claimIds.length > 0){
            params += `claimIds=${this.claimIds.join(',')}&`
        }
        if(this.claimRefNo != null && this.claimRefNo.trim().length > 0){
            params += `claimRefNo=${this.claimRefNo}&`
        }
        if(this.patientFileNo != null && this.patientFileNo.trim().length > 0){
            params += `patientFileNo=${this.patientFileNo}&`
        }
        if(this.invoiceNo != null && this.invoiceNo.trim().length > 0){
            params += `invoiceNo=${this.invoiceNo}&`
        }
        if(this.policyNo != null && this.policyNo.trim().length > 0){
            params += `policyNo=${this.policyNo}&`
        }
        if(this.memberId != null && this.memberId.trim().length > 0){
            params += `memberId=${this.memberId}&`
        }
        if(this.drname != null && this.drname.trim().length > 0){
            params += `drname=${this.drname}&`
        }
        if(this.nationalId != null && this.nationalId.trim().length > 0){
            params += `nationalId=${this.nationalId}&`
        }
        if(this.claimDate != null && this.claimDate.trim().length > 0){
            params += `claimDate=${this.claimDate}&`
        }
        if(this.claimSubmissionDate != null && this.claimSubmissionDate.trim().length > 0){
            params += `claimSubmissionDate=${this.claimSubmissionDate}&`
        }
        if(this.claimResponseDate != null && this.claimResponseDate.trim().length > 0){
            params += `claimResponseDate=${this.claimResponseDate}&`
        }
        if(this.netAmount != null && this.netAmount.trim().length > 0){
            params += `netAmount=${this.netAmount}&`
        }
        if(this.batchNo != null && this.batchNo.trim().length > 0){
            params += `batchNo=${this.batchNo}&`
        }
        if(this.requestBundleId != null && this.requestBundleId.trim().length > 0){
            params += `requestBundleId=${this.requestBundleId}&`
        }
        if(this.page != null && this.page.trim().length > 0){
            params += `page=${this.page}&`
        }
        if(this.size != null && this.size.trim().length > 0){
            params += `size=${this.size}&`
        }
        if(params.endsWith('&')){
            params = params.substr(0, params.length-1);
        }

        console.log(this.requestBundleId)
        return params;
    }

}