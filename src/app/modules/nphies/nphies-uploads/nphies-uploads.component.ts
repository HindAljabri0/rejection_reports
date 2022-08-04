import { Component, OnInit } from '@angular/core';
import { SharedServices } from 'src/app/services/shared.services';
import { Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { PageEvent } from '@angular/material';
import { NphiesClaimUploaderService } from 'src/app/services/nphiesClaimUploaderService/nphies-claim-uploader.service';
import { Query } from 'src/app/models/searchData/query';
import { QueryType } from 'src/app/models/searchData/queryType';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-nphies-uploads',
  templateUrl: './nphies-uploads.component.html',
  styles: []
})
export class NphiesUploadsComponent implements OnInit {

  queries: Query[] = [];
  inCenter = false;

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
    this.router.navigate([this.sharedService.providerId, 'claims', 'nphies-search-claim'], {
      queryParams: { uploadId }
    });
  }

  scrollHandler(e) {
    if (e === 'bottom') {
      if (this.queries.length > 0) {
        this.search();
      } else {
        this.fetchData();
      }
    }
  }

  handlePageEvent(event: PageEvent) {
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchData();
  }

  searchEvent(queries?: Query[]) {
    this.uploads = [];
    this.search(queries);
  }

  search(queries?: Query[]) {
    if (queries != null) {
      this.pageIndex = 0;
      this.length = Number.MAX_VALUE;
      this.queries = queries;
    }
    if ((this.pageIndex >= this.length && queries == null) || this.loading) {
      return;
    }
    this.sharedService.loadingChanged.next(true);
    const textQuery = this.queries.find(query => query.type === QueryType.TEXT);
    const fromQuery = this.queries.find(query => query.type === QueryType.DATEFROM);
    const toQuery = this.queries.find(query => query.type === QueryType.DATETO);

    this.nphiesClaimUploaderService.searchUploadSummaries(this.sharedService.providerId, textQuery != null ? textQuery.content : null,
      fromQuery != null ? this.toServerDate(fromQuery.content) : null,
      toQuery != null ? this.toServerDate(toQuery.content) : null,
      this.pageIndex, this.pageSize)
      .subscribe(event => {
        if (event instanceof HttpResponse) {
          if (queries != null) {
            this.uploads = event.body['content'];
          } else {
            this.uploads = this.uploads.concat(event.body['content']);
          }

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
          this.sharedService.loadingChanged.next(false);
        }
      }, errorEvent => {
        this.sharedService.loadingChanged.next(false);
        if (errorEvent instanceof HttpErrorResponse) {
          this.errorMessage = errorEvent.message;
        }
      });
  }

  onQueryRemoved(query: Query) {
    this.uploads = [];
    this.pageIndex = 0;
    this.length = Number.MAX_VALUE;
    this.queries = [];
    this.fetchData();
  }

  toServerDate(date: string) {
    const splittedDate = date.split('-');
    return `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`;
  }

  get loading() {
    return this.sharedService.loading;
  }

  get isLoading() {
    return this.sharedService.loading;
  }

}
