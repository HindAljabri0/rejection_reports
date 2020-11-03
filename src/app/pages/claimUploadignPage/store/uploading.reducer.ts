import { createFeatureSelector, createReducer, on } from '@ngrx/store'
import { toggleAttachmentUpload } from './uploading.actions';


export interface UploadingState {
    isUploadingAttachments: boolean

}

const initState: UploadingState = {
    isUploadingAttachments: false,
}


const _uploadingReducer = createReducer(
    initState,
    on(toggleAttachmentUpload, (state, { isUploadingAttachments }) => ({ ...state, isUploadingAttachments: isUploadingAttachments }))
);

export function uploadingReducer(state, action) {
    return _uploadingReducer(state, action);
}

export const uploadingStateSelector = createFeatureSelector<UploadingState>('uploadingState');