import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { getIllnessCode, getClaim, getPageMode, ClaimPageMode, FieldError, getIllnessErrors } from '../store/claim.reducer';
import { MatButtonToggle, MatButtonToggleChange } from '@angular/material';
import { addClaimErrors, updateIllnesses } from '../store/claim.actions';
import { map, withLatestFrom } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Claim } from '../models/claim.model';

@Component({
  selector: 'claim-illnesses',
  templateUrl: './claim-illnesses.component.html',
  styles: []
})
export class ClaimIllnessesComponent implements OnInit, OnDestroy {

  enableEdit = true;

  illnessOptionsList: string[] = [];

  selectedIllnesses: string[] = ['NA'];

  subscriptions: Subscription[] = [];

  pageMode: ClaimPageMode;

  errors: FieldError[];

  constructor(private store: Store) { }

  ngOnInit() {
    this.store.select(getPageMode).pipe(
      withLatestFrom(this.store.select(getClaim)),
      map(values => ({ mode: values[0], claim: values[1] }))
    ).subscribe(({ mode, claim }) => {
      this.pageMode = mode;
      if (mode == 'VIEW') {
        this.setData(claim);
        this.toggleEdit(false);
      } else if (mode == 'EDIT') {
        this.setData(claim);
        this.toggleEdit(true);
      } else if (mode == 'CREATE_FROM_RETRIEVED') {
        this.setData(claim);
        this.toggleEdit(false, claim.caseInformation.caseDescription.illnessCategory == null);
      } else {
        this.store.dispatch(updateIllnesses({ list: this.selectedIllnesses }));
      }
    });
    this.subscriptions.push(this.store.select(getIllnessCode).subscribe(codes =>
      this.illnessOptionsList = codes.filter(code => code != 'NA')
    ));
    this.store.select(getIllnessErrors).subscribe(errors => this.errors = errors);
  }

  setData(claim: Claim) {
    if (claim.caseInformation.caseDescription.illnessCategory != null) {
      this.selectedIllnesses = claim.caseInformation.caseDescription.illnessCategory.inllnessCode;
    } else {
      this.selectedIllnesses = ['NA'];
    }
    if (this.selectedIllnesses.length == 0) {
      this.selectedIllnesses = ['NA'];
    }
  }
  toggleEdit(allowEdit: boolean, enableForNulls?: boolean) {
    this.enableEdit = allowEdit || (enableForNulls || false);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  beautifyCode(code: string) {
    if (code == 'NA') { return 'N/A'; }
    let str = code.substr(0, 1) + code.substr(1).toLowerCase();
    if (str.includes('_')) {
      const split = str.split('_');
      str = split[0] + ' ' + this.beautifyCode(split[1].toUpperCase());
    }
    return str;
  }

  updateIllnesses(event: MatButtonToggleChange | { source: { checked: boolean }, value: string }) {
    if (event.value == 'NA' && event.source.checked) {
      this.selectedIllnesses = ['NA'];
    } else if (event.source.checked) {
      this.selectedIllnesses = this.selectedIllnesses.filter(code => code != 'NA');
      if (!this.selectedIllnesses.includes(event.value)) {
        this.selectedIllnesses.push(event.value);
      }
    } else {
      this.selectedIllnesses = this.selectedIllnesses.filter(code => code != event.value);
    }
    if (this.selectedIllnesses.length == 0) {
      event.source.checked = true;
      this.selectedIllnesses = ['NA'];
    }
    this.store.dispatch(updateIllnesses({ list: this.selectedIllnesses }));
  }

  getWrongCodes() {
    return this.selectedIllnesses.filter(code => !this.illnessOptionsList.includes(code) && code != 'NA').join(',');
  }

  clearErrors() {
    this.updateIllnesses({ source: { checked: true }, value: 'NA' })
  }
}

