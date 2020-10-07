
export class AttachmentRequest {

    fileName: string;
	fileType: FileType;
	attachmentFile: string;
    userComment: string;
}

export type FileType = 'Medical Report' | 'X-Ray result' | 'Lab Result' | 'Iqama/ID copy';