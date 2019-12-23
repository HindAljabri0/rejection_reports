import { UploadService } from '../../../services/claimfileuploadservice/upload.service';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, OnDestroy } from '@angular/core';
import {  HttpEventType, HttpResponse, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StepperProgressBarController, Step } from 'stepper-progress-bar';
import { CommenServicesService } from '../../../services/commen-services.service';

import { UploadSummary } from 'src/app/models/uploadSummary';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { async } from '@angular/core/testing';



@Component({
  selector: 'app-claimfileupload',
  templateUrl: './claimfileupload.component.html',
  styleUrls: ['./claimfileupload.component.css']
})
export class ClaimfileuploadComponent implements OnInit {
  // constructor(private http: HttpClient) {}
  constructor(public uploadService: UploadService, public common:CommenServicesService) { }

  ngOnInit(): void {
    this.steps.push(new Step('Uploading'));
    this.steps.push(new Step('Parsing'));
    this.steps.push(new Step('Validating'));
    this.steps.push(new Step('Done!'));
  }


  title = 'testing';
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
    if (!this.checkfile()){
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
    if(this.common.loading || this.uploading) {
      return;
    }
    
    let providerId = this.common.providerId;
    this.uploading = true;
    this.progressStepper.nextStep();
    this.uploadService.pushFileToStorage(providerId,this.currentFileUpload);
    let progressObservable = this.uploadService.progressChange.subscribe(progress => {
      if(progress.percentage == 100){
        this.progressStepper.nextStep();
        progressObservable.unsubscribe();
      }
    });
    let summaryObservable = this.uploadService.summaryChange.subscribe(async value =>{
      this.progressStepper.nextStep();
        await this.delay(600);
        this.progressStepper.nextStep();
        await this.delay(600);
        this.progressStepper.nextStep();
        await this.delay(600);
        summaryObservable.unsubscribe();
    });
    let errorobservable = this.uploadService.errorChange.subscribe(error =>{
      this.common.openDialog(new MessageDialogData("", error, true));
      this.progressStepper.previousStep();
      this.progressStepper.previousStep();
      errorobservable.unsubscribe();
    });
    this.cancel();
  }

  cancel(){
    this.currentFileUpload = null;
    this.selectedFiles = null;
  }

  async delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }


}

