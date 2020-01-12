import { Component, OnInit } from '@angular/core';
import { UploadSummary } from 'src/app/models/uploadSummary';
import { UploadService } from 'src/app/services/claimfileuploadservice/upload.service';
import { CommenServicesService } from 'src/app/services/commen-services.service';
import { HttpRequest, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-uploads-history',
  templateUrl: './uploads-history.component.html',
  styleUrls: ['./uploads-history.component.css']
})
export class UploadsHistoryComponent implements OnInit {

  uploadsMap:Map<string, UploadSummary[]> = new Map();
  uploadsMapKeys:string[] = new Array();

  currentPage = 0;
  maxPages = Number.MAX_VALUE;

  inCenter=false;

  constructor(private uploadService:UploadService, private commen:CommenServicesService) { }

  ngOnInit() {
    this.fetchDate();
  }

  fetchDate(){
    if(this.currentPage >= this.maxPages) return;
    this.commen.loadingChanged.next(true);
    this.uploadService.getUploadSummaries(this.commen.providerId, this.currentPage, 10)
    .subscribe(event => {
      if(event instanceof HttpResponse){
        this.maxPages = event.body['totalPages'];
        this.currentPage++;
        event.body['content'].forEach((upload:UploadSummary) => {
          upload.uploadDate = new Date(upload.uploadDate);
          const year = upload.uploadDate.getFullYear();
          const month = upload.uploadDate.getMonth();
          const key = `${year}/${month}`;
          if(this.uploadsMap.has(key)){
            this.uploadsMap.get(key).push(upload);
          } else {
            this.uploadsMap.set(key, [upload]);
            this.uploadsMapKeys.push(key);
          }
        });
        this.commen.loadingChanged.next(false);
      }
    }, error => {
      if(error instanceof HttpErrorResponse){
        this.commen.loadingChanged.next(false);
        console.log(error);
      }
    })
  }

  scrollHandler(e) {
    console.log(e);
    if (e === 'bottom') {
      this.fetchDate();
    }
  }

}
