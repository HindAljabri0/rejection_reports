import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Provider } from 'src/app/models/nphies/provider';
import { SuperAdminService } from 'src/app/services/administration/superAdminService/super-admin.service';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-create-provider',
  templateUrl: './create-provider.component.html',

})
export class CreateProviderComponent implements OnInit {

  providerInfoForm: FormGroup;
  submitted = false;
  error: string;

  certificateTypes=[{value:'0',text:"own certificate"},{value:'1',text:"Waseel certificate"}];
  selectedProvider: string;
  providers: any[] = [];
  providerInf: any;
  filteredProviders: any[] = [];
  providerInfo: Provider;
  CCHI_IdControl = new FormControl();
  providerNphiesIdControl = new FormControl();
  providerNameEnglishControl = new FormControl();
  providerNameArabicControl = new FormControl();
  providerController = new FormControl();
  certificateTypeControl=new FormControl();
  constructor(private superAdmin: SuperAdminService, private dialogService: DialogService, public commen: SharedServices, private providerNphiesSearchService: ProviderNphiesSearchService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.commen.loadingChanged.next(true);

    this.superAdmin.getProvidersWithCHHI_ID().subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body instanceof Array) {
          this.providers = event.body;
          this.filteredProviders = this.providers;

          this.commen.loadingChanged.next(false);
        }
      }
    }, error => {
      this.commen.loadingChanged.next(false);
      this.error = 'could not load providers, please try again later.';
      console.log(error);
    });
    this.providerInfoForm = this.formBuilder.group({
      providerController: ['', Validators.required],
      CCHI_IdControl: ['', Validators.required],
      providerNphiesIdControl: ['', Validators.required],
      providerNameEnglishControl: ['', Validators.required],
      providerNameArabicControl: ['', Validators.required],
      certificateTypeControl:['', Validators.required]
    });

  }

  addProvider() {
console.log(this.providerInfoForm.controls.certificateTypeControl.value)
    this.submitted = true;
    if (this.providerInfoForm.valid) {
      this.commen.loadingChanged.next(true);
      this.providerInfo = {
        "cchiid": this.providerInfoForm.controls.CCHI_IdControl.value,
        "arabicName": this.providerInfoForm.controls.providerNameArabicControl.value.trim(),
        "englistName": this.providerInfoForm.controls.providerNameEnglishControl.value.trim(),
        "nphiesId": this.providerInfoForm.controls.providerNphiesIdControl.value,
        "waseel_associated_provider": this.providerInfoForm.controls.certificateTypeControl.value!='1'?false:true,
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
            this.providerInfoForm.controls.certificateTypeControl.setValue('');
            this.submitted = false;
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
  updateFilter() {
    this.filteredProviders = this.providers.filter(provider =>
      `${provider.providerId} | ${provider.cchi_ID} |${provider.providerCode} | ${provider.providerEnglishName}`.toLowerCase()
        .includes(this.providerInfoForm.controls.providerController.value.toLowerCase())
    );
  }

  selectProvider(providerId: string = null) {
    ;
    if (providerId !== null) {
      this.selectedProvider = providerId;
      this.providerInf = this.providers.filter(provider => provider.providerId == providerId)[0];
      this.providerInfoForm.controls.CCHI_IdControl.setValue(this.providerInf.cchi_ID);
      this.providerInfoForm.controls.providerNameArabicControl.setValue(this.providerInf.providerArabicNameNphies!=null?this.providerInf.providerArabicNameNphies:this.providerInf.providerArabicName);
      this.providerInfoForm.controls.providerNameEnglishControl.setValue(this.providerInf.providerEnglishNameNphies!=null?this.providerInf.providerEnglishNameNphies:this.providerInf.providerEnglishName);
      this.providerInfoForm.controls.providerNphiesIdControl.setValue(this.providerInf.nphies_ID!=null?this.providerInf.nphies_ID:'');
      this.providerInfoForm.controls.certificateTypeControl.setValue(this.providerInf.waseelAssociatedProvider!=null?this.providerInf.waseelAssociatedProvider:'');



    } else {
      const providerId = this.providerInfoForm.controls.providerController.value.split('|')[0].trim();
      this.selectedProvider = providerId;
    }
  }

  get isLoading() {
    return this.commen.loading;
  }
}
