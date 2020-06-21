import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SharedServices } from 'src/app/services/shared.services';
import { Store } from '@ngrx/store';
import { updatePhysicianId, updatePhysicianName } from '../store/claim.actions';

@Component({
  selector: 'claim-physician-header',
  templateUrl: './physician.component.html',
  styleUrls: ['./physician.component.css']
})
export class PhysicianComponent implements OnInit {
  
  physicianNameController: FormControl = new FormControl();
  physicianIdController: FormControl = new FormControl();

  payersList: { id: number, name: string, arName: string }[];


  constructor(private sharedServices: SharedServices,private store:Store) { }

  ngOnInit() {
    this.payersList = this.sharedServices.getPayersList();
  }

  updateClaim(field: string) {
    switch (field) {
      case 'physicianId':
        this.store.dispatch(updatePhysicianId({ physicianId: this.physicianIdController.value }));
        break;
      case ' physicianName':
        this.store.dispatch(updatePhysicianName({ physicianName: this.physicianNameController.value }));
        break;
    }
  }

}
