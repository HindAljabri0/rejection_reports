import { Component, OnInit, ViewChild } from '@angular/core';
import { Query } from 'src/app/models/searchData/query';
import { QueryType } from 'src/app/models/searchData/queryType';
import { Router, RouterEvent, NavigationEnd, ActivatedRoute } from '@angular/router';
import { SharedServices } from 'src/app/services/shared.services';
import { MatMenuTrigger } from '@angular/material';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/services/authService/authService.service';
import { Moment } from 'moment';

@Component({
  selector: 'app-search-with-advance',
  templateUrl: './search-with-advance.component.html',
  styleUrls: ['./search-with-advance.component.css']
})
export class SearchWithAdvanceComponent implements OnInit {

  searchModes: { key: string, label: string }[] = [
    { key: "claimRefNo", label: "Provider Claim Ref. No." },
    { key: "memberId", label: "Member ID" },
    { key: "payer&date", label: "Payer" },
    { key: "batchId", label: "Batch ID" }
  ]

  selectedSearchMode: string = "claimRefNo";



  payers: { id: number, name: string }[];
  casetypes: { value: string, name: string }[] = [
    { value: "OUTPATIENT,INPATIENT", name: "Any" },
    { value: "OUTPATIENT", name: "Outpatient" },
    { value: "INPATIENT", name: "Inpatient" },
  ];

  searchControl: FormControl = new FormControl();

  selectedPayer: { id: number, name: string };
  payerHasError: boolean = false;
  fromDateControl: FormControl = new FormControl();
  fromDateHasError: boolean = false;
  toDateControl: FormControl = new FormControl();
  toDateHasError: boolean = false;


  constructor(private router: Router, private routeActive: ActivatedRoute, private commen: SharedServices, private authService: AuthService) {
    this.authService.isUserNameUpdated.subscribe((isUpdated) => {
      if (isUpdated) {
        this.payers = this.commen.getPayersList();
      }
    });
  }

  ngOnInit() {
    this.payers = this.commen.getPayersList();
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

  onSearchModeChange() {
    this.searchControl.setValue('');
  }


  search() {
    if (this.selectedSearchMode == 'payer&date') {
      if (this.selectedPayer == null) {
        this.payerHasError = true;
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
          payer: this.selectedPayer.id,
          from: this.fromDateControl.value.format('DD-MM-yyyy'),
          to: this.toDateControl.value.format('DD-MM-yyyy')
        }
      });
    } else {
      if (this.searchControl.value == null || this.searchControl.value.trim().length == 0) {
        return;
      }
      this.router.navigate([this.commen.providerId, 'claims'], {
        queryParams: {
          claimRefNo: this.selectedSearchMode == 'claimRefNo' ? this.searchControl.value : null,
          memberId: this.selectedSearchMode == 'memberId' ? this.searchControl.value : null,
          batchId: this.selectedSearchMode == 'batchId' ? this.searchControl.value : null
        }
      });

    }
  }


}




