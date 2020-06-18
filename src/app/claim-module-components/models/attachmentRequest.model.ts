
export class AttachmentRequest {

    fileName: string;
	fileType: 'Medical Report' | 'X-Ray result' | 'Lab Result' | 'Iqama/ID copy';
	attachmentFile: ArrayBuffer;
    userComment: string;
}