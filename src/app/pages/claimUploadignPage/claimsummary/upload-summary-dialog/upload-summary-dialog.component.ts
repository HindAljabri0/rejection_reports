import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SharedServices } from 'src/app/services/shared.services';
import { UploadService } from 'src/app/services/claimfileuploadservice/upload.service';
import { HttpResponse } from '@angular/common/http';
import { NgScrollbar } from 'ngx-scrollbar';

@Component({
  selector: 'app-upload-summary-dialog',
  templateUrl: './upload-summary-dialog.component.html',
  styles: []
})
export class UploadSummaryDialogComponent implements OnInit {
  @ViewChild('customScrollbar', { static: false }) customScrollbar: NgScrollbar;

  dialogData: any;
  currentPage = 0;
  constructor(
    private dialogRef: MatDialogRef<UploadSummaryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any, private uploadService: UploadService, private commen: SharedServices) {
    this.dialogData = this.data;
  }

  ngOnInit() {
    setTimeout(() => {
      this.customScrollbar.update();
    }, 1000);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  getClaimSummaryByFieldName(page = null) {
    this.currentPage = page;
    this.commen.loadingChanged.next(true);
    this.uploadService.getClaimsErrorByFieldName(this.commen.providerId,
      this.uploadService.summary.uploadSummaryID,
      this.dialogData.fieldName,
      page).subscribe(event => {
        if (event instanceof HttpResponse) {
          this.commen.loadingChanged.next(false);
          this.dialogData.results = event.body;
        }
      }), (eventError) => {
        this.commen.loadingChanged.next(false);
      };
  }

}
