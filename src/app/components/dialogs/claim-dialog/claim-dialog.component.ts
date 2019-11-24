import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ViewedClaim } from 'src/app/models/viewedClaim';
import { FormControl } from '@angular/forms';
import { ClaimUpdateService } from 'src/app/services/claimUpdateService/claim-update.service';
import { ClaimStatus } from 'src/app/models/claimStatus';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { CommenServicesService } from 'src/app/services/commen-services.service';

@Component({
  selector: 'app-claim-dialog',
  templateUrl: './claim-dialog.component.html',
  styleUrls: ['./claim-dialog.component.css']
})
export class ClaimDialogComponent implements OnInit {

  constructor(private commen:CommenServicesService, public dialogRef: MatDialogRef<ClaimDialogComponent>, @Inject(MAT_DIALOG_DATA) public claim:ViewedClaim, private claimUpdateService:ClaimUpdateService) { }

  ngOnInit() {
    console.log(this.claim);
    if(this.claim.errors.length > 0){
      this.setErrors();
    }
  }

  loading:boolean = false;
  loadingResponse:string;

  commentBoxText:string;
  commentBoxClasses:string;


  memberidClasses:string;
  genderClasses:string;
  approvalClasses:string; 
  eligibilityClasses:string;

  isEditMode:boolean = false;
  editButtonLabel:string = "Edit";

  memberid = new FormControl(this.claim.memberid);
  gender = new FormControl(this.claim.gender);
  approvalnumber = new FormControl(this.claim.approvalnumber);
  eligibilitynumber = new FormControl(this.claim.eligibilitynumber);
  policynumber = new FormControl(this.claim.policynumber);

  setErrors(){
    this.commentBoxClasses = 'error';
    this.commentBoxText = "";
    for(let error of this.claim.errors){
      this.commentBoxText += `${error.description}\n`;
      if(error.fieldName.toLowerCase().includes(('approvalNumber').toLowerCase())){
        this.approvalClasses = 'error';
      }
      if(error.fieldName.toLowerCase().includes(('memberID').toLowerCase())){
        this.memberidClasses = 'error';
      }
    }
  }

  isEditable(){
    switch(this.claim.status){
      case ClaimStatus.Accepted:
      case ClaimStatus.INVALID:
      case ClaimStatus.NotAccepted:
        return true;
      default:
        return false;
    }
  }

  toggleEditMode(){
    this.isEditMode = !this.isEditMode;
    this.editButtonLabel = this.isEditMode? "Cancel" : "Edit";
  }

  save(){
    let updateRequestBody:{[k: string]: any} = {};
    let flag = false;
    if(this.memberid.value != this.claim.memberid){
      updateRequestBody.memberid = this.memberid.value;
      flag = true;
    }
    if(this.gender.value != this.claim.gender){
      updateRequestBody.gender = this.gender.value;
      flag = true;
    }
    if(this.approvalnumber.value != this.claim.approvalnumber){
      updateRequestBody.approvalnumber = this.approvalnumber.value;
      flag = true;
    }
    if(this.eligibilitynumber.value != this.claim.eligibilitynumber){
      updateRequestBody.eligibilitynumber = this.eligibilitynumber.value;
      flag = true;
    }
    if(this.policynumber.value != this.claim.policynumber){
      updateRequestBody.policynumber = this.policynumber.value;
      flag = true;
    }
    
    if(flag){
      this.loading = true;
      this.claimUpdateService.updateClaim(this.claim.providerId, this.claim.payerId, this.claim.claimid, updateRequestBody).subscribe(event =>{
        if(event instanceof HttpResponse){
          if(event.status == 201){
            this.loadingResponse = 'Your claim is now: ' + this.commen.statusToName(event.body['status']);
          }
        }
      }, eventError =>{
        if(eventError instanceof HttpErrorResponse){
          console.log(event);
        }
      });
    }
  }
  isAccepted(){
    return this.loadingResponse != null && this.loadingResponse.includes(this.commen.statusToName(ClaimStatus.Accepted));
  }
  onDoneSaving(){
    this.loading = false;
    if(this.isAccepted()){
      this.dialogRef.close(true);
    } else {
      this.reloadeClaim();
      this.dialogRef.close(false);
    }
  }

  reloadeClaim(){
    this.commen.getClaimAndViewIt(this.claim.providerId, this.claim.payerId, this.claim.status, `${this.claim.claimid}`);
  }

}
