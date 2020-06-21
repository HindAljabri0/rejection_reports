import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'claim-physician-header',
  templateUrl: './physician.component.html',
  styleUrls: ['./physician.component.css']
})
export class PhysicianComponent implements OnInit {
  
  physicianNameController: FormControl = new FormControl();

  payersList: { id: number, name: string, arName: string }[];


  constructor(private sharedServices: SharedServices) { }

  ngOnInit() {
    this.payersList = this.sharedServices.getPayersList();
  }

}
