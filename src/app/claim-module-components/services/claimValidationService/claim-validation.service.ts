import { Injectable } from '@angular/core';
import { Claim } from '../../models/claim.model';
import { Store } from '@ngrx/store';
import { getClaim, FieldError } from '../../store/claim.reducer';
import { addClaimErrors } from '../../store/claim.actions';

@Injectable({
  providedIn: 'root'
})
export class ClaimValidationService {

  claim: Claim;

  constructor(private store: Store) {
    this.store.select(getClaim).subscribe(claim => this.claim = claim);
  }

  startValidation() {
    this.validatePatientInfo();
    this.validateGenInfo();
    this.validateDiagnosis()
  }

  validatePatientInfo() {
    const fullName = this.claim.caseInformation.patient.fullName;
    const gender = this.claim.caseInformation.patient.gender;
    const payer = this.claim.claimIdentities.payerID;
    const visitType = this.claim.visitInformation.visitType;
    const nationality = this.claim.caseInformation.patient.nationality;
    const memberId = this.claim.member.memberID;
    const nationalId = this.claim.member.idNumber;
    const policyNum = this.claim.member.policyNumber;
    const approvalNum = this.claim.claimIdentities.approvalNumber;

    let fieldErrors: FieldError[] = [];
    if (fullName == null || fullName.trim().length == 0) {
      fieldErrors.push({ fieldName: 'fullName' });
    }
    if (memberId == null || memberId.trim().length == 0) {
      fieldErrors.push({ fieldName: 'memberId' });
    }
    if (nationalId != null && nationalId.trim().length != 10) {
      fieldErrors.push({ fieldName: 'nationalId', error: 'National id must be 10 numbers or 0.' });
    }
    if (payer != '102' && (policyNum == null || policyNum.trim().length == 0)) {
      fieldErrors.push({ fieldName: 'policyNum' });
    }
    if (approvalNum == null || approvalNum.trim().length == 0) {
      fieldErrors.push({ fieldName: 'approvalNum' });
    }
    this.store.dispatch(addClaimErrors({ module: 'patientInfoErrors', errors: fieldErrors }));
  }

  validateGenInfo() {
    const claimDate = this.claim.visitInformation.visitDate;
    const claimType = this.claim.visitInformation.visitType;
    const fileNumber = this.claim.caseInformation.patient.patientFileNumber;
    const memberDob = this.claim.caseInformation.patient.dob;
    const illnessDuration = this.claim.caseInformation.caseDescription.illnessDuration;
    const age = this.claim.caseInformation.patient.age;

    let fieldErrors:FieldError[] = [];

    console.log(claimDate);
    console.log(memberDob);
    if(claimDate == null || Number.isNaN(claimDate.getTime()) || Number.isNaN(claimDate.getFullYear()) || Number.isNaN(claimDate.getMonth()) || Number.isNaN(claimDate.getDay()) || claimDate.getTime() > Date.now()){
      fieldErrors.push({fieldName:'claimDate'});
    }
    if (fileNumber == null || fileNumber.trim().length == 0) {
      fieldErrors.push({ fieldName: 'fileNumber' });
    }
    if(memberDob == null || Number.isNaN(memberDob.getTime()) || Number.isNaN(memberDob.getFullYear()) || Number.isNaN(memberDob.getMonth()) || Number.isNaN(memberDob.getDay())  || memberDob.getTime() > Date.now()){
      fieldErrors.push({fieldName:'memberDob'});
    }

    this.store.dispatch(addClaimErrors({ module: 'genInfoErrors', errors: fieldErrors }));
  }

  validateDiagnosis()
  {
    const diagnosis = this.claim.caseInformation.caseDescription.diagnosis;

    let fieldErrors:FieldError[] = [];
    if(diagnosis == null || diagnosis.length == 0){
      fieldErrors.push({fieldName:'diagnosis'});
    }
    this.store.dispatch(addClaimErrors({module:'diagnosisErrors', errors: fieldErrors}));

  }
}
