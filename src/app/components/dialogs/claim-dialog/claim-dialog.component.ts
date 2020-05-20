import { AttachmentService } from './../../../services/attachmentService/attachment.service';
import { Component, OnInit, Inject, AfterContentInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ViewedClaim } from 'src/app/models/viewedClaim';
import { FormControl } from '@angular/forms';
import { ClaimService } from 'src/app/services/claimService/claim.service';
import { ClaimStatus } from 'src/app/models/claimStatus';
import { HttpResponse, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { SharedServices } from 'src/app/services/shared.services';
import { ClaimFields } from 'src/app/models/claimFields';
import { ICDDiagnosis } from 'src/app/models/ICDDiagnosis';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { SearchService } from 'src/app/services/serchService/search.service';
import { Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { sampleTime } from 'rxjs/operators';
import { UploadAttachmentType } from 'src/app/models/UploadAttacchmentType';

@Component({
  selector: 'app-claim-dialog',
  templateUrl: './claim-dialog.component.html',
  styleUrls: ['./claim-dialog.component.css']
})
export class ClaimDialogComponent implements OnInit, AfterContentInit {
  files: File[] = [];
  newAttachmentsPreview: { src: (string | ArrayBuffer), name: string, index: number }[] = [];
  toDeleteAttachments = [];
  maxNumberOfAttachment: number;
  fileType: string;


  constructor(public commen: SharedServices,
    public dialogRef: MatDialogRef<ClaimDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { claim: ViewedClaim, edit: boolean, maxNumberOfAttachment: any },
    public claimUpdateService: ClaimService,
    public adminService: AdminService,
    private searchService: SearchService,
    private attachmentService: AttachmentService,
    private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    if (this.data.claim.errors.length > 0) {
      this.setErrors();
    }
    this.maxNumberOfAttachment = Number.parseInt(this.data.maxNumberOfAttachment);
  }

  ngAfterContentInit() {
    if (this.data.edit) {
      this.toggleEditMode()
    }
  }

  loading: boolean = false;
  loadingResponse: string;

  commentBoxText: string;
  commentBoxClasses: string;


  memberidClasses: string;
  genderClasses: string;
  approvalClasses: string;
  eligibilityClasses: string;
  servicesErrors:string[] = [];

  isEditMode: boolean = false;
  editButtonLabel: string = "Edit";

  memberid = new FormControl(this.data.claim.memberid);
  gender = new FormControl(this.data.claim.gender);
  approvalnumber = new FormControl(this.data.claim.approvalnumber);
  eligibilitynumber = new FormControl(this.data.claim.eligibilitynumber);
  policynumber = new FormControl(this.data.claim.policynumber);
  chiefComplaintSymptoms = new FormControl(this.data.claim.chiefcomplaintsymptoms);
  nationalId = new FormControl(this.data.claim.nationalId);


  searchDiag = new FormControl("");

  options: ICDDiagnosis[] = [];

  diagnosisList: ICDDiagnosis[] = [];
  toAddFileTypeAttachments:UploadAttachmentType [] = [];


  setErrors() {
    this.commentBoxClasses = 'error';
    this.commentBoxText = "";
    for (let error of this.data.claim.errors) {
      if(error.code != 'SERVCOD-VERFIY'){
        this.commentBoxText += `${error.description}\n`;
      } else {
        this.servicesErrors.push(error.fieldName.split(':')[1]);
      }
      if (error.fieldName == ClaimFields.APPNO) {
        this.approvalClasses = 'error';
      }
      if (error.fieldName == ClaimFields.MEMID) {
        this.memberidClasses = 'error';
      }
      if (error.fieldName == ClaimFields.GENDER) {
        this.genderClasses = 'error';
      }
      if (error.fieldName == ClaimFields.ELGNO) {
        this.eligibilityClasses = 'error';
      }
    }
  }

  resetErrors() {
    this.commentBoxClasses = null;
    this.commentBoxText = null;
    this.approvalClasses = null;
    this.memberidClasses = null;
  }

  isEditable() {
    switch (this.data.claim.status) {
      case ClaimStatus.Accepted:
      case ClaimStatus.INVALID:
      case ClaimStatus.NotAccepted:
      case 'Failed':
        return true;
      default:
        return false;
    }
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    this.editButtonLabel = this.isEditMode ? "Cancel" : "Edit";
    if (!this.isEditMode) {
      this.diagnosisList = [];
      this.removeAddedDiagFromClaimList();
      this.toDeleteAttachments.forEach(attachment => this.data.claim.attachments.push(attachment))
      this.toDeleteAttachments = [];
      this.toAddFileTypeAttachments = [];
      this.files = [];
      this.newAttachmentsPreview = [];
    }
  }

  removeAddedDiagFromClaimList() {

    this.data.claim.diagnosis = this.data.claim.diagnosis.filter((x => x.diagnosisId != null));
  }

  deleteDiagnosis(diagnosis) {
    if (diagnosis.diagnosisId != null) {
      this.diagnosisList.push(diagnosis);
    } else {
      delete this.diagnosisList[this.diagnosisList.indexOf(diagnosis)];
      delete this.data.claim.diagnosis[this.data.claim.diagnosis.indexOf(diagnosis)];
    }
  }

  searchICDCodes() {
    this.options = [];
    if (this.searchDiag.value != "")
      this.adminService.searchICDCode(this.searchDiag.value).subscribe(
        event => {
          if (event instanceof HttpResponse) {
            if (event.body instanceof Object)
              Object.keys(event.body).forEach(key => {
                this.options.push(new ICDDiagnosis(null,
                  event.body[key]["icddiagnosisCode"],
                  event.body[key]["description"]
                )
                )
              });
          }
        }
      );
  }

  addICDDignosis(diag) {
    if (this.data.claim.diagnosis.length < 14 && !(this.elementIsInList(diag))) {
      this.diagnosisList.push(diag);
      this.data.claim.diagnosis.push(diag);
    } else {
      if (this.data.claim.diagnosis.length >= 14)
        alert("Only 14 Dignosis are Allowed");
      else {
        alert("Diagnosis Already in List");
      }
    }

  }

  elementIsInList(diag: any): boolean {
    let list = this.data.claim.diagnosis.filter((x => x.diagnosisCode == diag.diagnosisCode));
    return list.length > 0;
  }


  save() {
    let updateRequestBody: FormData = new FormData();
    let claim: { [k: string]: any } = {};
    let flag = false;
    if (this.memberid.value != this.data.claim.memberid) {
      claim.memberid = this.memberid.value;
      flag = true;
    }
    if (this.nationalId.value != this.data.claim.nationalId) {
      claim.nationalid = this.nationalId.value;
      flag = true;
    }
    if (this.gender.value != this.data.claim.gender) {
      claim.gender = this.gender.value;
      flag = true;
    }
    if (this.approvalnumber.value != this.data.claim.approvalnumber) {
      claim.approvalnumber = this.approvalnumber.value;
      flag = true;
    }
    if (this.eligibilitynumber.value != this.data.claim.eligibilitynumber) {
      claim.eligibilitynumber = this.eligibilitynumber.value;
      flag = true;
    }
    if (this.policynumber.value != this.data.claim.policynumber) {
      claim.policynumber = this.policynumber.value;
      flag = true;
    }

    if (this.diagnosisList.length > 0) {
      claim.diagnosis = this.diagnosisList;
      flag = true;
    }
    if (this.chiefComplaintSymptoms.value != this.data.claim.chiefcomplaintsymptoms) {
      claim.chiefcomplaintsymptoms = this.chiefComplaintSymptoms.value;
      flag = true;
    }

    if (this.files.length > 0) {
      flag = true;
    }
  
    if (this.toAddFileTypeAttachments.length > 0) {
      claim.types = this.toAddFileTypeAttachments;
      flag = true;
    }

    if (this.toDeleteAttachments.length > 0) {
      flag = true;
      claim.deletedAttachments = this.toDeleteAttachments.map(attachment => attachment.attachmentid);
    }

    if (flag) {
      this.loading = true;
      let body: FormData = new FormData();
      if(claim != {})
        body.append('claim', JSON.stringify(claim));
      this.files.forEach(file => body.append("files", file, file.name));
      this.claimUpdateService.updateClaim(this.data.claim.providerId, this.data.claim.payerid, this.data.claim.claimid, body).subscribe(event => {
        if (event instanceof HttpResponse) {
          if (event.status == 201) {
            this.loadingResponse = 'Your claim is now: ' + this.commen.statusToName(event.body['status']);
            this.reloadeClaim();
          }
        }
      }, eventError => {
        if (eventError instanceof HttpErrorResponse) {
          this.loadingResponse = eventError.message;
          this.reloadeClaim();
        }
      });
    }
  }
  isAccepted() {
    return this.loadingResponse != null && this.loadingResponse.includes(this.commen.statusToName(ClaimStatus.Accepted));
  }
  onDoneSaving() {
    if (this.isAccepted()) {
      this.dialogRef.close(true);
    }
    this.loading = false;
    this.loadingResponse = null;
  }

  reloadeClaim() {
    this.toDeleteAttachments = [];
    this.files = [];
    this.newAttachmentsPreview = [];
    this.searchService.getClaim(this.data.claim.providerId, `${this.data.claim.claimid}`).subscribe(event => {
      if (event instanceof HttpResponse) {
        const providerId = this.data.claim.providerId;
        const payerId = this.data.claim.payerid;
        const status = this.data.claim.status;
        this.data.claim = JSON.parse(JSON.stringify(event.body));
        this.data.claim.providerId = providerId;
        this.data.claim.payerid = payerId;
        this.data.claim.status = status;
        this.resetErrors();
        if (this.data.claim.errors.length > 0) {
          this.setErrors();
        }
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        this.dialogRef.close(true);
      }
    });
  }

  genderToText(g: string) {
    if (g == 'M') return 'Male';
    if (g == 'F') return 'Female';
    else return '';
  }

  getPatientFullName() {
    return `${this.data.claim.firstname != null ? this.data.claim.firstname : ""} ${this.data.claim.middlename != null ? this.data.claim.middlename : ""}  ${this.data.claim.lastname != null ? this.data.claim.lastname : ""}  `;
    //return `${this.data.claim.firstname} ${this.data.claim.middlename} ${this.data.claim.lastname}`;
  }

  getPatientName() {
    let name = this.getPatientFullName();
    if (name.length > 30)
      return name.substring(0, 27) + '...';
    else return name;
  }

  uploadAttachmentToBackend(file: File) {
    this.attachmentService.uploadAttachament(this.data.claim.providerId, this.data.claim.claimid + "", file)
      .subscribe(event => {
        if (event instanceof HttpResponse) {
          this.loadingResponse += `${file.name} uploaded`;
          console.log(`${file.name} uploaded`);
        }
      }, errorEvent => {
        if (errorEvent instanceof HttpErrorResponse) {
          this.loadingResponse += `${file.name} error uploading`;
          console.log(`${file.name} error uploading: ${errorEvent.error}`);
        }
      }
      );
  }


  getImageOfBlob(attachment) {
    let fileExt = attachment.filename.split(".").pop();
    if (fileExt.toLowerCase() == 'pdf') {
      let objectURL = `data:application/pdf;base64,` + attachment.attachmentfile;
      return this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
    } else {
      let objectURL = `data:image/${fileExt};base64,` + attachment.attachmentfile;
      return this.sanitizer.bypassSecurityTrustUrl(objectURL);
    }

  }

  selectFilesError = null;
  selectFile(event) {
    this.selectFilesError = null;
    let file = event.item(0);
    if (file instanceof File) {
      if (file.size == 0)
        return;
      let mimeType = file.type;
      if (mimeType.match(/image\/*/) == null && !mimeType.includes('pdf')) {
        return;
      }
      if (this.files.find(selectedFile => selectedFile.name == file.name) != undefined) {
        this.selectFilesError = "You can't choose two files of the same name."
        return;
      }
      if (this.data.claim.attachments.find(attachment => attachment.filename == file.name) != undefined) {
        this.selectFilesError = "A file with the same name already exists."
        return;
      }
      if (file.size / 1024 / 1024 > 2) {
        this.selectFilesError = "Selected files should not be more than 2M."
        return;
      }
      this.files.push(file);
      if(this.fileType!=null && this.fileType != "")
      this.toAddFileTypeAttachments.push(new UploadAttachmentType (file.name, this.fileType));
      this.preview(file, this.files.length - 1);
      console.log(this.fileType);
    }
  }

  preview(file: File, index: number) {
    var mimeType = file.type;
    if (mimeType.includes('pdf')) {
      return this.newAttachmentsPreview.push({ src: 'pdf', name: file.name, index: index });
    }

    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.newAttachmentsPreview.push({ src: reader.result, name: file.name, index: index });
    }
  }

  isPdf(attachment) {
    let fileExt = attachment.filename.split(".").pop();
    return fileExt.toLowerCase() == 'pdf';
  }

  deleteAttachment(attachment) {
    let index = this.data.claim.attachments.indexOf(attachment);
    if (index >= 0) {
      this.toDeleteAttachments.push(this.data.claim.attachments.splice(index, 1)[0]);
    }

  }

  deleteNewAttachment(attachment: { src: string | ArrayBuffer, name: string, index: number }) {
    this.files.splice(attachment.index, 1);
    let index = this.newAttachmentsPreview.indexOf(attachment);
    if (index >= 0)
      this.newAttachmentsPreview.splice(index, 1);
  }
}
