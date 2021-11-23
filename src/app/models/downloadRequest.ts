import { HttpEvent } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';


export class DownloadRequest {

    downloadedSize$: Subject<number>;
    private _downloadedSize = -1;
    totalSize$: Subject<number>;
    private _totalSize = -1;
    status$: Subject<DownloadStatus>;
    private _status: DownloadStatus;
    filename$: Subject<string>;
    private _filename: string;
    contentType$: Subject<string>;
    private _contentType: string;
    errorMessage$: Subject<string>;
    private _errorMessage: string;

    progress$: Subject<number>;
    private _progress: number;
    url$: Subject<string>;
    private _url: string;
    downloadAttempts$: Subject<string>;
    private _downloadAttempts: string;
    fileId$: Subject<number>;
    private _fileId: number;
    creationStartDate$: Subject<string>;
    private _creationStartDate: string;
    creationEndDate$: Subject<string>;
    private _creationEndDate: string;

    constructor() {
        this.downloadedSize$ = new Subject();
        this.downloadedSize$.subscribe(downloadedSize => this._downloadedSize = downloadedSize);
        this.totalSize$ = new Subject();
        this.totalSize$.subscribe(totalSize => this._totalSize = totalSize);
        this.status$ = new Subject();
        this.status$.subscribe(status => this._status = status);
        this.filename$ = new Subject();
        this.filename$.subscribe(filename => this._filename = filename);
        this.contentType$ = new Subject();
        this.contentType$.subscribe(contentType => this._contentType = contentType);
        this.errorMessage$ = new Subject();
        this.errorMessage$.subscribe(errorMessage => this._errorMessage = errorMessage);

        this.progress$ = new Subject();
        this.progress$.subscribe(progress => this._progress = progress);
        this.url$ = new Subject();
        this.url$.subscribe(url => this._url = url);
        this.downloadAttempts$ = new Subject();
        this.downloadAttempts$.subscribe(downloadAttempts => this._downloadAttempts = downloadAttempts);
        this.fileId$ = new Subject();
        this.fileId$.subscribe(fileId => this._fileId = fileId);
        this.creationStartDate$ = new Subject();
        this.creationStartDate$.subscribe(creationStartDate => this._creationStartDate = creationStartDate);
        this.creationEndDate$ = new Subject();
        this.creationEndDate$.subscribe(creationEndDate => this._creationEndDate = creationEndDate);
    }

    get downloadedSize() {
        return this._downloadedSize;
    }
    get totalSize() {
        return this._totalSize;
    }
    get status() {
        return this._status;
    }
    get filename() {
        return this._filename;
    }
    get contentType() {
        return this._contentType;
    }
    get errorMessage() {
        return this._errorMessage;
    }

    get progress() {
        return this._progress;
    }
    get url() {
        return this._url;
    }
    get fileId() {
        return this._fileId;
    }
    get creationStartDate() {
        return this._creationStartDate;
    }
    get creationEndDate() {
        return this._creationEndDate;
    }
    get downloadAttempts() {
        return this._downloadAttempts;
    }

}

export enum DownloadStatus { INIT, DOWNLOADING, ERROR, DONE }
