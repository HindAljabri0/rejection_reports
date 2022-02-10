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

    constructor() {
        this.pageControls = new PageControls();
        this.uploads = [];
    }
}

export class PageControls {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalUploads: number;
    isLoading: boolean;
    errorMessage: string;

    constructor() {
        this.pageNumber = 0;
        this.pageSize = 0;
        this.totalPages = 0;
        this.totalUploads = 0;
        this.isLoading = false;
        this.errorMessage = null;
    }
}