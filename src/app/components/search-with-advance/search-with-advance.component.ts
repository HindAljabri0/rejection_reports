import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent, NavigationEnd, ActivatedRoute } from '@angular/router';
import { SharedServices } from 'src/app/services/shared.services';
import { FormControl } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/services/authService/authService.service';
import { Moment } from 'moment';

@Component({
  selector: 'app-search-with-advance',
  templateUrl: './search-with-advance.component.html',
  styles: []
})
export class SearchWithAdvanceComponent implements OnInit {

  searchModes: { key: string, label: string }[] = [
    { key: 'claimRefNo', label: 'Provider Claim Ref. No.' },
    { key: 'memberId', label: 'Member ID' },
    { key: 'payer&date', label: 'Payer' },
    { key: 'tpa&date', label: 'TPA' },
    { key: 'batchId', label: 'Batch ID' },
    { key: 'invoiceNo', label: 'Invoice No.' },
    { key: 'patientFileNo', label: 'Patient File No' },
    { key: 'policyNo', label: 'Policy No.' }
  ];
  selectedSearchMode = 'claimRefNo';



  payers: { id: number, name: string }[];
  tpas: { id: number, name: string }[];

  casetypes: { value: string, name: string }[] = [
    { value: 'OUTPATIENT,INPATIENT', name: 'Any' },
    { value: 'OUTPATIENT', name: 'Outpatient' },
    { value: 'INPATIENT', name: 'Inpatient' },
  ];

  searchControl: FormControl = new FormControl();

  selectedPayer: { id: number, name: string };
  selectedTpa: { id: number, name: string };
  payerHasError = false;
  tpaHasError = false;
  fromDateControl: FormControl = new FormControl();
  fromDateHasError = false;
  toDateControl: FormControl = new FormControl();
  toDateHasError = false;


  constructor(
    private router: Router,
    private routeActive: ActivatedRoute,
    private commen: SharedServices,
    private authService: AuthService) {
    this.authService.isUserNameUpdated.subscribe((isUpdated) => {
      if (isUpdated) {
        this.payers = this.commen.getPayersList();
      }
    });
  }

  ngOnInit() {
    this.payers = this.commen.getPayersList();
    this.tpas = this.commen.getTPAsList();
    this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd)
    ).subscribe(() => {

    });
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


  search() {
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
      this.router.navigate([this.commen.providerId, 'claims'], {
        queryParams: {
          payerId: this.selectedPayer == null? null : this.selectedPayer.id,
          organizationId: this.selectedTpa == null? null : this.selectedTpa.id,
          from: this.fromDateControl.value.format('DD-MM-yyyy'),
          to: this.toDateControl.value.format('DD-MM-yyyy'),
        },
        fragment: 'reload'
      });
    } else {
      if (this.searchControl.value == null || this.searchControl.value.trim().length == 0) {
        return;
      }
      this.router.navigate([this.commen.providerId, 'claims'], {
        queryParams: {
          claimRefNo: this.selectedSearchMode == 'claimRefNo' ? this.searchControl.value : null,
          memberId: this.selectedSearchMode == 'memberId' ? this.searchControl.value : null,
          batchId: this.selectedSearchMode == 'batchId' ? this.searchControl.value : null,
          invoiceNo: this.selectedSearchMode == 'invoiceNo' ? this.searchControl.value : null,
          patientFileNo: this.selectedSearchMode == 'patientFileNo' ? this.searchControl.value : null,
          policyNo: this.selectedSearchMode == 'policyNo' ? this.searchControl.value : null,
        },
        fragment: 'reload'
      });

    }
  }

  toggleSearch() {
    document.body.classList.toggle('search-visible');
  }

}
