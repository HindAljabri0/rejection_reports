import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import { SelectServiceDialogData } from './select-service-dialog-data';
import { Service } from '../../models/service.model';
import { getRetrievedServices } from '../../store/claim.reducer';
import { ServiceDecision } from '../../models/serviceDecision.model';
import { addRetrievedServices } from '../../store/claim.actions';

@Component({
  selector: 'app-select-service-dialog',
  templateUrl: './select-service-dialog.component.html',
  styleUrls: ['./select-service-dialog.component.css']
})
export class SelectServiceDialogComponent implements OnInit {

  isSelectingOne:boolean;

  retrievedServices:{service:Service, decision:ServiceDecision, used:boolean}[] = [];

  selectedServices: number [] = [];

  constructor(
    private dialogRef: MatDialogRef<SelectServiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:SelectServiceDialogData,
    private store:Store
  ) { }

  ngOnInit() {
    this.isSelectingOne = this.data.serviceIndex != -1;

    this.store.select(getRetrievedServices).subscribe(services => this.retrievedServices = services);
  }

  selectAll(checked:boolean){
    if(checked){
      this.selectedServices = this.retrievedServices.map((s, i) => i);
    } else {
      this.selectedServices = [];
    }
  }

  onServiceCLicked(index:number){
    if(!this.isSelectingOne){
      if(this.selectedServices.includes(index)){
        this.selectedServices = this.selectedServices.filter(i => i != index);
      } else {
        this.selectedServices.push(index);
      }
    } else {
      this.store.dispatch(addRetrievedServices({
        invoiceIndex: this.data.invoiceIndex,
        serviceIndex: this.data.serviceIndex,
        services: [this.retrievedServices[index]]
      }));
      this.dialogRef.close();
    }
  }

  onAddClicked(){
    if(this.selectedServices.length != 0){
      this.store.dispatch(addRetrievedServices({
        invoiceIndex: this.data.invoiceIndex,
        services: [...this.retrievedServices.filter((s, i) => this.selectedServices.includes(i))]
      }));
      this.dialogRef.close();
    }
  }

  onCancelClicked(){
    this.dialogRef.close();
  }

  isChecked(i:number){
    return this.selectedServices.includes(i);
  }
}
