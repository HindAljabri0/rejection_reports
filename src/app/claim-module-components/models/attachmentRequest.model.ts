
export class AttachmentRequest {

    fileName: string;
	fileType: FileType;
	attachmentFile: ArrayBuffer;
    userComment: string;
}

export type FileType = 'Medical Report' | 'X-Ray result' | 'Lab Result' | 'Iqama/ID copy';