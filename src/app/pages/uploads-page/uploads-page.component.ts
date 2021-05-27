import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Router } from '@angular/router';
import { SearchService } from 'src/app/services/serchService/search.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-uploads-page',
  templateUrl: './uploads-page.component.html',
  styles: []
})
export class UploadsPageComponent implements OnInit {

  errorMessage: string;
  uploads: {
    totalClaims: number;
    uploadDate: Date;
    uploadId: number;
    uploadName: string;
  }[] = [];

  length = 0;
  pageSize = 20;
  pageIndex = 0;
  pageSizeOptions = [10, 20, 50, 100];

  constructor(private searchService: SearchService, private sharedService: SharedServices, private router: Router) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    if (this.isLoadaing) {
      return;
    }
    this.sharedService.loadingChanged.next(true);
    this.searchService.getUploadSummaries(this.sharedService.providerId, this.pageIndex, this.pageSize)
      .subscribe(event => {
        if (event instanceof HttpResponse) {
          this.sharedService.loadingChanged.next(false);
          this.uploads = event.body['content'];
          this.length = event.body['totalElements'];
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
      queryParams: { uploadId: uploadId }
    });
  }

  handlePageEvent(event: PageEvent) {
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchData();
  }

  get isLoadaing() {
    return this.sharedService.loading;
  }

}
