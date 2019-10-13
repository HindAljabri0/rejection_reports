import { UploadService } from './../claimfileuploadservice/upload.service';
import { Component, OnInit } from '@angular/core';
import {  HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-claimfileupload',
  templateUrl: './claimfileupload.component.html',
  styleUrls: ['./claimfileupload.component.css']
})
export class ClaimfileuploadComponent {
  // constructor(private http: HttpClient) {}
  constructor(private uploadService: UploadService) { }

  progress: { percentage: number } = { percentage: 0 };
  currentFileUpload: File;
  selectedFiles: FileList;
  showFile = false;
  fileUploads: Observable<string[]>;



  selectFile(event: { target: { files: { item: (arg0: number) => File; }; }; }) {
    this.currentFileUpload = event.target.files.item(0);
  }
  upload() {
    this.progress.percentage = 0;
    console.log('uploading...');
    // this.currentFileUpload = this.selectedFiles.item(0);
    this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress.percentage = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        console.log('File is completely uploaded!');
      }
    });
    this.selectedFiles = undefined;
  }
  showFiles(enable: boolean) {
    this.showFile = enable;
    if (enable) {
      this.fileUploads = this.uploadService.getFiles();
    }
  }
}

 /* getFiles(): Observable<any> {
    return this.http.get('/getallfiles');
  }
} */

 /* fileToUpload: File = null;
  fileUploadService: any;
  loginForm: FormGroup;
  handleFileInput(files: FileList) {
  this.fileToUpload = files.item(0);
}
  uploadFileToActivity(url: string, file: File) {
    this.fileUploadService.postFile(this.fileToUpload).subscribe(() => {
      // if upload success
      console.log('file has been upload', this.loginForm);
      }, (error: any) => {
        console.log(error);
      });
  }

  // constructor(private service: UploadService) {
    // this.fileUploadService = service;
    }

  ngOnInit() {
    this.loginForm = new FormGroup({});

    }
  }*/

