import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ofType } from '@ngrx/effects';
import { SuperAdminService } from 'src/app/services/administration/superAdminService/super-admin.service';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { ProviderNphiesApprovalService } from 'src/app/services/providerNphiesApprovalService/provider-nphies-approval.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-cancel-previous-claim',
  templateUrl: './cancel-previous-claim.component.html',

})
export class CancelPreviousClaimComponent implements OnInit {
  submitted = false;
  providerCHHI = '';
  providerCode='';
  providers: any[] = [];
  filteredProviders: any[] = [];
  selectedProvider: string;
  providerLoader = false;
  selectedPayer: string;
  selectedDestination: string;
  selectedPayerError: string;
  claimIdentifierUrl:string


  CancellClaimForm: FormGroup;

  constructor(private sharedServices: SharedServices, private superAdmin: SuperAdminService, private formBuilder: FormBuilder, 
    private providerNphiesApprovalService: ProviderNphiesApprovalService,   private dialogService: DialogService,) { }

  ngOnInit() {



    this.getProviders();

    this.CancellClaimForm = this.formBuilder.group({
      providerId: ['', Validators.required],
      claimIdentifier: ['', Validators.required],
      claimIdentifierUrl:null
    });

  }

  getProviders() {
    this.sharedServices.loadingChanged.next(true);
    this.providerLoader = true;
    this.superAdmin.getProvidersWithCHHI_ID().subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body instanceof Array) {
          this.providers = event.body;
          this.filteredProviders = this.providers;
          this.sharedServices.loadingChanged.next(false);
          this.providerLoader = false;

        }

        //  console.log(  this.filteredProviders.length);
      }
    }, error => {
      this.sharedServices.loadingChanged.next(false);
      this.providerLoader = false;
      console.log(error);
    });
  }
  updateFilter() {

    // tslint:disable-next-line:max-line-length
    this.filteredProviders = this.providers.filter(provider => `${provider.providerId} | ${provider.providerCode} | ${provider.providerEnglishName} | ${provider.cchi_ID}`.toLowerCase().includes(this.CancellClaimForm.controls.providerId.value.toLowerCase())
    );
  }
  selectProvider(providerId: string = null, cchi_ID: string = null ,providerCode:string=null ) {
    if (providerId !== null) {
      this.selectedProvider = providerId;
      this.providerCHHI = cchi_ID;
      this.providerCode=providerCode;
    } else {
      // tslint:disable-next-line:no-shadowed-variable
      const providerId = this.CancellClaimForm.controls.providerId.value.split('|')[0].trim();
      this.providerCHHI = this.CancellClaimForm.controls.providerId.value.split('|')[3].trim();
      this.selectedProvider = providerId;
      this.providerCode=providerCode;

      console.log(this.providerCHHI);
    }
  }

  get isLoading() {
    return this.sharedServices.loading;
  }
  cancellClaim() {
    console.log(this.providerCHHI)
    this.submitted = true
    if (this.CancellClaimForm.valid && this.selectedPayer != null) {
      this.sharedServices.loadingChanged.next(true);
     
    this.providerLoader = true;
      const body = {

        "claimIdentifier": this.CancellClaimForm.controls.claimIdentifier.value,
        "payerNphiesId": this.selectedDestination,
        "memberId": "10073343178",
        "destinationId": this.selectedDestination,
        "cancelReason": "TAS",
        "claimIdentifierUrl": this.CancellClaimForm.controls.claimIdentifierUrl.value,
        "providerCHHI": this.providerCHHI ,
        "providerCode": this.providerCode 

      }

   
      this.providerNphiesApprovalService.cancelPreviousClaim(this.selectedProvider, body).subscribe((event) => {

        if (event instanceof HttpResponse) {
          this.sharedServices.loadingChanged.next(false);
         // this.providerLoader = false;
         console.log(event.body['message'])
          this.dialogService.showMessage('Success', event.body['message'] , 'success', true, 'OK');
       

        }

      },error=>{
        this.sharedServices.loadingChanged.next(false);
     //  this.providerLoader = false;
     console.log(  error)
        this.dialogService.showMessage('Error', error.error['errors'][0], 'alert', true, 'OK');
      

      });
      //   console.log(  this.CancellClaimForm.controls.claimIdentifier.value)
      // console.log( this.selectedPayer +"NPHIES ID")
      // console.log( this.selectedDestination +"TPA")
    }

  }

  selectPayer(event) {
    this.selectedPayer = event.value.payerNphiesId;
    this.selectedDestination = event.value.organizationNphiesId != '-1' ? event.value.organizationNphiesId : event.value.payerNphiesId;
  }
}
