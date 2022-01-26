import { NphiesClaimUploaderService } from 'src/app/services/nphiesClaimUploaderService/nphies-claim-uploader.service';
import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { formatDate } from '@angular/common';
import { UploadSummary } from 'src/app/models/uploadSummary';
import { UploadService } from 'src/app/services/claimfileuploadservice/upload.service';
import { SharedServices } from 'src/app/services/shared.services';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Query } from 'src/app/models/searchData/query';
import { QueryType } from 'src/app/models/searchData/queryType';

@Component({
  selector: 'app-uploads-history',
  templateUrl: './uploads-history.component.html',
  styleUrls: ['./uploads-history.component.css']
})
export class UploadsHistoryComponent implements OnInit {

  queries: Query[] = [];

  uploadsMap: Map<string, UploadSummary[]> = new Map();
  tempUploadsMap: Map<string, UploadSummary[]> = new Map();
  uploadsMapKeys: string[] = new Array();
  tempUploadsMapKeys: string[] = new Array();

  currentPage = 0;
  tempCurrentPage = 0;
  maxPages = Number.MAX_VALUE;
  tempMaxPages = Number.MAX_VALUE;

  inCenter = false;

  constructor(private uploadService: NphiesClaimUploaderService, private commen: SharedServices, @Inject(LOCALE_ID) private locale: string) { }

  ngOnInit() {
    this.fetchDate();
  }

  fetchDate() {
    if (this.currentPage >= this.maxPages || this.loading) {
      return;
    }
    this.commen.loadingChanged.next(true);
    this.uploadService.getUploadHistory(this.commen.providerId, this.currentPage, 9)
      .subscribe(event => {
        if (event instanceof HttpResponse) {
          this.maxPages = event.body['totalPages'];
          this.currentPage++;
          event.body['content'].forEach((upload: UploadSummary) => {
            upload.uploadDate = new Date(upload.uploadDate);
            const key = formatDate(upload.uploadDate, 'MMM, yyyy', this.locale);
            if (this.uploadsMap.has(key)) {
              this.uploadsMap.get(key).push(upload);
            } else {
              this.uploadsMap.set(key, [upload]);
              this.uploadsMapKeys.push(key);
            }

          });

          this.commen.loadingChanged.next(false);
        }


      }, error => {
        if (error instanceof HttpErrorResponse) {
          this.commen.loadingChanged.next(false);
          console.log(error);
        }
      });
  }

  search(queries?: Query[]) {


  }

  onQueryRemoved(query: Query) {
    if (this.tempMaxPages != Number.MAX_VALUE) {
      this.uploadsMap = this.tempUploadsMap;
      this.uploadsMapKeys = this.tempUploadsMapKeys;
      this.currentPage = this.tempCurrentPage;
      this.maxPages = this.tempMaxPages;
      this.tempUploadsMap = new Map();
      this.tempUploadsMapKeys = [];
      this.tempCurrentPage = 0;
      this.tempMaxPages = Number.MAX_VALUE;
      this.queries = [];
    }
  }

  scrollHandler(e) {
    if (e === 'bottom') {
      if (this.tempMaxPages == Number.MAX_VALUE) {
        this.fetchDate();
      } else {
        this.search();
      }
    }
  }

  get loading() {
    return this.commen.loading;
  }

  toServerDate(date: string) {
    const splittedDate = date.split('-');
    return `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`;
  }

}


