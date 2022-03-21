import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent, NavigationEnd, ActivatedRoute } from '@angular/router';
import { SharedServices } from 'src/app/services/shared.services';
import { FormControl } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/services/authService/authService.service';
import { Moment } from 'moment';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Payer } from 'src/app/models/nphies/payer';



@Component({
  selector: 'app-search-with-advance',
  templateUrl: './search-with-advance.component.html',
  styles: []
})
export class SearchWithAdvanceComponent implements OnInit {

  searchModesWassel: { key: string, label: string }[] = [
    { key: 'claimRefNo', label: 'Provider Claim Ref. No.' },
    { key: 'memberId', label: 'Member ID' },
    { key: 'payer&date', label: 'Payer' },
    { key: 'tpa&date', label: 'TPA' },
    { key: 'batchId', label: 'Batch ID' },
    { key: 'invoiceNo', label: 'Invoice No.' },
    { key: 'patientFileNo', label: 'Patient File No' },
    { key: 'policyNo', label: 'Policy No.' },
    { key: 'nationalId', label: 'National ID' }
  ];

  searchModesNphies: { key: string, label: string }[] = [
    { key: 'claimRefNo', label: 'Provider Claim Ref. No.' },
    { key: 'memberId', label: 'Member ID' },
    { key: 'payer&date', label: 'Payer' },
    { key: 'batchId', label: 'Batch ID' },
    { key: 'invoiceNo', label: 'Invoice No.' },
    { key: 'patientFileNo', label: 'Patient File No' },
    { key: 'nationalId', label: 'National ID' }
  ];
  selectedSearchMode = 'claimRefNo';



  payers: { id: number, name: string }[]=[];
  nphiesPayers: { id: number, name: string }[]=[];

  tpas: { id: number, name: string }[]=[];

  casetypes: { value: string, name: string }[] = [
    { value: 'OUTPATIENT,INPATIENT', name: 'Any' },
    { value: 'OUTPATIENT', name: 'Outpatient' },
    { value: 'INPATIENT', name: 'Inpatient' },
  ];
  


  searchMode(isWassel: boolean) {
    if (isWassel) {
      return this.searchModesWassel;
    } else {
      return this.searchModesNphies;
    }

  }
  searchControl: FormControl = new FormControl();

  selectedPayer: { id: number, name: string };
  selectedTpa: { id: number, name: string };
  payerHasError = false;
  tpaHasError = false;
  fromDateControl: FormControl = new FormControl();
  fromDateHasError = false;
  toDateControl: FormControl = new FormControl();
  toDateHasError = false;

  payersList: Payer[] = [];

  selectedPayerType = '';

  constructor(
    private router: Router,
    private routeActive: ActivatedRoute,
    private commen: SharedServices,
    private providersBeneficiariesService: ProvidersBeneficiariesService,
    private searchService: ProviderNphiesSearchService,
    private authService: AuthService) {
    this.authService.isUserNameUpdated.subscribe((isUpdated) => {
      if (isUpdated) {
        this.payers = this.commen.getPayersList();
      }
    });
  }

  ngOnInit() {
    this.getPayers();
    this.payers = this.commen.getPayersList();
    this.tpas = this.commen.getTPAsList();
    this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd)
    ).subscribe(() => {

    });
  }

  get isClaimUser() {
    return this.commen.userPrivileges.ProviderPrivileges.WASEEL_CLAIMS.isClaimUser || this.commen.userPrivileges.ProviderPrivileges.WASEEL_CLAIMS.isAdmin;
  }

  get hasNphiesClaims() {
    return this.commen.userPrivileges.ProviderPrivileges.NPHIES.isAdmin || this.commen.userPrivileges.ProviderPrivileges.NPHIES.canAccessClaim;
  }

  get selectedCriteriaIsUsedInBoth() {
    return ['claimRefNo', 'memberId', 'payer&date', 'batchId', 'invoiceNo', 'patientFileNo', 'nationalId'].includes(this.selectedSearchMode);
  }

  dateToText(date: Moment) {
    if (date != null) {
      return date.format('DD/MM/yyyy');
    }
    return null;
  }

  onSearchModeChange(e) {
    this.selectedSearchMode = e.value;
    this.searchControl.setValue('');
  }


  search(isWassel: boolean) {

    if (this.selectedSearchMode == 'payer&date' || this.selectedSearchMode == 'tpa&date') {
      if (this.selectedSearchMode == 'payer&date' && this.selectedPayer == null) {
        this.payerHasError = true;
        return;
      }
      if (this.selectedSearchMode == 'tpa&date' && this.selectedTpa == null) {
        this.tpaHasError = true;
        return;
      }
      this.payerHasError = false;
      if (this.fromDateControl.value == null) {
        this.fromDateHasError = true;
        return;
      }
      this.fromDateHasError = false;
      if (this.toDateControl.value == null) {
        this.toDateHasError = true;
        return;
      }
      this.toDateHasError = false;
      let routes = [this.commen.providerId, 'claims'];
      if (!isWassel) {
        routes.push('nphies-search-claim')
      }
      this.router.navigate(routes, {
        queryParams: {
          payerId: this.selectedSearchMode == 'tpa&date' ? null : this.selectedPayer.id,
          organizationId: this.selectedSearchMode == 'payer&date' ? null : this.selectedTpa.id,
          from: this.fromDateControl.value.format('DD-MM-yyyy'),
          to: this.toDateControl.value.format('DD-MM-yyyy'),
        },
        fragment: 'reload'
      });
    } else {

      if (this.searchControl.value == null || this.searchControl.value.trim().length == 0) {
        return;
      }
      let routes = [this.commen.providerId, 'claims'];
      if (!isWassel) {
        routes.push('nphies-search-claim')
      }
      this.router.navigate(routes, {
        queryParams: {
          claimRefNo: this.selectedSearchMode == 'claimRefNo' ? this.searchControl.value : null,
          memberId: this.selectedSearchMode == 'memberId' ? this.searchControl.value : null,
          batchId: this.selectedSearchMode == 'batchId' ? this.searchControl.value : null,
          invoiceNo: this.selectedSearchMode == 'invoiceNo' ? this.searchControl.value : null,
          patientFileNo: this.selectedSearchMode == 'patientFileNo' ? this.searchControl.value : null,
          policyNo: this.selectedSearchMode == 'policyNo' ? this.searchControl.value : null,
          nationalId: this.selectedSearchMode == 'nationalId' ? this.searchControl.value : null,
        },
        fragment: 'reload'
      });


    }
  }




  toggleSearch() {
    document.body.classList.toggle('search-visible');
  }

  getPayers() {
    this.providersBeneficiariesService.getPayers().subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body != null && event.body instanceof Array) {
          this.payersList = event.body as Payer[];
          this.nphiesPayers = this.payersList.map(x => {
            const model: any = {};
            model.id = x.nphiesId;
            model.name = x.englistName;
            return model;
          });
        }
      }
    }, err => {
      if (err instanceof HttpErrorResponse) {
        console.log(err.message);
      }
    });
  }

}
