import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Router } from '@angular/router';
import { UploadCardData } from 'src/app/models/UploadCardData';
import { SearchService } from 'src/app/services/serchService/search.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-uploads-page',
  templateUrl: './uploads-page.component.html',
  styles: []
})
export class UploadsPageComponent implements OnInit {

  errorMessage: string;
  uploads: any[] = [];
  MAX = Number.MAX_VALUE;
  length = Number.MAX_VALUE;
  pageSize = 10;
  pageIndex = 0;

  constructor(private searchService: SearchService, private sharedService: SharedServices, private router: Router) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    if (this.isLoading) {
      return;
    }
    if (this.uploads.length >= this.length) {
      return;
    }
    this.sharedService.loadingChanged.next(true);
    this.searchService.getUploadSummaries(this.sharedService.providerId, this.pageIndex, this.pageSize)
      .subscribe(event => {
        if (event instanceof HttpResponse) {
          this.sharedService.loadingChanged.next(false);
          this.uploads = this.uploads.concat(event.body['content']);
          this.uploads.map((ele) => {
            ele.isManualUpload = ele.uploadName.toLowerCase().includes('manual')
            return ele;
          })
          this.length = event.body['totalElements'];
          this.pageIndex++;
        }
      }, errorEvent => {
        this.sharedService.loadingChanged.next(false);
        if (errorEvent instanceof HttpErrorResponse) {
          this.errorMessage = errorEvent.message;
        }
      });
  }

  openUpload(uploadId: number) {
    this.router.navigate([this.sharedService.providerId, 'claims'], {
      queryParams: { uploadId }
    });
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
    this.fetchData();
  }

  get isLoading() {
    return this.sharedService.loading;
  }

}
