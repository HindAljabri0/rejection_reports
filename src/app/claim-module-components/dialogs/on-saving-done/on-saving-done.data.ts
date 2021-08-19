export class OnSavingDoneDialogData {
    uploadId: number;
    claimId: string;
    status: string;
    oldStatus: string;
    errors: any[];


    public static fromResponse(response, uploadId: number, oldStatus:string): OnSavingDoneDialogData {
        const data = new OnSavingDoneDialogData();
        data.uploadId = uploadId;
        data.claimId = response.body['claimID'];
        data.errors = response.body['errors'];
        data.status = response.body['status'];
        data.oldStatus = oldStatus;
        return data;
    }
}
