import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'claim-patient-info',
  templateUrl: './claim-patient-info.component.html',
  styleUrls: ['./claim-patient-info.component.css']
})
export class ClaimPatientInfo implements OnInit {

  fullNameController: FormControl = new FormControl();

  isMale:boolean = true;

  payersList: { id: number, name: string, arName: string }[];

  constructor(private sharedServices: SharedServices) { }

  ngOnInit() {
    this.payersList = this.sharedServices.getPayersList();
  }

  toggleGender(){
    this.isMale = !this.isMale;
  }

}
