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
    providerCode = '';
    providers: any[] = [];
    filteredProviders: any[] = [];
    selectedProvider: string;
    providerLoader = false;
    selectedPayer: string;
    selectedDestination: string;
    selectedPayerError: string;
    claimIdentifierUrl: string;
    JsonRequest: string;
    JsonResponse: string;
    requestDate: any;
    responsDate: any;

    cancelResponse: any = [];
    listOfRequestBundleIds = [];
    listClaimIdentifierIds = []
    carrentProviderId=null;




    CancellClaimForm: FormGroup;

    constructor(private sharedServices: SharedServices, private superAdmin: SuperAdminService, private formBuilder: FormBuilder,
        private providerNphiesApprovalService: ProviderNphiesApprovalService, private dialogService: DialogService,) { }

    ngOnInit() {


        this.carrentProviderId=this.sharedServices.providerId;
        this.getProviders();

        this.CancellClaimForm = this.formBuilder.group({
           
            providerId: [""],
            //!this.getPrivileges().ProviderPrivileges.NPHIES.isAdmin && this.sharedServices.providerId!='101'?[""]:['', Validators.required],
            claimIdentifier: null,
            requestBundleId: null,
            claimIdentifierUrl: null,
            cancelBy: false
        });

    }
    isValidBundleIdAndClaimsIdentifierFiled() {
        if (this.isCancellByBundleIds && (this.CancellClaimForm.controls.requestBundleId.value == null ||
            this.CancellClaimForm.controls.requestBundleId.value.trim() == "")) {
            return false;
        } else {
            this.listOfRequestBundleIds = this.CancellClaimForm.controls.requestBundleId.value != null ? this.CancellClaimForm.controls.requestBundleId.value.split(',').filter(bundle => bundle != "") : [];
        }
        if (!this.isCancellByBundleIds && (this.CancellClaimForm.controls.claimIdentifier.value == null ||
            this.CancellClaimForm.controls.claimIdentifier.value.trim() == "")) {
            return false;
        } else {
            this.listClaimIdentifierIds = this.CancellClaimForm.controls.claimIdentifier.value != null ? this.CancellClaimForm.controls.claimIdentifier.value.split(',').filter(claim => claim != "") : [];

        }

        return true
    }

    getPrivileges(){
      
        return this.sharedServices.getPrivileges();
    }

    isValidNumberListBundleIdAndClaimsIdentifier() {
        if (this.isCancellByBundleIds && this.CancellClaimForm.controls.requestBundleId.value != null &&
            this.CancellClaimForm.controls.requestBundleId.value.split(',').length > 500) {
            this.dialogService.showMessage('Error', "Number List of Bundle IDs should be less then 500", 'alert',
                true, 'OK');
            return false

        }

        if (!this.isCancellByBundleIds && this.CancellClaimForm.controls.claimIdentifier.value != null &&
            this.CancellClaimForm.controls.claimIdentifier.value.split(',').length > 500) {
            this.dialogService.showMessage('Error', "Number List of Claim Identifier IDs should be less then 500",
                'alert',
                true, 'OK');

            return false

        }
        return true;



    }
    get isCancellByBundleIds() {
        return this.CancellClaimForm.controls.cancelBy.value;


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
    selectProvider(providerId: string = null, cchi_ID: string = null, providerCode: string = null) {
        if (providerId !== null) {
            this.selectedProvider = providerId;
            this.providerCHHI = cchi_ID;
            this.providerCode = providerCode;
        } else {
            // tslint:disable-next-line:no-shadowed-variable
            const providerId = this.CancellClaimForm.controls.providerId.value.split('|')[0].trim();
            this.providerCHHI = this.CancellClaimForm.controls.providerId.value.split('|')[3].trim();
            this.selectedProvider = providerId;
            this.providerCode = providerCode;

            console.log(this.providerCHHI);
        }
    }

    get isLoading() {
        return this.sharedServices.loading;
    }

    changeColor(message) {

        return message.includes('Failed') ? { 'color': 'red' } : { 'color': '#00ff00' };
    }
    cancellClaim() {

       // if(!this.getPrivileges().ProviderPrivileges.NPHIES.isAdmin && this.sharedServices.providerId!='101'){

           const provider = this.filteredProviders.filter(provider=>provider.providerId==this.sharedServices.providerId);
           this.selectProvider(provider[0].providerId , provider[0].cchi_ID, provider[0].providerCode);

      //  }
        console.log(this.providerCHHI)
        this.submitted = true
        if (this.CancellClaimForm.valid && this.selectedPayer != null && this.isValidBundleIdAndClaimsIdentifierFiled() && this.isValidNumberListBundleIdAndClaimsIdentifier()) {
            this.JsonRequest = null;
            this.JsonResponse = null;

            this.sharedServices.loadingChanged.next(true);

            this.providerLoader = true;
            const body = {

                "claimIdentifier": !this.isCancellByBundleIds ? this.listClaimIdentifierIds : null,
                "bundleId": this.isCancellByBundleIds ? this.listOfRequestBundleIds : null,
                "payerNphiesId": this.selectedPayer,
                "memberId": "10073343178",
                "destinationId": this.selectedDestination,
                "cancelReason": "TAS",
                "claimIdentifierUrl": this.CancellClaimForm.controls.claimIdentifierUrl.value,
                "providerCHHI": this.providerCHHI,
                "providerCode": this.providerCode

            }

            this.requestDate = new Date();
            this.providerNphiesApprovalService.cancelPreviousClaim(this.selectedProvider, body).subscribe((event) => {

                if (event instanceof HttpResponse) {
                    this.sharedServices.loadingChanged.next(false);
                    this.responsDate = new Date();
                    this.cancelResponse = event.body['response'] as []
                    let message = 'Number Cancel Completed: ' + event.body['numberCancelCompleted'] + "<br>" + 'Number Cancel Failed: ' + event.body['numberCancelFailed'] + "<br>";
                    event.body['error'].forEach(ero => {
                        message += ero + '<br>'
                    })
                    this.dialogService.showMessage('Success', message, 'success', true, 'OK');

                }

            }, error => {
                this.sharedServices.loadingChanged.next(false);
                //  this.providerLoader = false;
                console.log(error)
                this.dialogService.showMessage('Error', error.error['errors'], 'alert', true, 'OK');


            });
            //   console.log(  this.CancellClaimForm.controls.claimIdentifier.value)
            // console.log( this.selectedPayer +"NPHIES ID")
            // console.log( this.selectedDestination +"TPA")
        }

    }

    selectPayer(event) {
        this.selectedPayer = event.value.payerNphiesId;
        this.selectedDestination = event.value.organizationNphiesId != '-1' ? event.value.organizationNphiesId : event.value.payerNphiesId;
        console.log(this.selectedPayer + "NPHIES ID")
        console.log(this.selectedDestination + "TPA")
    }
}
