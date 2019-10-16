import { UploadService, Summary, ClaimSubmissionData } from '../claimfileuploadservice/upload.service';
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
  title = "testing";
  progress: { percentage: number } = { percentage: 0 };
  uploading:boolean = false;
  currentFileUpload: File;
  selectedFiles: FileList;
  showFile = false;
  fileUploads: Observable<string[]>;

  uploadContainerClass = "uploadfilecontainer";
  error = "";


  selectFile(event){
    this.currentFileUpload = event.item(0);
    console.log(this.currentFileUpload.name);
    if(this.checkfile()){
      this.upload();
    } else {
      this.currentFileUpload = undefined;
    }
  }
  checkfile() {
    var validExts = new Array(".xlsx", ".xls");
    var fileExt = this.currentFileUpload.name;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
      this.uploadContainerClass = "uploadContainerErrorClass";
      this.error = "Invalid file selected, valid files are of " +
      validExts.toString() + " types."
      return false;
    }
    else {
      this.uploadContainerClass = "uploadfilecontainer";
      this.error = "";
      return true;
    }
  }
  
  upload() {
    this.progress.percentage = 0;
    this.uploading = true;
    console.log('uploading...');
    this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress.percentage = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        console.log('File is completely uploaded!');
        this.uploading = false;
        if(event.status === 200){
          let summary = new Summary(event.body);     
          this.uploadService.summaryChange.next(summary);
        }
      }
    }, (error)=>{
      this.uploading = false;
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

