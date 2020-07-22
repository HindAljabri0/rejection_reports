import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { getIllnessCode, getIsRetreivedClaim, getClaim } from '../store/claim.reducer';
import { MatButtonToggleChange } from '@angular/material';
import { updateIllnesses } from '../store/claim.actions';
import { withLatestFrom } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'claim-illnesses',
  templateUrl: './claim-illnesses.component.html',
  styleUrls: ['./claim-illnesses.component.css']
})
export class ClaimIllnessesComponent implements OnInit, OnDestroy {

  isRetreivedClaim: boolean = false;

  illnessOptionsList: string[] = [];

  selectedIllnesses: string[] = ['NA'];

  subscriptions:Subscription[] = [];

  constructor(private store: Store) { }

  ngOnInit() {
    this.store.select(getIsRetreivedClaim).pipe(
      withLatestFrom(this.store.select(getClaim))
    ).subscribe(values => {
      this.isRetreivedClaim = values[0];
      if (this.isRetreivedClaim) {
        this.selectedIllnesses = values[1].caseInformation.caseDescription.illnessCategory.inllnessCode;
      } else {
        this.store.dispatch(updateIllnesses({ list: this.selectedIllnesses }));
      }
      
    }).unsubscribe();
    this.subscriptions.push(this.store.select(getIllnessCode).subscribe(codes => this.illnessOptionsList = codes.filter(code => code != 'NA')));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  beautfyCode(code: string) {
    return code.replace('_', ' ').replace('_', ' ');
  }

  updateIllnesses(event: MatButtonToggleChange) {
    if (event.value == 'NA' && event.source.checked) {
      this.selectedIllnesses = ['NA'];
    } else if (event.source.checked) {
      this.selectedIllnesses = this.selectedIllnesses.filter(code => code != 'NA');
      if (!this.selectedIllnesses.includes(event.value))
        this.selectedIllnesses.push(event.value);
    } else {
      this.selectedIllnesses = this.selectedIllnesses.filter(code => code != event.value);
    }
    if (this.selectedIllnesses.length == 0) {
      event.source.checked = true;
      this.selectedIllnesses = ['NA'];
    }
    this.store.dispatch(updateIllnesses({ list: this.selectedIllnesses }));
  }
}
