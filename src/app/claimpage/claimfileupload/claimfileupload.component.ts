import { UploadService, Summary } from '../claimfileuploadservice/upload.service';
import { Component, OnInit } from '@angular/core';
import {  HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StepperProgressBarController, Step } from 'stepper-progress-bar';
import { async } from 'q';



@Component({
  selector: 'app-claimfileupload',
  templateUrl: './claimfileupload.component.html',
  styleUrls: ['./claimfileupload.component.css']
})
export class ClaimfileuploadComponent implements OnInit {
  // constructor(private http: HttpClient) {}
  constructor(private uploadService: UploadService) { }

  ngOnInit(): void {
    this.steps.push(new Step('Uploading'));
    this.steps.push(new Step('Parsing'));
    this.steps.push(new Step('Validating'));
    this.steps.push(new Step('Done!'));
  }

  title = 'testing';
  progress: { percentage: number } = { percentage: 0 };
  uploading = false;
  currentFileUpload: File;
  selectedFiles: FileList;
  showFile = false;
  fileUploads: Observable<string[]>;

  uploadContainerClass = 'uploadfilecontainer';
  error = '';

  progressStepper:StepperProgressBarController = new StepperProgressBarController();
  steps:Step[] = new Array<Step>();
  isVertical=true;


  selectFile(event) {
    this.currentFileUpload = event.item(0);
    if (this.checkfile()) {
      this.upload();
    } else {
      this.currentFileUpload = undefined;
    }
  }
  checkfile() {
    const validExts = new Array('.xlsx', '.xls');
    let fileExt = this.currentFileUpload.name;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
      this.uploadContainerClass = 'uploadContainerErrorClass';
      this.error = 'Invalid file selected, valid files are of ' +
      validExts.toString() + ' types.';
      return false;
    } else {
      this.uploadContainerClass = 'uploadfilecontainer';
      this.error = '';
      return true;
    }
  }

  upload()  {
    this.progress.percentage = 0;
    this.uploading = true;
    this.progressStepper.nextStep();
    this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(async event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress.percentage = Math.round(100 * event.loaded / event.total);
        if(this.progress.percentage == 100) this.progressStepper.nextStep();
      } else if (event instanceof HttpResponse) {
        this.uploading = false;
        if (event.status === 200) {
          this.progressStepper.nextStep();
          await this.delay(600);
          this.progressStepper.nextStep();
          await this.delay(600);
          this.progressStepper.nextStep();
          await this.delay(600);
          const summary = new Summary(event.body);
          this.uploadService.summaryChange.next(summary);
        } else {
          this.progressStepper.previousStep();
          this.progressStepper.previousStep();
          this.uploadContainerClass = 'uploadContainerErrorClass';
          this.error = 'Sorry! Somthing went wrong!';
        }
      }
    }, (error) => {
      this.uploading = false;
    });
    this.selectedFiles = undefined;
  }
  async delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  showFiles(enable: boolean) {
    this.showFile = enable;
    if (enable) {
      this.fileUploads = this.uploadService.getFiles();
    }
  }
}

