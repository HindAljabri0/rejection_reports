import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'claim-genInfo-left-header',
  templateUrl: './gen-info-left-header.component.html',
  styleUrls: ['./gen-info-left-header.component.css']
})
export class GenInfoLeftHeaderComponent implements OnInit {

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
