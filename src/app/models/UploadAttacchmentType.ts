export class UploadAttachmentType {
    attachmentName: string;
    attachmentType: string;

    constructor(attachmentName: string, attachmentType: string) {
        this.attachmentName = attachmentName;
        this.attachmentType = attachmentType;
    }
}
