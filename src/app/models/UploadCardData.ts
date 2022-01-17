
export class UploadCardData {
    uploadId: number;
    uploadName: string;
    uploadDate: Date;

    ready_for_submission: number;
    rejected_by_waseel: number;
    undersubmission: number;
    underprocessing: number;
    paid: number;
    partially_paid: number;
    rejected_by_payer: number;
    invalid: number;
    downloadable: number;
    submitted_outside_waseel: number;
    duplicate:number;
    isManualUpload?: boolean = false;

}
