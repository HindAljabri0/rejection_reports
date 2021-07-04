import { OverlayRef } from '@angular/cdk/overlay';
import { HttpErrorResponse, HttpEvent, HttpEventType, HttpHeaderResponse, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import * as JSZip from 'jszip';
import { Observable, Subject, } from 'rxjs';
import { DOWNLOAD_STATUS_OBSERVER, OVERLAY_REFERENCE, REQUEST_OBSERVER } from 'src/app/services/downloadService/download.service';


@Component({
  selector: 'app-download-overlay',
  templateUrl: './download-overlay.component.html',
  styleUrls: ['./download-overlay.component.css']
})
export class DownloadOverlayComponent implements OnInit {

  progress = 0;
  fileName: string;
  contentType: string = '';
  errorMessage: string;

  constructor(@Inject(REQUEST_OBSERVER) private downloadMethod: Observable<HttpEvent<unknown>>,
    @Inject(DOWNLOAD_STATUS_OBSERVER) private status: Subject<DownloadStatus>,
    @Inject(OVERLAY_REFERENCE) private overlayRef: OverlayRef) { }

  ngOnInit() {
    this.status.next(DownloadStatus.INIT);
    this.downloadMethod.subscribe(event => {
      this.status.next(DownloadStatus.DOWNLOADING);
      if (event instanceof HttpHeaderResponse) {
        this.getFileName(event.headers.get("Content-Disposition"));
        this.contentType = event.headers.get("Content-Type");
      }
      else if (event.type == HttpEventType.DownloadProgress) {
        this.progress = event.loaded / (event.loaded + (event.loaded + 3 / event.loaded + 1 * 1000000)) * 100;
      } else if (event instanceof HttpResponse) {
        this.progress = 100;
        this.status.next(DownloadStatus.DONE);
        if (this.isCSV()) {
          if (navigator.msSaveBlob) {
            const exportedFilename = this.fileName;
            const blob = new Blob([event.body as BlobPart], { type: 'text/csv;charset=utf-8;' });
            navigator.msSaveBlob(blob, exportedFilename);
          } else {
            const a = document.createElement('a');
            a.href = 'data:attachment/csv;charset=ISO-8859-1,' + encodeURI(event.body + '');
            a.target = '_blank';
            a.download = this.fileName;
            a.click();
          }
        } else if (this.isZip()) {
          const zip = new JSZip();
          zip.generateAsync({ type: 'blob' }).then(function (blob) {
            const FileSaver = require('file-saver');
            FileSaver.saveAs(event.body, this.filename);
          }, function (err) {
            console.log('err: ' + err);
          });
        }
        this.detach();
      }
    }, errorEvent => {
      this.errorMessage = "Could not reach the server at the moment please try again later."
      this.status.next(DownloadStatus.ERROR);
      if (errorEvent instanceof HttpErrorResponse) {
        if (errorEvent.status == 404) {
          this.errorMessage = "Could not find data to download."
        } else if (errorEvent.status < 500) {
          this.errorMessage = errorEvent.error;
        }
      }
    })
  }

  getFileName(contentDisposition: string) {
    if (contentDisposition != null) {
      if (contentDisposition.includes('filename')) {
        this.fileName = contentDisposition.split('filename=')[1];
      } else {
        this.fileName = contentDisposition;
      }
    }
  }


  detach() {
    setTimeout(() => this.overlayRef.detach(), 6000);
  }

  dismiss() {
    this.overlayRef.detach();
  }

  isCSV() {
    return this.contentType.startsWith("text/csv");
  }

  isExcel() {
    return this.contentType == "application/excel";
  }

  isZip() {
    return this.contentType == "application/zip";
  }

}


export enum DownloadStatus { INIT, DOWNLOADING, ERROR, DONE }
