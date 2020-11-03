import { createAction, props } from '@ngrx/store';



export const showUploadAttachmentsDialog = createAction('[ Uploading ] show dialog asking the user if he wants to upload attachments.');
export const toggleAttachmentUpload = createAction('[ Uploading ] to control showing attachment uploading component or not', props<{ isUploadingAttachments: boolean }>());