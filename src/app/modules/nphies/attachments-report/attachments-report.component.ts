import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AttachmentLinkService } from 'src/app/services/attachment-link/attachment-link.service';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-attachments-report',
  templateUrl: './attachments-report.component.html',
  styles: []
})
export class AttachmentsReportComponent implements OnInit {
  summary: any = [];
  successList: any = [];
  failureList: any = [];
  showJobSummary = false;
  maxPages = Number.MAX_VALUE;
  currentPage = 0;

  jobId = 0;
  folderName = '';
  jobDate = '';
  totalCount = 0;
  successCount = 0;
  failCount = 0;

  constructor(public sharedService: SharedServices,
    private attachmentLinkService: AttachmentLinkService,
    private dialogService: DialogService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.fetchData();
  }
  fetchData() {
    if (this.currentPage >= this.maxPages || this.loading) {
      return;
    }
    this.attachmentLinkService.uploadAttachSummary(this.sharedService.providerId, this.currentPage, 9).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        this.maxPages = event.body['totalPages'];
        this.currentPage++;
        this.summary = event.body['content'];
        this.sharedService.loadingChanged.next(false);
      }
    }, err => {
      this.sharedService.loadingChanged.next(false);
      console.log(err);
    });
  }
  get loading() {
    return this.sharedService.loading;
  }
  scrollHandler(e) {
    if (e === 'bottom') {
      this.fetchData();
    }
  }
  ShowDetails(obj: any) {
    this.showJobSummary = true;
    if (obj != null) {
      this.jobId = obj.attachmentLinkId;
      this.folderName = obj.folderName;
      this.jobDate = obj.linkedDate;
      this.totalCount = obj.totalAttachments;
      this.successCount = obj.totalSuccess;
      this.failCount = obj.totalFailed;
    }
    this.attachmentLinkService.uploadAttachFilesDetails(this.sharedService.providerId,obj.attachmentLinkId,'success', 0 /*this.currentPage*/, 9).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        this.successList=event.body['content'];
        this.sharedService.loadingChanged.next(false);
      }
    }, err => {
      this.sharedService.loadingChanged.next(false);
      console.log(err);
    });
    this.attachmentLinkService.uploadAttachFilesDetails(this.sharedService.providerId,obj.attachmentLinkId,'failed', 0 /*this.currentPage*/, 9).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        this.failureList=event.body['content'];
        this.sharedService.loadingChanged.next(false);
      }
    }, err => {
      this.sharedService.loadingChanged.next(false);
      console.log(err);
    });
  }
}
