import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { showUploadAttachmentsDialog, toggleAttachmentUpload } from './uploading.actions';



@Injectable({ providedIn: 'root' })
export class UploadingEffects {

    constructor(
        private actions$: Actions,
        private store: Store,
        private dialogService: DialogService
    ) { }


    openUploadAttachmentsDialog$ = createEffect(() => this.actions$.pipe(
        ofType(showUploadAttachmentsDialog),
        tap(() => this.dialogService.openMessageDialog({
            title: 'Additional Files',
            message: 'Do you wish to attach additional files to your claims? (X-Ray results, ID/Iqama, Medical Report, Lab Results)',
            isError: false,
            withButtons: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }, 'unset', 'unset').subscribe(dialogResult => this.store.dispatch(toggleAttachmentUpload({ isUploadingAttachments: dialogResult || false }))))
    ), { dispatch: false });

}