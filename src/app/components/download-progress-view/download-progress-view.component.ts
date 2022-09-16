import { Component, Input, OnInit, AfterContentInit } from '@angular/core';
import { DownloadRequest } from 'src/app/models/downloadRequest';

@Component({
  selector: 'app-download-progress-view',
  templateUrl: './download-progress-view.component.html'
})
export class DownloadProgressViewComponent implements OnInit, AfterContentInit {

  @Input() downloadRequest: DownloadRequest;

  constructor() { }

  ngAfterContentInit(): void {

  }

  ngOnInit() {
  }

  getMode() {
    return this.downloadRequest.progress != null && this.downloadRequest.progress > 0 ? 'determinate' : 'indeterminate';
  }

  getReadableFileSize() {
    if (this.downloadRequest.downloadedSize < 500) {
      return `${this.downloadRequest.downloadedSize} B`;
    } else if ((this.downloadRequest.downloadedSize / 1024) < 500) {
      return `${(this.downloadRequest.downloadedSize / 1024).toFixed(2)} KB`;
    } else {
      return `${(this.downloadRequest.downloadedSize / 1024 / 1024).toFixed(2)} MB`;
    }
  }

  isCSV() {
    return this.downloadRequest.contentType != null && this.downloadRequest.contentType.startsWith('text/csv');
  }

  isExcel() {
    // tslint:disable-next-line:max-line-length
    return (this.downloadRequest.contentType === 'application/ms-excel' || this.downloadRequest.contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8');
  }

  isZip() {
    return this.downloadRequest.contentType === 'application/zip';
  }

  isPDF() {
    return this.downloadRequest.contentType === 'application/pdf';
  }

  getValue() {
    return this.downloadRequest.progress;
  }

  getDownloadURL(){
    const access_token = localStorage.getItem("access_token");
    return this.downloadRequest.url + `?access_token=${access_token}`;
  }

  get isNewDownload(){
    return this.downloadRequest.progress == 100 && this.downloadRequest.downloadAttempts == '0';
  }

}
