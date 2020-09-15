import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SharedServices } from 'src/app/services/shared.services';
import { Store } from '@ngrx/store';
import { updatePatientName, updatePatientGender, updatePayer, updatePatientMemberId, updatePolicyNum, updateNationalId, updateApprovalNum, updateVisitType, updateNationality, setError } from '../store/claim.actions';
import { Observable } from 'rxjs';
import { getVisitType, nationalities, FieldError, getPatientErrors, getIsRetrievedClaim, getClaim, ClaimPageType, getPageType, getPageMode, ClaimPageMode } from '../store/claim.reducer';
import { withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'claim-patient-info',
  templateUrl: './claim-patient-info.component.html',
  styleUrls: ['./claim-patient-info.component.css']
})
export class ClaimPatientInfo implements OnInit {

  isRetrievedClaim: boolean = false;
  editableFields = {
    payer: true,
    visitType: true,
    nationality: true,
    gender: true
  };

  fullNameController: FormControl = new FormControl();
  selectedGender: string = '';
  selectedPayer: number;
  selectedVisitType: string;
  selectedNationality: string;
  memberIdController: FormControl = new FormControl();
  policyNumController: FormControl = new FormControl();
  nationalIdController: FormControl = new FormControl();
  approvalNumController: FormControl = new FormControl();

  planTypeController: FormControl = new FormControl();

  payersList: { id: number, name: string, arName: string }[] = [];
  visitTypes: any[] = [];
  nationalities = nationalities;

  pageMode: ClaimPageMode
  claimPageType: ClaimPageType;

  errors: FieldError[] = [];

  constructor(private sharedServices: SharedServices, private store: Store) { }

  ngOnInit() {
    this.store.select(getPageMode).subscribe(mode => this.pageMode = mode);
    this.store.select(getPageType).subscribe(type => this.claimPageType = type);
    this.payersList = this.sharedServices.getPayersList();
    this.store.select(getVisitType).subscribe(visitTypes => this.visitTypes = visitTypes || []);

    this.store.select(getIsRetrievedClaim).pipe(
      withLatestFrom(this.store.select(getClaim)),
      withLatestFrom(this.store.select(getPageMode))
    ).subscribe(values => {
      this.isRetrievedClaim = values[0][0];
      if (this.isRetrievedClaim) {
        this.selectedPayer = Number.parseInt(values[0][1].claimIdentities.payerID);
        this.editableFields.payer = values[1] == 'CREATE' && Number.isNaN(this.selectedPayer);
        this.selectedGender = values[0][1].caseInformation.patient.gender;
        this.editableFields.gender = values[1] == 'CREATE' && (values[0][1].caseInformation.patient.gender != 'F' && values[0][1].caseInformation.patient.gender != 'M');
        this.selectedVisitType = values[0][1].visitInformation.visitType;
        this.editableFields.visitType = values[1] == 'CREATE' && !this.visitTypes.includes(this.selectedVisitType);
        this.selectedNationality = values[0][1].caseInformation.patient.nationality;
        this.editableFields.nationality = values[1] == 'CREATE' && this.nationalities.findIndex(n => this.selectedNationality == n.Code) == -1;
        if (values[0][1].member.idNumber != null) {
          this.nationalIdController.setValue(values[0][1].member.idNumber);
          let isEditable = values[1] == 'CREATE' && (values[0][1].member.idNumber.length != 10 || Number.isNaN(Number.parseInt(values[0][1].member.idNumber)));
          this.nationalIdController.disable({ onlySelf: !isEditable });
        } else if (values[1] != 'CREATE') {
          this.nationalIdController.disable({ onlySelf: true });
        }
        this.approvalNumController.setValue(values[0][1].claimIdentities.approvalNumber);
        let isEditable = values[1] == 'CREATE' && (values[0][1].claimIdentities.approvalNumber == null || values[0][1].claimIdentities.approvalNumber.trim().length == 0);
        this.approvalNumController.disable({ onlySelf: !isEditable });
        this.fullNameController.setValue(values[0][1].caseInformation.patient.fullName);
        isEditable = values[1] == 'CREATE' && (values[0][1].caseInformation.patient.fullName == null || values[0][1].caseInformation.patient.fullName.trim().length == 0);
        this.fullNameController.disable({ onlySelf: !isEditable });
        this.policyNumController.setValue(values[0][1].member.policyNumber);
        isEditable = values[1] == 'CREATE' && (values[0][1].member.policyNumber == null || values[0][1].member.policyNumber.trim().length == 0);
        this.policyNumController.disable({ onlySelf: !isEditable });
        this.memberIdController.setValue(values[0][1].member.memberID);
        isEditable = values[1] == 'CREATE' && (values[0][1].member.memberID == null || values[0][1].member.memberID.trim().length == 0);
        this.memberIdController.disable({ onlySelf: !isEditable });
        this.planTypeController.setValue(values[0][1].member.planType);
        isEditable = values[1] == 'CREATE' && (values[0][1].member.planType == null || values[0][1].member.planType.trim().length == 0);
        this.planTypeController.disable({ onlySelf: isEditable });
      } else {

        if (this.payersList.length > 0) {
          this.selectedPayer = this.payersList[0].id;
        } else {
          this.store.dispatch(setError({ error: { code: 'PAYERS_LIST' } }));
        }

        if (this.visitTypes.length > 0) {
          this.selectedVisitType = this.visitTypes[0];
        }
        this.store.dispatch(updatePayer({ payerId: this.selectedPayer }));
        this.store.dispatch(updateVisitType({ visitType: this.selectedVisitType }));

      }

    }).unsubscribe();


    this.store.select(getPatientErrors).subscribe(errors => this.errors = errors);


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
        this.store.dispatch(updateNationalId({ nationalId: this.nationalIdController.value == null ? null : `${this.nationalIdController.value}` }));
        break;
      case 'approvalNum':
        this.store.dispatch(updateApprovalNum({ approvalNo: this.approvalNumController.value }));
        break;
      case 'gender':
        this.store.dispatch(updatePatientGender({ gender: this.selectedGender }));
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

  beautifyVisitType(visitType: string) {
    let str = visitType.substr(0, 1) + visitType.substr(1).toLowerCase();
    if (str.includes('_')) {
      let split = str.split('_');
      str = split[0] + ' ' + this.beautifyVisitType(split[1].toUpperCase());
    }
    return str;
  }
}
