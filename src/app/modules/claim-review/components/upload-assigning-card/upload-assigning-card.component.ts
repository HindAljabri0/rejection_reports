import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { ConfirmationAlertDialogComponent } from 'src/app/components/confirmation-alert-dialog/confirmation-alert-dialog.component';
import { showSnackBarMessage } from 'src/app/store/mainStore.actions';
import { Upload } from '../../models/upload.model';
import { deleteUpload, loadUploadsUnderReviewOfSelectedTab } from '../../store/claimReview.actions';

@Component({
    selector: 'app-upload-assigning-card',
    templateUrl: './upload-assigning-card.component.html'
})
export class UploadAssigningCardComponent implements OnInit {

    @Input()
    data: Upload = new Upload();

    constructor(private store: Store, private dialog: MatDialog) { }

    ngOnInit() {
    }

    deleteRecord ( upload : Upload ) {
        const dialogRef = this.dialog.open(ConfirmationAlertDialogComponent, {
            panelClass: ['primary-dialog'],
            disableClose: true,
            autoFocus: false,
            data: {
              mainMessage: 'Are you sure want to Delete this Upload?',
              mode: 'warning'
            }
          }).afterClosed().subscribe(result => {
            if (result) {
                this.store.dispatch(deleteUpload({ upload : upload }));
                this.store.dispatch(loadUploadsUnderReviewOfSelectedTab());
                return this.store.dispatch(showSnackBarMessage({ message: 'Upload Deleted Successfully!' }));
            }
          }, error => { });
    }

}
