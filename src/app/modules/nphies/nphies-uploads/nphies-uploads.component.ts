import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/serchService/search.service';
import { SharedServices } from 'src/app/services/shared.services';
import { Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { PageEvent } from '@angular/material';
import { NphiesClaimUploaderService } from 'src/app/services/nphiesClaimUploaderService/nphies-claim-uploader.service';

@Component({
  selector: 'app-nphies-uploads',
  templateUrl: './nphies-uploads.component.html',
  styleUrls: ['./nphies-uploads.component.css']
})
export class NphiesUploadsComponent implements OnInit {

  errorMessage: string;
  uploads: any[] = [];
  MAX = Number.MAX_VALUE;
  length = Number.MAX_VALUE;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private nphiesClaimUploaderService: NphiesClaimUploaderService, private sharedService: SharedServices, private router: Router) { }

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
    this.nphiesClaimUploaderService.getUploadSummaries(this.sharedService.providerId, this.pageIndex, this.pageSize)
      .subscribe(event => {
        if (event instanceof HttpResponse) {
          this.sharedService.loadingChanged.next(false);
          this.uploads = this.uploads.concat(event.body['content']);
          this.uploads.map((ele) => {
            if (ele.uploadName.toLowerCase().includes('manual')) {
              const manualEntery = ele.uploadName.split('_');
              const manualText = manualEntery[manualEntery.length - 1];
              if (manualText.toLowerCase().includes('manual')) {
                ele.isManualUpload = true;
              }
            }
            return ele;
          });
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
   // this.router.navigate(['nphies', 'claims'])
  
    this.router.navigateByUrl('/claims/nphies-search-claim');

    // this.router.navigate([this.sharedService.providerId, 'nphies'], {
    //   queryParams: { uploadId }
    // });
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
