import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ConfirmationAlertDialogComponent } from 'src/app/components/confirmation-alert-dialog/confirmation-alert-dialog.component';
import { DownloadStatus } from 'src/app/models/downloadRequest';
import { DownloadService } from 'src/app/services/downloadService/download.service';
import { showSnackBarMessage } from 'src/app/store/mainStore.actions';
import { SwitchUser } from '../../models/SwitchUser.model';
import { Upload } from '../../models/upload.model';
import { ClaimReviewService } from '../../services/claim-review-service/claim-review.service';
import { deleteUpload, updateAssignment } from '../../store/claimReview.actions';
import { getCoderList, getDoctorList } from '../../store/claimReview.reducer';

@Component({
  selector: 'app-upload-assigning-card',
  templateUrl: './upload-assigning-card.component.html'
})
export class UploadAssigningCardComponent implements OnInit {

  @Input()
  data: Upload = new Upload();
  @Input()
  tabName: "new" | "in-progress" | "completed";

  doctorList$: Observable<SwitchUser[]>;
  coderList$: Observable<SwitchUser[]>;
  selectedDoctor: string;
  selectedCoder: string;
  // detailTopActionIcon = 'ic-download.svg';
  downloadedFiles: number[] = []
  downloadFileSubscription: Subscription = new Subscription;

  constructor(private store: Store, private dialog: MatDialog, private downloadService: DownloadService, private claimReviewService: ClaimReviewService) { }

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
      }
    }, error => {
      console.log("Error on Delete", error);
    });
  }

  downloadData(upload: Upload) {
    this.downloadFileSubscription = this.downloadService.startGeneratingDownloadFile(this.claimReviewService.downloadExcel(upload.id))
      .subscribe(status => {
        if (status != DownloadStatus.ERROR) {
          this.downloadedFiles.push(upload.id)
        }
      });
  }

  onDoctorSelectionChanged(data: string) {
    this.selectedDoctor = data
  }

  onCoderSelectionChanged(data: string) {
    this.selectedCoder = data;
  }

  updateAssignment(doctor: boolean, coder: boolean) {
    if (doctor && (this.selectedDoctor == '' || this.selectedDoctor == null)) {
      this.store.dispatch(showSnackBarMessage({ message: "Please Select a Doctor." }));
      return;
    }
    else if (coder && (this.selectedCoder == '' || this.selectedCoder == null)) {
      this.store.dispatch(showSnackBarMessage({ message: "Please Select a Coder." }));
      return;
    }
    var selectedId = '';
    if (doctor)
      selectedId = this.selectedDoctor;
    else
      selectedId = this.selectedCoder
    this.store.dispatch(updateAssignment({ data: { uploadId: this.data.id, userNme: selectedId, doctor: doctor, coder: coder } }));
  }

  ngOnDestroy() {
    this.downloadFileSubscription.unsubscribe()
  }
}
