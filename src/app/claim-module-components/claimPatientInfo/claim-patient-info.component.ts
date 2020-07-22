import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SharedServices } from 'src/app/services/shared.services';
import { Store } from '@ngrx/store';
import { updatePatientName, updatePatientGender, updatePayer, updatePatientMemberId, updatePolicyNum, updateNationalId, updateApprovalNum, updateVisitType, updateNationality, setError } from '../store/claim.actions';
import { Observable } from 'rxjs';
import { getVistType, nationalities, FieldError, getPatientErrors, getIsRetreivedClaim, getClaim } from '../store/claim.reducer';
import { withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'claim-patient-info',
  templateUrl: './claim-patient-info.component.html',
  styleUrls: ['./claim-patient-info.component.css']
})
export class ClaimPatientInfo implements OnInit {

  isRetreivedClaim: boolean = false;

  fullNameController: FormControl = new FormControl();
  isMale: boolean = true;
  selectedPayer: number;
  selectedVisitType: string;
  selectedNationality: string;
  memberIdController: FormControl = new FormControl();
  policyNumController: FormControl = new FormControl();
  nationalIdontroller: FormControl = new FormControl();
  approvalNumontroller: FormControl = new FormControl();

  payersList: { id: number, name: string, arName: string }[] = [];
  visitTypes: any[] = [];
  nationalities = nationalities;

  errors: FieldError[] = [];

  constructor(private sharedServices: SharedServices, private store: Store) { }

  ngOnInit() {
    this.payersList = this.sharedServices.getPayersList();
    this.store.select(getVistType).subscribe(visitTypes => this.visitTypes = visitTypes || []);

    this.store.select(getIsRetreivedClaim).pipe(
      withLatestFrom(this.store.select(getClaim))
    ).subscribe(values => {
      this.isRetreivedClaim = values[0];
      if (this.isRetreivedClaim) {
        this.selectedPayer = Number.parseInt(values[1].claimIdentities.payerID);
        this.isMale = values[1].caseInformation.patient.gender == 'M';
        this.selectedVisitType = values[1].visitInformation.visitType;
        this.selectedNationality = values[1].caseInformation.patient.nationality;
        this.nationalIdontroller.setValue(values[1].member.idNumber);
        this.approvalNumontroller.setValue(values[1].claimIdentities.approvalNumber);
        this.fullNameController.setValue(values[1].caseInformation.patient.fullName);
        this.policyNumController.setValue(values[1].member.policyNumber);
        this.memberIdController.setValue(values[1].member.memberID);
      } else {

        if (this.payersList.length > 0) {
          this.selectedPayer = this.payersList[0].id;
        } else {
          this.store.dispatch(setError({ error: { code: 'PAYERS_LIST' } }));
        }

        if (this.visitTypes.length > 0) {
          this.selectedVisitType = this.visitTypes[0];
        }
        this.store.dispatch(updatePatientGender({ gender: this.isMale ? 'M' : 'F' }));
        this.store.dispatch(updatePayer({ payerId: this.selectedPayer }));
        this.store.dispatch(updateVisitType({ visitType: this.selectedVisitType }));

      }

    }).unsubscribe();


    this.store.select(getPatientErrors).subscribe(errors => this.errors = errors);


  }

  toggleGender() {
    this.isMale = !this.isMale;
    this.store.dispatch(updatePatientGender({ gender: this.isMale ? 'M' : 'F' }));
  }

  printEvent(event) { console.log(event); }

  updateClaim(field: string) {

    this.errors = this.errors.filter(error => error.fieldName == field);
    switch (field) {
      case 'fullName':
        this.store.dispatch(updatePatientName({ name: this.fullNameController.value }));
        break;
      case 'payer':
        this.store.dispatch(updatePayer({ payerId: this.selectedPayer }));
        break;
      case 'visitType':
        this.store.dispatch(updateVisitType({ visitType: this.selectedVisitType }));
        break;
      case 'nationality':
        this.store.dispatch(updateNationality({ nationality: this.selectedNationality }))
        break;
      case 'memberId':
        this.store.dispatch(updatePatientMemberId({ memberId: this.memberIdController.value }));
        break;
      case 'policyNum':
        this.store.dispatch(updatePolicyNum({ policyNo: this.policyNumController.value }));
        break;
      case 'nationalId':
        this.store.dispatch(updateNationalId({ nationalId: this.nationalIdontroller.value == null ? null : `${this.nationalIdontroller.value}` }));
        break;
      case 'approvalNum':
        this.store.dispatch(updateApprovalNum({ approvalNo: this.approvalNumontroller.value }));
        break;
    }
  }

  fieldHasError(fieldName) {
    return this.errors.findIndex(error => error.fieldName == fieldName) != -1;
  }

  getFieldError(fieldName) {
    const index = this.errors.findIndex(error => error.fieldName == fieldName);
    if (index > -1) {
      return this.errors[index].error || '';
    }
    return '';
  }

}
