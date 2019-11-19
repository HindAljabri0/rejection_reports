import { UploadService } from '../../../services/claimfileuploadservice/upload.service';
import { Component, OnInit } from '@angular/core';
import {  HttpEventType, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StepperProgressBarController, Step } from 'stepper-progress-bar';
import { CommenServicesService } from '../../../services/commen-services.service';

import { UploadSummary } from 'src/app/models/uploadSummary';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';



@Component({
  selector: 'app-claimfileupload',
  templateUrl: './claimfileupload.component.html',
  styleUrls: ['./claimfileupload.component.css']
})
export class ClaimfileuploadComponent implements OnInit {
  // constructor(private http: HttpClient) {}
  constructor(private uploadService: UploadService, private common:CommenServicesService) { }

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
    this.uploadService.pushFileToStorage('104','102',this.currentFileUpload).subscribe(async event => {
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
          const summary = new UploadSummary(event.body);
          this.uploadService.summaryChange.next(summary);
        }
      }
    }, (error) => {
      if(error instanceof HttpErrorResponse){
        let title:string;
        let message:string;
        if(error.status >= 500){
          title = "Server Error";
          message = 'Server could not handle your request at the moment. Please try Again later.';
        } else if (error.status >= 400){
          title = error.error['error'];
          message = error.error['message'];
        }
        this.common.openDialog(new MessageDialogData(title, message, true)).subscribe(value =>{
            
        });
      }
      this.uploading = false;
      this.currentFileUpload = undefined;
      this.progressStepper.previousStep();
      this.progressStepper.previousStep();
    });
    this.selectedFiles = undefined;
  }
  async delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

}

