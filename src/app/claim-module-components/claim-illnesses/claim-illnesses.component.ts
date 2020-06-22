import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getIllnessCode } from '../store/claim.reducer';
import { MatButtonToggleChange } from '@angular/material';
import { updateIllnesses } from '../store/claim.actions';

@Component({
  selector: 'claim-illnesses',
  templateUrl: './claim-illnesses.component.html',
  styleUrls: ['./claim-illnesses.component.css']
})
export class ClaimIllnessesComponent implements OnInit {

  illnessOptionsList:string[] = [];

  selectedIllnesses:string[] = ['NA'];

  constructor(private store: Store) { }

  ngOnInit() {
    this.store.select(getIllnessCode).subscribe(codes => this.illnessOptionsList = codes.filter(code => code != 'NA'));
    this.store.dispatch(updateIllnesses({list:this.selectedIllnesses}));
  }

  beautfyCode(code:string){
    return code.replace('_', ' ').replace('_', ' ');
  }

  updateIllnesses(event:MatButtonToggleChange){
    if(event.value == 'NA' && event.source.checked){
      this.selectedIllnesses = ['NA'];
    } else {
      this.selectedIllnesses = this.selectedIllnesses.filter(code => code != 'NA');
      this.selectedIllnesses.push(event.value);
    }
    this.store.dispatch(updateIllnesses({list:this.selectedIllnesses}));
  }
}
