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
    return this.downloadRequest.totalSize != null && this.downloadRequest.totalSize != -1 ? 'determinate' : 'indeterminate';
  }

  getReadableFileSize() {
    if (this.downloadRequest.downloadedSize < 500) {
      return `${this.downloadRequest.downloadedSize} B Downloaded.`;
    } else if ((this.downloadRequest.downloadedSize / 1024) < 500) {
      return `${(this.downloadRequest.downloadedSize / 1024).toFixed(2)} KB Downloaded.`;
    } else {
      return `${(this.downloadRequest.downloadedSize / 1024 / 1024).toFixed(2)} MB Downloaded.`;
    }
  }

  isCSV() {
    return this.downloadRequest.contentType != null && this.downloadRequest.contentType.startsWith("text/csv");
  }

  isExcel() {
    return this.downloadRequest.contentType == "application/ms-excel";
  }

  isZip() {
    return this.downloadRequest.contentType == "application/zip";
  }

  getValue() {
    return this.downloadRequest.totalSize != null && this.downloadRequest.totalSize != -1 ? this.downloadRequest.downloadedSize / this.downloadRequest.totalSize : this.downloadRequest.downloadedSize;
  }

}
