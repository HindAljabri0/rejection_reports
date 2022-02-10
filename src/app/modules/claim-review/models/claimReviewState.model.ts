import { HttpResponse } from "@angular/common/http";
import { Upload } from "./upload.model";

export interface ClaimReviewState {
    uploads: {
        new: UploadsPage,
        inProgress: UploadsPage,
        completed: UploadsPage
    }
    selectedUploadsTab: 'new' | 'inProgress' | 'completed'
}


export class UploadsPage {
    pageControls: PageControls;
    uploads: Upload[];

    constructor(pageNumber: number, pageSize: number) {
        this.pageControls = new PageControls(pageNumber, pageSize);
        this.uploads = [];
    }

    static fromBackendResponse(response: HttpResponse<any>) {

        return new UploadsPage(0, 10);
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