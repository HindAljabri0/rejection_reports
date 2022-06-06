import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Provider } from 'src/app/models/nphies/provider';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-create-provider',
  templateUrl: './create-provider.component.html',

})
export class CreateProviderComponent implements OnInit {

  providerInfoForm: FormGroup;
  submitted=false;
  providerInfo: Provider;
  CCHI_IdControl = new FormControl();
  providerNphiesIdControl = new FormControl();
  providerNameEnglishControl = new FormControl();
  providerNameArabicControl = new FormControl();
  constructor( private dialogService: DialogService,public commen: SharedServices, private providerNphiesSearchService: ProviderNphiesSearchService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.providerInfoForm = this.formBuilder.group({
      CCHI_IdControl: ['', Validators.required],
      providerNphiesIdControl: ['', Validators.required],
      providerNameEnglishControl: ['', Validators.required],
      providerNameArabicControl: ['', Validators.required],
    });

  }

  addProvider() {
    this.submitted=true;
    if(this.providerInfoForm.valid){
    this.commen.loadingChanged.next(true);
    this.providerInfo = {
      // console.log(this.providerInfoForm.controls.CCHI_IdControl.value)
      "cchiid": this.providerInfoForm.controls.CCHI_IdControl.value,
      "arabicName": this.providerInfoForm.controls.providerNameArabicControl.value,
      "englistName": this.providerInfoForm.controls.providerNameEnglishControl.value,
      "nphiesId": this.providerInfoForm.controls.providerNphiesIdControl.value,
    }
    this.providerNphiesSearchService.addNewProvider(this.commen.providerId, this.providerInfo).subscribe(event => {

      if (event instanceof HttpResponse) {
        if (event.status == 200 || event.status) {
          this.commen.loadingChanged.next(false);
          this.dialogService.openMessageDialog({
            title: '',
            message: `provider save successfully`,
            isError: false
          });

          this.providerInfoForm.controls.CCHI_IdControl.setValue('');
          this.providerInfoForm.controls.providerNameArabicControl.setValue('');
          this.providerInfoForm.controls.providerNameEnglishControl.setValue('');
           this.providerInfoForm.controls.providerNphiesIdControl.setValue('');
           this.submitted=false;
        }

      }
    },
      error => {
        if (error instanceof HttpErrorResponse) {
          this.dialogService.openMessageDialog({
            title: '',
            message: error.message,
            isError: true
          });
        }
        this.commen.loadingChanged.next(false);
      });
  };
  }
}
