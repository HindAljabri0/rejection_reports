import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SharedServices } from 'src/app/services/shared.services';
import { Store } from '@ngrx/store';
import { updatePatientName, updatePatientGender, updatePayer, updatePatientMemberId, updatePolicyNum, updateNationalId, updateApprovalNum } from '../store/claim.actions';

@Component({
  selector: 'claim-patient-info',
  templateUrl: './claim-patient-info.component.html',
  styleUrls: ['./claim-patient-info.component.css']
})
export class ClaimPatientInfo implements OnInit {

  fullNameController: FormControl = new FormControl();
  isMale: boolean = true;
  selectedPayer: number;
  memberIdController: FormControl = new FormControl();
  policyNumController: FormControl = new FormControl();
  nationalIdontroller: FormControl = new FormControl();
  approvalNumontroller: FormControl = new FormControl();

  payersList: { id: number, name: string, arName: string }[];

  constructor(private sharedServices: SharedServices, private store: Store) { }

  ngOnInit() {
    this.payersList = this.sharedServices.getPayersList();
    this.store.dispatch(updatePatientGender({ gender: this.isMale ? 'M' : 'F' }));
    if (this.payersList != null && this.payersList.length > 0) {
      this.selectedPayer = this.payersList[0].id;
    }
    this.store.dispatch(updatePayer({ payerId: this.selectedPayer }));
  }

  toggleGender() {
    this.isMale = !this.isMale;
    this.store.dispatch(updatePatientGender({ gender: this.isMale ? 'M' : 'F' }));
  }

  updateClaim(field: string) {
    switch (field) {
      case 'fullName':
        this.store.dispatch(updatePatientName({ name: this.fullNameController.value }));
        break;
      case 'memberId':
        this.store.dispatch(updatePatientMemberId({ memberId: this.memberIdController.value }));
        break;
      case 'policyNum':
        this.store.dispatch(updatePolicyNum({ policyNo: this.policyNumController.value }));
        break;
      case 'nationalId':
        this.store.dispatch(updateNationalId({ nationalId: this.nationalIdontroller.value }));
        break;
      case 'approvalNum':
        this.store.dispatch(updateApprovalNum({ approvalNo: this.approvalNumontroller.value }));
        break;
    }
  }

}
