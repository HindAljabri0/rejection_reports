import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { HttpErrorResponse, HttpEvent, HttpEventType, HttpHeaderResponse, HttpResponse } from '@angular/common/http';
import { Injectable, InjectionToken, Injector } from '@angular/core';
import * as JSZip from 'jszip';
import { Observable, Subject } from 'rxjs';
import { DownloadOverlayComponent } from 'src/app/components/reusables/download-overlay/download-overlay.component';
import { DownloadRequest, DownloadStatus } from 'src/app/models/downloadRequest';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  lastAttachedOverlay: ComponentPortal<DownloadOverlayComponent>;

  private _providerDownloads: DownloadRequest[] = [];
  providerDownloads: Subject<DownloadRequest[]> = new Subject();

  private _adminDownloads: DownloadRequest[] = [];
  adminDownloads: Subject<DownloadRequest[]> = new Subject();

  constructor(
    private overlay: Overlay,
    private _injector: Injector) {
    this.providerDownloads.subscribe(downloads => this._providerDownloads = downloads);
    this.adminDownloads.subscribe(downloads => this._adminDownloads = downloads);
  }

  startDownload(request: Observable<HttpEvent<unknown>>) {
    const downloadRequest = new DownloadRequest();
    this.providerDownloads.next([...this._providerDownloads, downloadRequest]);
    downloadRequest.status$.next(DownloadStatus.INIT);
    request.subscribe(event => {
      if (event instanceof HttpHeaderResponse) {
        downloadRequest.filename$.next(this.getFileName(event.headers.get('Content-Disposition')));
        downloadRequest.contentType$.next(event.headers.get('Content-Type'));
        downloadRequest.status$.next(DownloadStatus.DOWNLOADING);
      } else if (event.type == HttpEventType.DownloadProgress) {
        downloadRequest.downloadedSize$.next(event.loaded);
        downloadRequest.totalSize$.next(event.total);
        downloadRequest.status$.next(DownloadStatus.DOWNLOADING);
      } else if (event instanceof HttpResponse) {
        downloadRequest.status$.next(DownloadStatus.DONE);
        if (this.isCSV(downloadRequest.contentType)) {
          if (navigator.msSaveBlob) {
            const exportedFilename = downloadRequest.filename;
            const blob = new Blob([event.body as BlobPart], { type: 'text/csv;charset=utf-8;' });
            navigator.msSaveBlob(blob, exportedFilename);
          } else {
            const a = document.createElement('a');
            a.href = 'data:attachment/csv;charset=ISO-8859-1,' + encodeURIComponent(event.body + '');
            a.target = '_blank';
            a.download = downloadRequest.filename;
            a.click();
          }
        } else if (this.isZip(downloadRequest.contentType)) {
          const zip = new JSZip();
          zip.generateAsync({ type: 'blob' }).then(function (blob) {
            const FileSaver = require('file-saver');
            FileSaver.saveAs(event.body, downloadRequest.filename);
          }, function (err) {
            console.log('err: ' + err);
          });
        } else if (this.isExcel(downloadRequest.contentType)) {
          const blob = new Blob([event.body as BlobPart], { type: 'application/ms-excel' });
          const url = window.URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.download = downloadRequest.filename;
          anchor.href = url;
          anchor.click();
        }
      }
    }, errorEvent => {
      downloadRequest.errorMessage$.next('Could not reach the server at the moment please try again later.');
      downloadRequest.status$.next(DownloadStatus.ERROR);
      if (errorEvent instanceof HttpErrorResponse) {
        if (errorEvent.status == 404) {
          downloadRequest.errorMessage$.next('Could not find data to download.');
        } else if (errorEvent.status < 500) {
          downloadRequest.errorMessage$.next(errorEvent.error);
        }
      }
    });
    return downloadRequest.status$.asObservable();
  }

  startGeneratingDownloadFile(request: Observable<HttpEvent<unknown>>, isAdminFile = false) {
    console.log('start generating ');
    const downloadRequest = new DownloadRequest();
    if (!isAdminFile) {
      this._providerDownloads.unshift(downloadRequest);
      this.providerDownloads.next(this._providerDownloads);
    } else {
      this._adminDownloads.unshift(downloadRequest);
      this.adminDownloads.next(this._adminDownloads);
    }
    downloadRequest.status$.next(DownloadStatus.INIT);

    request.subscribe(event => {
      if (event.type == HttpEventType.DownloadProgress) {
        const partialBody = event['partialText'];
        if (partialBody != null) {
          const splittedBody = partialBody.split(' - ');
          const progress = Number.parseFloat(splittedBody.pop());
          downloadRequest.filename$.next(splittedBody[0]);
          downloadRequest.contentType$.next(splittedBody[1]);
          downloadRequest.progress$.next(progress);
        }
        downloadRequest.status$.next(DownloadStatus.DOWNLOADING);
      } else if (event instanceof HttpResponse) {
        const body = event.body + '';
        const splittedBody = body.split(' - ');
        downloadRequest.url$.next(splittedBody.pop());
        downloadRequest.progress$.next(100);
        downloadRequest.status$.next(DownloadStatus.DONE);
      }
    }, errorEvent => {
      downloadRequest.errorMessage$.next('Could not reach the server at the moment please try again later.');
      downloadRequest.status$.next(DownloadStatus.ERROR);
      if (errorEvent instanceof HttpErrorResponse) {
        if (errorEvent.status == 404) {
          downloadRequest.errorMessage$.next('Could not find data to download.');
        } else if (errorEvent.status < 500) {
          downloadRequest.errorMessage$.next(errorEvent.message);
        }
      }
    });
    return downloadRequest.status$.asObservable();
  }

  getFileName(contentDisposition: string) {
    if (contentDisposition != null) {
      if (contentDisposition.includes('filename')) {
        return contentDisposition.split('filename=')[1].replace(`"`, '').replace(`"`, '');
      } else {
        return contentDisposition;
      }
    }
  }

  isCSV(contentType: string) {
    return contentType.startsWith('text/csv');
  }

  isExcel(contentType: string) {
    return contentType == 'application/ms-excel';
  }

  isZip(contentType: string) {
    return contentType == 'application/zip';
  }

}

export const REQUEST_OBSERVER = new InjectionToken<{}>('REQUEST_OBSERVER');
export const DOWNLOAD_STATUS_OBSERVER = new InjectionToken<{}>('DOWNLOAD_STATUS_OBSERVER');
export const OVERLAY_REFERENCE = new InjectionToken<{}>('OVERLAY_REFERENCE');
