import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgScrollbar } from 'ngx-scrollbar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SharedServices } from 'src/app/services/shared.services';
import { HttpResponse } from '@angular/common/http';
import { NphiesClaimUploaderService } from 'src/app/services/nphiesClaimUploaderService/nphies-claim-uploader.service';

@Component({
  selector: 'app-nphies-upload-summary-dialog',
  templateUrl: './nphies-upload-summary-dialog.component.html',
  styleUrls: ['./nphies-upload-summary-dialog.component.css']
})
export class NphiesUploadSummaryDialogComponent implements OnInit {

  @ViewChild('customScrollbar', { static: false }) customScrollbar: NgScrollbar;

  dialogData: any;
  currentPage = 0;
  constructor(
    private dialogRef: MatDialogRef<NphiesUploadSummaryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any, private uploadService: NphiesClaimUploaderService, private commen: SharedServices) {
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
      this.uploadService.summary.uploadId, this.dialogData.fieldName, page).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.commen.loadingChanged.next(false);
        this.dialogData.results = event.body;
      }
    }, eventError => {
      this.commen.loadingChanged.next(false);
      console.log(eventError);
    });
  }

}
