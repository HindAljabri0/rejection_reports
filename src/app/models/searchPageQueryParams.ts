import { Params } from "@angular/router";
import { ClaimCriteriaModel } from "./ClaimCriteriaModel";


export class SearchPageQueryParams {

    
    claimId?: string;
    claimResponseId?: string;
    editMode?: string;
    reSubmitMode?: string;
    from?: string;
    claimSubmissionDate?: string;
    claimResponseDate?: string;
    to?: string;
    payerId?: string;
    claimTypes?: string;
    organizationId?: string
    caseTypes?: string;
    batchId?: string;
    uploadId?: string;
    claimRefNo?: string;
    memberId?: string;
    invoiceNo?: string;
    patientFileNo?: string;
    policyNo?: string;
    nationalId?: string;
    requestBundleId?: string;
    bundleIds?:string;
    filter_claimRefNo?: string;
    filter_memberId?: string;
    filter_patientFileNo?: string;
    filter_batchNum?: string;
    filter_drName?: string;
    filter_nationalId?: string;
    filter_claimDate?: string;
    filter_claimSubmissionDate?: string;
    filter_claimResponseDate?: string;
    filter_netAmount?: string;
    filter_isRelatedClaim? :boolean;  
    status?: number;
    page?: number;
    size?: number;
    netAmount? : string;
    claimStatus?:string;
    isRelatedClaim? :boolean;
    reissueReason?: boolean;

    static fromParams(params: Params): SearchPageQueryParams {
        let pageParams: SearchPageQueryParams = new SearchPageQueryParams();

        pageParams.status = params.status == null ? 0 : Number.parseInt(params.status, 10);
        pageParams.page = params.page == null ? 0 : Number.parseInt(params.page, 10);
        pageParams.size = params.size == null ? 10 : Number.parseInt(params.size, 10);
        if (Number.isNaN(pageParams.status) || pageParams.status < 0) { pageParams.status = 0; }
        if (Number.isNaN(pageParams.page) || pageParams.page < 0) { pageParams.page = 0; }
        if (Number.isNaN(pageParams.size) || pageParams.size < 0) { pageParams.size = 10; }

        pageParams.from = params.from;
        pageParams.to = params.to;
        pageParams.payerId = params.payerId;
        pageParams.claimTypes = params.claimTypes;
        pageParams.organizationId = params.organizationId;
        pageParams.batchId = params.batchId;
        pageParams.requestBundleId = params.requestBundleId;
        pageParams.bundleIds=params.bundleIds;
        pageParams.uploadId = params.uploadId;
        pageParams.caseTypes = params.caseTypes;
        pageParams.claimId = params.claimId;
        pageParams.claimResponseId = params.claimResponseId;
        pageParams.claimRefNo = params.claimRefNo;
        pageParams.memberId = params.memberId;
        pageParams.invoiceNo = params.invoiceNo;
        pageParams.patientFileNo = params.patientFileNo;
        pageParams.policyNo = params.policyNo;
        pageParams.nationalId = params.nationalId;
        pageParams.editMode = params.editMode || location.href.includes('#edit');

        pageParams.filter_drName = params.filter_drName;
        pageParams.filter_nationalId = params.filter_nationalId;
        pageParams.filter_claimDate = params.filter_claimDate;
        pageParams.filter_claimSubmissionDate = params.filter_claimSubmissionDate;
        pageParams.filter_claimResponseDate = params.filter_claimResponseDate;
        pageParams.filter_batchNum = params.filter_batchNum;
        pageParams.filter_claimRefNo = params.filter_claimRefNo;
        pageParams.filter_memberId = params.filter_memberId;
        pageParams.filter_netAmount = params.filter_netAmount;
        pageParams.filter_patientFileNo = params.filter_patientFileNo;
        pageParams.claimStatus= params.claimStatus;
        pageParams.isRelatedClaim  = params.filter_isRelatedClaim;
        pageParams.reissueReason = params.reissueReason;
        return pageParams;
    }

    toClaimCriteria(statuses: string[]) {
        let criteria: ClaimCriteriaModel = new ClaimCriteriaModel();

        criteria.batchId = this.batchId;
        criteria.requestBundleId = this.requestBundleId;
        criteria.bundleIds=this.bundleIds;
        criteria.caseTypes = this.caseTypes;
        criteria.claimRefNo = this.claimRefNo;
        criteria.fromDate = this.from;
        criteria.toDate = this.to;
        criteria.invoiceNo = this.invoiceNo;
        criteria.payerId = this.payerId;

        criteria.organizationId = this.organizationId;
        criteria.policyNo = this.policyNo;
        criteria.uploadId = this.uploadId;

        criteria.memberId = this.filter_memberId || this.memberId;
        criteria.patientFileNo = this.filter_patientFileNo || this.patientFileNo;
        criteria.batchNo = this.filter_batchNum;
        criteria.claimDate = this.filter_claimDate;
        criteria.claimSubmissionDate = this.filter_claimSubmissionDate;
        criteria.claimResponseDate = this.filter_claimResponseDate;
        criteria.drname = this.filter_drName;
        criteria.nationalId = this.filter_nationalId || this.nationalId;
        criteria.netAmount = this.filter_netAmount;
        //criteria.isRelated=this.filter_isRelated;

        criteria.statuses = statuses;
        criteria.page = `${this.page}`;
        criteria.size = `${this.size}`;
        return criteria;
    }

    hasNoQueryParams() {
        return Object.keys(this).every(key =>
            this[key] == null
            || (this[key] instanceof String && this[key].trim().length == 0)
            || (this[key] instanceof Number && this[key] < 0)
            || (this[key] instanceof Array && this[key].length == 0));
    }
}