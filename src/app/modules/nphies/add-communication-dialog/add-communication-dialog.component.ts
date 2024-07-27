import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NphiesPollManagementService } from 'src/app/services/nphiesPollManagement/nphies-poll-management.service';
import { SharedServices } from 'src/app/services/shared.services';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-add-communication-dialog',
  templateUrl: './add-communication-dialog.component.html',
  styles: []
})
export class AddCommunicationDialogComponent implements OnInit {

  fetchCommunications = new EventEmitter();
  filteredItem: ReplaySubject<any> = new ReplaySubject<any[]>(1);
  onDestroy = new Subject<void>();

  payLoads = [];
  FormCommunication: FormGroup = this.formBuilder.group({
    payloadValue: ['', Validators.required],
    payloadAttachment: [''],
    attachmentName: [''],
    attachmentType: [''],
    createdDate: [''],
    claimItemId: [''],
    claimItemIdFilter: [''],
  });
  isToggled: boolean = false;

  currentFileUpload: any;
  isSubmitted = false;
  emptyPayloadError = '';
  invalidFileMessage = '';
  items = [];
  selectedFile: any;

  constructor(
    private dialogRef: MatDialogRef<AddCommunicationDialogComponent>, private nphiesPollManagementService: NphiesPollManagementService,
    private dialogService: DialogService, private sharedServices: SharedServices,
    @Inject(MAT_DIALOG_DATA) public data, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.setItems();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  setItems() {
    if (this.data.items && this.data.items.length > 0) {
      this.items = this.data.items.map(x => {
        const model: any = {};
        model.value = x.itemId;
        model.sequence = x.sequence;
        model.typeName = x.typeName;
        model.itemCode = x.itemCode;
        model.itemDescription = x.itemDescription;
        model.nonStandardCode = x.nonStandardCode;
        model.nonStandardDesc = x.display;
        model.status=x.itemDecision!= null?x.itemDecision.status:null
        return model;
      });

     

      this.filteredItem.next(this.items.slice());
      this.FormCommunication.controls.claimItemIdFilter.valueChanges
        .pipe(takeUntil(this.onDestroy))
        .subscribe(() => {
          this.filterItem();
        });

    }
  }

  filterItem() {
    if (!this.items) {
      return;
    }
    // get the search keyword
    let search = this.FormCommunication.controls.claimItemIdFilter.value;
    if (!search) {
      this.filteredItem.next(this.items.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the nations
    this.filteredItem.next(
      this.items.filter(item => (item.sequence.toString().toLowerCase().indexOf(search) > -1) ||
        (item.typeName.toLowerCase().indexOf(search) > -1) ||
        (item.itemCode.toLowerCase().indexOf(search) > -1) ||
        (item.itemDescription.toLowerCase().indexOf(search) > -1) ||
        (item.nonStandardCode.toLowerCase().indexOf(search) > -1))
    );
  }

  selectFile(event) {
    this.FormCommunication.controls.payloadValue.reset();
    this.invalidFileMessage = '';

    for (let i = 0; i < event.target.files.length; i++) {
      if (!this.checkfile(event.target.files[i])) {
        this.invalidFileMessage = 'Attachments are only allowed in the formats of .pdf or .jpeg';
        break;
      }
    }

    for (let i = 0; i < event.target.files.length; i++) {
      this.currentFileUpload = event.target.files[i];
      const attachmentName = this.currentFileUpload.name;
      const attachmentType = this.currentFileUpload.type;
      const sizeInMB = this.sharedServices.formatBytes(this.currentFileUpload.size);

      if (!this.checkfile(event.target.files[i])) {
        continue;
      }

      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[i]);
      reader.onloadend = () => {
        const data: string = reader.result as string;
        const model: any = {};
        model.payloadValue = null;
        model.payloadAttachment = (data.substring(data.indexOf(',') + 1));
        model.attachmentName = attachmentName;
        model.attachmentType = attachmentType;
        const createDate = new Date();
        model.createdDate = createDate.toISOString().replace('Z', '');
        this.FormCommunication.controls.payloadValue.clearValidators();
        this.FormCommunication.controls.payloadValue.updateValueAndValidity();
        this.selectedFile = model;
        // this.payLoads.push(model);

        // if (i === event.target.files.length - 1) {
        //   this.emptyPayloadError = '';
        //   this.FormCommunication.reset();
        //   this.isSubmitted = false;
        // }

      };
    }

  }

  checkfile(file: any) {
    const validExts = ['.pdf', '.jpeg', '.jpg'];
    let fileExt = file.name;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
      return false;
    } else {
      return true;
    }
  }

  add() {
    this.isSubmitted = true;
    if (this.selectedFile) {
      this.FormCommunication.controls.payloadValue.setValidators([Validators.required]);
      this.FormCommunication.controls.payloadValue.updateValueAndValidity();
      const model: any = this.selectedFile;
      model.claimItemId = this.FormCommunication.controls.claimItemId.value;
      this.selectedFile = null;
      this.payLoads.push(model);
      this.isSubmitted = false;
      this.emptyPayloadError = '';
      this.FormCommunication.reset();
    } else if (this.FormCommunication.valid) {
      const model: any = this.FormCommunication.value;
      this.payLoads.push(model);
      this.isSubmitted = false;
      this.emptyPayloadError = '';
      this.FormCommunication.reset();
    }
  }

  removePayload(i) {
    this.payLoads.splice(i, 1);
    if (this.payLoads.length === 0) {
      this.emptyPayloadError = 'Please select a file or enter comment';
    }
  }

  onSubmit() {
    console.log("data ",this.data);
    if (this.payLoads.length === 0) {
      this.emptyPayloadError = 'Please select a file or enter comment';
      return;
    }
    this.emptyPayloadError = '';
    this.sharedServices.loadingChanged.next(true);
    const model: any = {};
    model.claimResponseId = this.data.claimResponseId;
    model.claimProviderId =  this.data.claimProviderId;
    if (this.data.communicationRequestId) {
      model.communicationRequestId = this.data.communicationRequestId;
    }

    model.payloads = this.payLoads.map(x => {
      const pModel: any = {};
      pModel.attachmentName = x.attachmentName;
      pModel.attachmentType = x.attachmentType;
      pModel.claimItemId = x.claimItemId ? x.claimItemId.value : null;
      pModel.createdDate = x.createdDate;
      pModel.payloadAttachment = x.payloadAttachment;
      pModel.payloadValue = x.payloadValue;
      return pModel;
    });

    console.log(model);
    this.nphiesPollManagementService.sendCommunication(this.sharedServices.providerId, model,this.data.isApproval,this.data.isPrescriber).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          const body: any = event.body;

          if (body.outcome.toString().toLowerCase() === 'error') {
            const errors: any[] = [];

            if (body.disposition) {
              errors.push(body.disposition);
            }

            if (body.errors && body.errors.length > 0) {
              body.errors.forEach(err => {
                errors.push(err);
              });
            }
            this.sharedServices.loadingChanged.next(false);
            this.dialogService.showMessage(body.message, '', 'alert', true, 'OK', errors, true);
            this.fetchCommunications.emit(true);
          } else {
            this.sharedServices.loadingChanged.next(false);
            this.dialogRef.close(true);
          }
        }
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          if (error.error && error.error.errors) {
            // tslint:disable-next-line:max-line-length
            this.dialogService.showMessage('Error', (error.error && error.error.message) ? error.error.message : ((error.error && !error.error.message) ? error.error : (error.error ? error.error : error.message)), 'alert', true, 'OK', error.error.errors);
          } else {
            // tslint:disable-next-line:max-line-length
            this.dialogService.showMessage('Error', (error.error && error.error.message) ? error.error.message : ((error.error && !error.error.message) ? error.error : (error.error ? error.error : error.message)), 'alert', true, 'OK');
          }
        } else if (error.status === 404) {
          this.dialogService.showMessage('Error', error.error, 'alert', true, 'OK', null, true);
        } else if (error.status === 500) {
          this.dialogService.showMessage('Error', error.error.message, 'alert', true, 'OK', null, true);
        } else if (error.status === 503) {
          const errors: any[] = [];
          if (error.error.errors) {
            error.error.errors.forEach(x => {
              errors.push(x);
            });
            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', errors);
          } else {
            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', null, true);
          }
        }
        this.sharedServices.loadingChanged.next(false);
      }
    });
  }

  getFilename(str) {
    if (str.indexOf('pdf') > -1) {
      return 'pdf';
    } else {
      return 'image';
    }
  }

  toggle() {
    this.isToggled = !this.isToggled;
  }

}
