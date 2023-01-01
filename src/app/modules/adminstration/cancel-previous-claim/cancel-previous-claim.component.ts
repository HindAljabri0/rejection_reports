import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SuperAdminService } from 'src/app/services/administration/superAdminService/super-admin.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-cancel-previous-claim',
  templateUrl: './cancel-previous-claim.component.html',
 
})
export class CancelPreviousClaimComponent implements OnInit {
  submitted = false;
  providers: any[] = [];
  filteredProviders: any[] = [];
  selectedProvider: string;
  providerLoader = false;
  selectedPayer: string;
  selectedDestination: string;
  selectedPayerError: string;
  

  CancellClaimForm: FormGroup;

  constructor(  private sharedServices: SharedServices, private superAdmin: SuperAdminService,  private formBuilder: FormBuilder,) { }

  ngOnInit() {
    

    this.CancellClaimForm = this.formBuilder.group({
        providerId: ['', Validators.required],
        claimIdentifier: ['', Validators.required]
    });
   
    this.getProviders();

    
  }

  getProviders() {
    this.sharedServices.loadingChanged.next(true);
    this.providerLoader = true;
    this.superAdmin.getProviders().subscribe(event => {
        if (event instanceof HttpResponse) {
            if (event.body instanceof Array) {
                this.providers = event.body;
                this.filteredProviders = this.providers;
                this.sharedServices.loadingChanged.next(false);
                this.providerLoader = false;
            }
        }
    }, error => {
        this.sharedServices.loadingChanged.next(false);
        this.providerLoader = false;
        console.log(error);
    });
}
updateFilter() {
  // tslint:disable-next-line:max-line-length
  this.filteredProviders = this.providers.filter(provider => `${provider.switchAccountId} | ${provider.code} | ${provider.name}`.toLowerCase().includes(this.CancellClaimForm.controls.providerId.value.toLowerCase())
  );}
selectProvider(providerId: string = null) {
  if (providerId !== null) {
      this.selectedProvider = providerId;
  } else {
      // tslint:disable-next-line:no-shadowed-variable
      const providerId = this.CancellClaimForm.controls.providerId.value.split('|')[0].trim();
      this.selectedProvider = providerId;
  }}
  
  get isLoading() {
    return this.sharedServices.loading;
}
cancellClaim(){
  this.submitted=true
  if(this.CancellClaimForm.valid && this.selectedPayer!=null){
  console.log( this.selectedPayer +"NPHIES ID")
  console.log( this.selectedDestination +"TPA")}

}

selectPayer(event) {
  this.selectedPayer = event.value.payerNphiesId;
  this.selectedDestination = event.value.organizationNphiesId != '-1' ? event.value.organizationNphiesId : event.value.payerNphiesId;
}
}
