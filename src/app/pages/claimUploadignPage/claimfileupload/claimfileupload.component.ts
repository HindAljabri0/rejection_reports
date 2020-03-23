import { UploadService } from '../../../services/claimfileuploadservice/upload.service';
import { Component, OnInit} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CommenServicesService } from '../../../services/commen-services.service';

import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';



@Component({
  selector: 'app-claimfileupload',
  templateUrl: './claimfileupload.component.html',
  styleUrls: ['./claimfileupload.component.css']
})
export class ClaimfileuploadComponent implements OnInit {
  // constructor(private http: HttpClient) {}
  constructor(public uploadService: UploadService, public common:CommenServicesService, private dialogService:DialogService) { }

  ngOnInit(): void {
  }


  title = 'testing';
  uploading = false;
  currentFileUpload: File;
  selectedFiles: FileList;
  showFile = false;
  fileUploads: Observable<string[]>;

  

  uploadContainerClass = 'uploadfilecontainer';
  error = '';

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
    this.uploadService.pushFileToStorage(providerId,this.currentFileUpload);
    let progressObservable = this.uploadService.progressChange.subscribe(progress => {
      if(progress.percentage == 100){
        progressObservable.unsubscribe();
      }
    });
    let summaryObservable = this.uploadService.summaryChange.subscribe(async value =>{
        summaryObservable.unsubscribe();
        this.cancel();
    });
    let errorobservable = this.uploadService.errorChange.subscribe(error =>{
      this.dialogService.openMessageDialog(new MessageDialogData("", error, true));
      errorobservable.unsubscribe();
      this.cancel();
    });
  }

  cancel(){
    this.currentFileUpload = null;
    this.selectedFiles = null;
  }

  async delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }


}

