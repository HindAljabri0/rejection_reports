import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, PageEvent } from '@angular/material';
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
  totalUnUsed=0;
  //success page options
  length = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 50, 100, 500, 1000];
  showFirstLastButtons = true;
  //fail page options
  f_length = 0;
  f_pageSize = 10;
  f_pageIndex = 0;

  constructor(public sharedService: SharedServices,
    private attachmentLinkService: AttachmentLinkService,
    private dialogService: DialogService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.pageSize = localStorage.getItem('pagesize') != null ? Number.parseInt(localStorage.getItem('pagesize'), 10) : 10;
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
  handlePageEvent(event: PageEvent) {
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    localStorage.setItem('pagesize', event.pageSize + '');
    this.callSuccess(this.jobId, this.pageIndex);
  }
  f_handlePageEvent(event: PageEvent) {
    this.f_length = event.length;
    this.f_pageSize = event.pageSize;
    this.f_pageIndex = event.pageIndex;
    localStorage.setItem('pagesize', event.pageSize + '');
    this.callFailed(this.jobId, this.f_pageIndex);
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
      this.totalUnUsed=obj.totalUnUsed;
    }
    this.callSuccess(this.jobId, this.pageIndex);
    this. callFailed(this.jobId, this.pageIndex);
  }
  callSuccess(attachmentLinkId: number, pageIndex: number) {
    this.attachmentLinkService.uploadAttachFilesDetails(this.sharedService.providerId, attachmentLinkId, 'success', pageIndex,this.pageSize).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        this.successList = event.body['content'];
        this.length = event.body['totalElements'];
        this.pageSize = event.body['size'];
        this.pageIndex = event.body['number'];
        console.log('this.length:' + this.length + 'this.pageSize:' + this.pageSize + 'this.pageIndex:' + this.pageIndex);
        this.sharedService.loadingChanged.next(false);
      }
    }, err => {
      this.sharedService.loadingChanged.next(false);
      console.log(err);
    });
  }
  callFailed(attachmentLinkId: number, pageIndex: number) {
    this.attachmentLinkService.uploadAttachFilesDetails(this.sharedService.providerId, attachmentLinkId, 'failed', pageIndex , this.f_pageSize).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        this.failureList = event.body['content'];
        this.f_length = event.body['totalElements'];
        this.f_pageSize = event.body['size'];
        this.f_pageIndex = event.body['number'];
        console.log('this.length:' + this.f_length + 'this.pageSize:' + this.f_pageSize + 'this.pageIndex:' + this.f_pageIndex);
        this.sharedService.loadingChanged.next(false);
      }
    }, err => {
      this.sharedService.loadingChanged.next(false);
      console.log(err);
    });
  }
}
