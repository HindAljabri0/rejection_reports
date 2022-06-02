import { Claim } from "src/app/claim-module-components/models/claim.model";
import { FieldError } from "../store/claimReview.reducer";
import { ClaimSummary } from "./claimSummary.mocel";
import { Upload } from "./upload.model";

export interface ClaimReviewState {
    uploads: {
        new: UploadsPage,
        inProgress: UploadsPage,
        completed: UploadsPage
    }
    selectedUploadsTab: 'new' | 'inProgress' | 'completed'
    singleClaim: Claim, 
    claimErrors: {errors: FieldError[] },
    uploadClaimsSummary: ClaimSummary[],
    uploadClaimsSummaryPageControls: PageControls,
    nextAvailableClaimProvNo: number
}


export class UploadsPage {
    pageControls: PageControls;
    uploads: Upload[];

    constructor(pageNumber: number, pageSize: number) {
        this.pageControls = new PageControls(pageNumber, pageSize);
        this.uploads = [];
    }

    static fromBackendResponse(response: any) {
        const body = response;
        const pageNumber = body.number;
        const pageSize = body.size;
        let uploadsPage = new UploadsPage(pageNumber, pageSize);
        uploadsPage.pageControls.totalPages = body.totalPages;
        uploadsPage.pageControls.totalUploads = body.totalElements;
        const content = body.content;
        if (content instanceof Array) {
            uploadsPage.uploads = content.map(incomingUpload => Upload.fromBackendResponse(incomingUpload));
        }
        return uploadsPage;
    }

    static pageControlfromBackendResponse(response: any) {
        const body = response;
        const pageNumber = body.number;
        const pageSize = body.size;
        let pageControls = new PageControls(pageNumber, pageSize);
        pageControls.totalPages = body.totalPages;
        pageControls.totalUploads = body.totalElements;
        return pageControls;
    }
}

export class PageControls {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalUploads: number;
    isLoading: boolean;
    errorMessage: string;

    constructor(pageNumber: number, pageSize: number) {
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
        this.totalPages = 0;
        this.totalUploads = 0;
        this.isLoading = false;
        this.errorMessage = null;
    }
}