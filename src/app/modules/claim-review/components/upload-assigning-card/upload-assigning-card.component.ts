import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ConfirmationAlertDialogComponent } from 'src/app/components/confirmation-alert-dialog/confirmation-alert-dialog.component';
import { showSnackBarMessage } from 'src/app/store/mainStore.actions';
import { SwitchUser } from '../../models/SwitchUser.model';
import { Upload } from '../../models/upload.model';
import { deleteUpload, loadCoderList, loadDoctorList, loadUploadsUnderReviewOfSelectedTab, updateAssignment } from '../../store/claimReview.actions';
import { getCoderList, getDoctorList } from '../../store/claimReview.reducer';

@Component({
  selector: 'app-upload-assigning-card',
  templateUrl: './upload-assigning-card.component.html'
})
export class UploadAssigningCardComponent implements OnInit {

  @Input()
  data: Upload = new Upload();
  doctorList$: Observable<SwitchUser[]>;
  coderList$: Observable<SwitchUser[]>;
  selectedDoctor: string;
  selectedCoder: string;

  constructor(private store: Store, private dialog: MatDialog) { }

  ngOnInit() {
    this.doctorList$ = this.store.select(getDoctorList);
    this.coderList$ = this.store.select(getCoderList);
  }

  deleteRecord(upload: Upload) {
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
        this.store.dispatch(deleteUpload({ upload: upload }));
        this.store.dispatch(loadUploadsUnderReviewOfSelectedTab());
        return this.store.dispatch(showSnackBarMessage({ message: 'Upload Deleted Successfully!' }));
      }
    }, error => {
      console.log("Error on Delete", error);
    });
  }

  onDoctorSelectionChanged(data: string) {
    this.selectedDoctor = data
  }

  onCoderSelectionChanged(data: string) {
    this.selectedCoder = data;
  }

  updateAssignment(doctor: boolean, coder: boolean) {
    var selectedId = '';
    if (doctor)
      selectedId = this.selectedDoctor;
    else
      selectedId = this.selectedCoder
    this.store.dispatch(updateAssignment({ data: { uploadId: this.data.id, userNme: selectedId, doctor: doctor, coder: coder } }));
    this.store.dispatch(loadUploadsUnderReviewOfSelectedTab());
    this.store.dispatch(showSnackBarMessage({ message : "User Assigned Successfully!"}));
  }
}
