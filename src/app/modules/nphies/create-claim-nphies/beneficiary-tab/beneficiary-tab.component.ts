import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { nationalities } from 'src/app/claim-module-components/store/claim.reducer';
import { Payer } from 'src/app/models/nphies/payer';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BeneficiariesSearchResult } from 'src/app/models/nphies/beneficiaryFullTextSearchResult';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
    selector: 'app-beneficiary-tab',
    templateUrl: './beneficiary-tab.component.html',
    styles: []
})
export class BeneficiaryTabComponent implements OnInit {

    @Input() pageMode: string;
    @Input() isSubmitted = false;
    @Input() FormNphiesClaim: FormGroup;
    @Input() selectedBeneficiary: BeneficiariesSearchResult;
    @Output() emitSelectedBenificiary = new EventEmitter();

    beneficiariesSearchResult: BeneficiariesSearchResult[] = [];
    selectedPlanId: string;
    selectedPlanIdError: string;

    filteredNations: ReplaySubject<{ Code: string, Name: string }[]> = new ReplaySubject<{ Code: string, Name: string }[]>(1);
    filteredCountry: ReplaySubject<{ Code: string, Name: string }[]> = new ReplaySubject<{ Code: string, Name: string }[]>(1);
    allMaritalStatuses: ReplaySubject<{ Code: string, Name: string }[]> = new ReplaySubject<{ Code: string, Name: string }[]>(1);
    allBloodType: ReplaySubject<{ Code: string, Name: string }[]> = new ReplaySubject<{ Code: string, Name: string }[]>(1);
    allSubscriberRelationship: ReplaySubject<{ Code: string, Name: string }[]> = new ReplaySubject<{ Code: string, Name: string }[]>(1);

    selectedNationality = '';
    selectedCountry = '';
    nationalities = nationalities;
    insurancePlans = [];

    payersList: Payer[] = [];
    subscriberRelationship: { Code: string, Name: string }[] = [
        { Code: 'CHILD', Name: 'Child' },
        { Code: 'PARENT', Name: 'Parent' },
        { Code: 'SPOUSE', Name: 'Spouse' },
        { Code: 'COMMON', Name: 'Common Law Spouse' },
        { Code: 'SELF', Name: 'Self' },
        { Code: 'INJURED', Name: 'Injured Party' },
        { Code: 'OTHER', Name: 'Other' },
    ];

    maritalStatuses: { Code: string, Name: string }[] = [
        { Code: 'A', Name: 'Annulled' },
        { Code: 'D', Name: 'Divorced' },
        { Code: 'I', Name: 'Interlocutory' },
        { Code: 'L', Name: 'Legally Separated' },
        { Code: 'M', Name: 'Married' },
        { Code: 'P', Name: 'Polygamous' },
        { Code: 'S', Name: 'Never Married' },
        { Code: 'T', Name: 'Domestic partner' },
        { Code: 'U', Name: 'unmarried' },
        { Code: 'W', Name: 'Widowed' }];

    bloodGroup: { Code: string, Name: string }[] = [
        { Code: 'O_PLUS', Name: 'O+' },
        { Code: 'O_MINUS', Name: 'O-' },
        { Code: 'A_PLUS', Name: 'A+' },
        { Code: 'A_MINUS', Name: 'A-' },
        { Code: 'B_PLUS', Name: 'B+' },
        { Code: 'B_MINUS', Name: 'B-' },
        { Code: 'AB_PLUS', Name: 'AB+' },
        { Code: 'AB_MINUS', Name: 'AB-' },
    ];

    constructor(
        private formBuilder: FormBuilder,
        private providersBeneficiariesService: ProvidersBeneficiariesService,
        private providerNphiesSearchService: ProviderNphiesSearchService,
        private sharedServices: SharedServices) { }

    ngOnInit() {
        this.filteredNations.next(this.nationalities.slice());
        this.filteredCountry.next(this.nationalities.slice());
        this.allMaritalStatuses.next(this.maritalStatuses.slice());
        this.allBloodType.next(this.bloodGroup);
        this.allSubscriberRelationship.next(this.subscriberRelationship);
        this.getPayers();
    }

    getPayers() {
        this.providersBeneficiariesService.getPayers().subscribe(event => {
            if (event instanceof HttpResponse) {
                if (event.body != null && event.body instanceof Array) {
                    this.payersList = event.body as Payer[];
                }
            }
        }, err => {
            if (err instanceof HttpErrorResponse) {
                console.log(err.message);
            }
        });
    }

    searchBeneficiaries() {
        // tslint:disable-next-line:max-line-length
        this.providerNphiesSearchService.beneficiaryFullTextSearch(this.sharedServices.providerId, this.FormNphiesClaim.controls.beneficiaryName.value).subscribe(event => {
            if (event instanceof HttpResponse) {
                const body = event.body;
                if (body instanceof Array) {
                    this.beneficiariesSearchResult = body;
                }
            }
        }, errorEvent => {
            if (errorEvent instanceof HttpErrorResponse) {

            }
        });
    }

    selectBeneficiary(beneficiary: BeneficiariesSearchResult) {
        this.selectedBeneficiary = beneficiary;
        this.FormNphiesClaim.patchValue({
            beneficiaryName: beneficiary.name + ' (' + beneficiary.documentId + ')',
            beneficiaryId: beneficiary.id
        });
        this.emitSelectedBenificiary.emit(this.selectedBeneficiary);
    }

    isPlanExpired(date: Date) {
        if (date != null) {
            if (!(date instanceof Date)) {
                date = new Date(date);
            }
            return date.getTime() > Date.now() ? ' (Active)' : ' (Expired)';
        }
        return '';
    }

    selectPlan(plan) {
        this.insurancePlans = [];
        if (this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value)[0]) {
            this.insurancePlans.push(this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value)[0]);
            this.FormNphiesClaim.controls.insurancePlanPayerId.setValue(
                parseInt(this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value)[0].payerId, 10));
            this.FormNphiesClaim.controls.insurancePlanExpiryDate.setValue(
                this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value)[0].expiryDate);
            this.FormNphiesClaim.controls.insurancePlanMemberCardId.setValue(
                this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value)[0].memberCardId);
            this.FormNphiesClaim.controls.insurancePlanRelationWithSubscriber.setValue(
                this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value)[0].relationWithSubscriber);
            this.FormNphiesClaim.controls.insurancePlanCoverageType.setValue(
                this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value)[0].coverageType);
            this.FormNphiesClaim.controls.insurancePlanPayerId.disable();
        }
    }

    filterNationality() {
        if (!this.nationalities) {
            return;
        }
        let search = this.FormNphiesClaim.controls.nationality.value;
        if (!search) {
            this.filteredNations.next(this.nationalities.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        this.filteredNations.next(
            this.nationalities.filter(nation => nation.Name.toLowerCase().indexOf(search) > -1)
        );
    }

    filterCountry() {
        if (!this.nationalities) {
            return;
        }
        let search = this.FormNphiesClaim.controls.nationality.value;
        if (!search) {
            this.filteredCountry.next(this.nationalities.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        this.filteredCountry.next(
            this.nationalities.filter(nation => nation.Name.toLowerCase().indexOf(search) > -1)
        );
    }

    getPayerName(PayerId: string) {
        for (const payer of this.payersList) {
            if (payer.payerId == PayerId) {
                return payer.englistName;
            }
        }

    }

    selectedPayer(payerId: string) {
        for (const payer of this.payersList) {
            if (payer.payerId == payerId) {
                return payer.englistName + '(' + payer.arabicName + ')';
            }
        }
    }

}
