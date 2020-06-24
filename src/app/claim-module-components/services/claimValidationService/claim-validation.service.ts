import { Injectable } from '@angular/core';
import { Claim } from '../../models/claim.model';
import { Store } from '@ngrx/store';
import { getClaim, FieldError } from '../../store/claim.reducer';
import { addClaimErrors } from '../../store/claim.actions';

@Injectable({
  providedIn: 'root'
})
export class ClaimValidationService {
  
  claim:Claim;

  constructor(private store:Store) {
    this.store.select(getClaim).subscribe(claim => this.claim = claim);
  }

  startValidation(){
    this.validatePatientInfo();
  }

  validatePatientInfo(){
    const fullName = this.claim.caseInformation.patient.fullName;
    const gender = this.claim.caseInformation.patient.gender;
    const payer = this.claim.claimIdentities.payerID;
    const visitType = this.claim.visitInformation.visitType;
    const nationality = this.claim.caseInformation.patient.nationality;
    const memberId = this.claim.member.memberID;
    const nationalId = this.claim.member.idNumber;
    const policyNum = this.claim.member.policyNumber;
    const approvalNum = this.claim.claimIdentities.approvalNumber;

    let fieldErrors:FieldError[] = [];
    if(fullName == null || fullName.trim().length == 0){
      fieldErrors.push({fieldName:'fullName'});
    }
    if(memberId == null || memberId.trim().length == 0){
      fieldErrors.push({fieldName:'memberId'});
    }
    if(nationalId != null && nationalId.trim().length != 10){
      fieldErrors.push({fieldName: 'nationalId', error:'National id must be 10 numbers or 0.'});
    }
    if(payer != '102' && (policyNum == null || policyNum.trim().length == 0)){
      fieldErrors.push({fieldName:'policyNum'});
    }
    if(approvalNum == null || approvalNum.trim().length == 0){
      fieldErrors.push({fieldName:'approvalNum'});
    }
    this.store.dispatch(addClaimErrors({module:'patientInfoErrors', errors: fieldErrors}));
  }
}
