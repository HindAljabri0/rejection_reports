import { Upload } from "./upload.model";

export interface ClaimReviewState {
    uploads: {
        new: UploadsPage,
        inProgress: UploadsPage,
        completed: UploadsPage
    }
}


export class UploadsPage {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalUploads: number;
    isLoading: boolean;
    errorMessage: string;
    uploads: Upload[];

    constructor() {
        this.pageNumber = 0;
        this.pageSize = 0;
        this.totalPages = 0;
        this.totalUploads = 0;
        this.isLoading = false;
        this.errorMessage = null;
        this.uploads = [];
    }
}