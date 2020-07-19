import { Injectable } from '@angular/core';
import { Claim } from '../../models/claim.model';
import { Store } from '@ngrx/store';
import { getClaim, FieldError } from '../../store/claim.reducer';
import { addClaimErrors } from '../../store/claim.actions';
import { Service } from '../../models/service.model';

@Injectable({
  providedIn: 'root'
})
export class ClaimValidationService {

  claim: Claim;

  constructor(private store: Store) {
    this.store.select(getClaim).subscribe(claim => this.claim = claim);
  }

  private regax = /^[A-Za-z0-9- ]+$/i;
  private regaxWithOutSpace = /^[A-Za-z0-9-]+$/i;
  private regaxWithSym = /^[A-Za-z0-9 $-/:-?{-~!"^_`\[\]]+$/i;

  startValidation() {
    this.validatePatientInfo();
    this.validatePhysicianInfo();
    this.validateGenInfo();
    this.validateDiagnosis();
    this.validateInvoices();
    this.validateClaimNetAmount();
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
    } else if (!this.regax.test(fullName)) {
      fieldErrors.push({ fieldName: 'fullName', error: 'Characters allowed: (0-9), (a-z), (A-Z), (SPACE), (-)' });
    }
    if (memberId == null || memberId.trim().length == 0) {
      fieldErrors.push({ fieldName: 'memberId' });
    } else if (!this.regaxWithOutSpace.test(memberId)) {
      fieldErrors.push({ fieldName: 'memberId', error: 'Characters allowed: (0-9), (a-z), (A-Z), (-)' });
    }
    if (nationalId != null && nationalId.trim().length != 10) {
      fieldErrors.push({ fieldName: 'nationalId', error: 'National id must be 10 numbers or 0.' });
    }
    if (payer != '102' && (policyNum == null || policyNum.trim().length == 0)) {
      fieldErrors.push({ fieldName: 'policyNum' });
    }
    if (approvalNum == null || approvalNum.trim().length == 0) {
      fieldErrors.push({ fieldName: 'approvalNum' });
    } else if (!this.regaxWithOutSpace.test(approvalNum)) {
      fieldErrors.push({ fieldName: 'approvalNum', error: 'Characters allowed: (0-9), (a-z), (A-Z), (-)' });
    }
    this.store.dispatch(addClaimErrors({ module: 'patientInfoErrors', errors: fieldErrors }));
  }

  validatePhysicianInfo() {
    const physicianId = this.claim.caseInformation.physician.physicianID;
    const physicianName = this.claim.caseInformation.physician.physicianName;

    let fieldErrors: FieldError[] = [];

    if (physicianId != null && physicianId.trim().length > 0 && !this.regaxWithOutSpace.test(physicianId)) {
      fieldErrors.push({ fieldName: 'physicianId', error: 'Characters allowed: (0-9), (a-z), (A-Z), (-)' });
    }

    if (physicianName != null && physicianName.trim().length > 0 && !this.regax.test(physicianName)) {
      fieldErrors.push({ fieldName: 'physicianName', error: 'Characters allowed: (0-9), (a-z), (A-Z), (SPACE), (-)' });
    }

    this.store.dispatch(addClaimErrors({ module: 'physicianErrors', errors: fieldErrors }));
  }

  validateGenInfo() {
    const claimDate = this.claim.visitInformation.visitDate;
    const claimType = this.claim.visitInformation.visitType;
    const fileNumber = this.claim.caseInformation.patient.patientFileNumber;
    const memberDob = this.claim.caseInformation.patient.dob;
    const mainSymptoms = this.claim.caseInformation.caseDescription.chiefComplaintSymptoms;
    const illnessDuration = this.claim.caseInformation.caseDescription.illnessDuration;
    const age = this.claim.caseInformation.patient.age;

    let fieldErrors: FieldError[] = [];

    if (this._isInvalidDate(claimDate)) {
      fieldErrors.push({ fieldName: 'claimDate' });
    }
    if (fileNumber == null || fileNumber.trim().length == 0) {
      fieldErrors.push({ fieldName: 'fileNumber' });
    } else if (!this.regaxWithOutSpace.test(fileNumber)) {
      fieldErrors.push({ fieldName: 'fileNumber', error: 'Characters allowed: (0-9), (a-z), (A-Z), (-)' });
    }
    if (mainSymptoms != null && !this.regax.test(mainSymptoms)) {
      fieldErrors.push({ fieldName: 'mainSymptoms', error: 'Characters allowed: (0-9), (a-z), (A-Z), (SPACE), (-)' });
    }
    if (this._isInvalidDate(memberDob)) {
      fieldErrors.push({ fieldName: 'memberDob' });
    }

    this.store.dispatch(addClaimErrors({ module: 'genInfoErrors', errors: fieldErrors }));
  }

  validateDiagnosis() {
    if (this.claim.claimIdentities.payerID == '102' && this.claim.visitInformation.departmentCode == '20') {
      this.store.dispatch(addClaimErrors({ module: 'diagnosisErrors', errors: [] }));
      return;
    }

    const diagnosis = this.claim.caseInformation.caseDescription.diagnosis;

    let fieldErrors: FieldError[] = [];

    if (diagnosis == null || diagnosis.length == 0) {
      fieldErrors.push({ fieldName: 'diagnosis' });
    }
    this.store.dispatch(addClaimErrors({ module: 'diagnosisErrors', errors: fieldErrors }));

  }

  validateInvoices() {
    const invoices = this.claim.invoice;

    let fieldErrors: FieldError[] = [];
    invoices.forEach((invoice, index) => {
      if (this._isInvalidDate(invoice.invoiceDate)) {
        fieldErrors.push({ fieldName: `invoiceDate:${index}` })
      }
      if (invoice.invoiceNumber == null || invoice.invoiceNumber.trim().length == 0) {
        fieldErrors.push({ fieldName: `invoiceNumber:${index}` })
      } else if (!this.regaxWithOutSpace.test(invoice.invoiceNumber)) {
        fieldErrors.push({ fieldName: `invoiceNumber:${index}`, error: 'Characters allowed: (0-9), (a-z), (A-Z), (-)' });
      }
      invoice.service.forEach((service, serviceIndex) => {
        fieldErrors.push(...this.validateService(service, index, serviceIndex));
      });
    });

    this.store.dispatch(addClaimErrors({ module: 'invoiceErrors', errors: fieldErrors }));
  }

  validateService(service: Service, invoiceIndex: number, serviceIndex: number): FieldError[] {
    let fieldErrors: FieldError[] = [];

    if (this._isInvalidDate(service.serviceDate)) {
      fieldErrors.push({ fieldName: `serviceDate:${invoiceIndex}:${serviceIndex}` });
    }

    if (service.serviceCode == null || service.serviceCode.trim().length == 0 || service.serviceCode.startsWith('0')) {
      fieldErrors.push({
        fieldName: `serviceCode:${invoiceIndex}:${serviceIndex}`,
        error: (service.serviceCode != null && service.serviceCode.startsWith('0')) ? 'service code cannot start with zero' : null
      });
    } else if (!this.regaxWithOutSpace.test(service.serviceCode)) {
      fieldErrors.push({ fieldName: `serviceCode:${invoiceIndex}:${serviceIndex}`, error: 'Characters allowed: (0-9), (a-z), (A-Z), (-)' });
    }

    if (service.serviceDescription == null || service.serviceDescription.trim().length == 0) {
      fieldErrors.push({ fieldName: `serviceDescription:${invoiceIndex}:${serviceIndex}` })
    } else if (!this.regaxWithSym.test(service.serviceDescription)) {
      fieldErrors.push({ fieldName: `serviceDescription:${invoiceIndex}:${serviceIndex}`, error: 'Characters allowed: (0-9), (a-z), (A-Z), and special characters' });
    }

    if (service.unitPrice == null || service.unitPrice.value == null || service.unitPrice.value <= 0) {
      fieldErrors.push({ fieldName: `serviceUnitPrice:${invoiceIndex}:${serviceIndex}`, error: 'must be bigger than zero' });
    }

    if (service.requestedQuantity == null || service.requestedQuantity <= 0) {
      fieldErrors.push({ fieldName: `serviceQuantity:${invoiceIndex}:${serviceIndex}`, error: 'must be bigger than zero' });
    }

    let GDPN = service.serviceGDPN;
    if (GDPN.patientShare != null && GDPN.patientShare.value != null) {
      if (GDPN.patientShare.value < 0)
        fieldErrors.push({ fieldName: `servicePatientShare:${invoiceIndex}:${serviceIndex}` });
      else if (GDPN.patientShare.value > GDPN.gross.value)
        fieldErrors.push({ fieldName: `servicePatientShare:${invoiceIndex}:${serviceIndex}`, error: 'must be less than or equal (unit price * quantity)' });
    }
    if (GDPN.discount != null && GDPN.discount.value != null) {
      if (GDPN.discount.value < 0)
        fieldErrors.push({ fieldName: `serviceDiscount:${invoiceIndex}:${serviceIndex}` });
      else if (GDPN.discount.type == 'PERCENT' && GDPN.discount.value > 100)
        fieldErrors.push({ fieldName: `serviceDiscount:${invoiceIndex}:${serviceIndex}`, error: 'must be between 0% and 100%, or click on % to change it to exact value' });
      else if (GDPN.discount.type == 'SAR' && GDPN.discount.value > ((GDPN.gross.value || 0) - (GDPN.patientShare.value || 0)))
        fieldErrors.push({ fieldName: `serviceDiscount:${invoiceIndex}:${serviceIndex}`, error: 'must be less than or equal (unit price * quantity - patientshare)' });
    }
    if (GDPN.netVATrate != null && GDPN.netVATrate.value != null && GDPN.netVATrate.value < 0) {
      fieldErrors.push({ fieldName: `serviceNetVatRate:${invoiceIndex}:${serviceIndex}` });
    }
    if (GDPN.patientShareVATrate != null && GDPN.patientShareVATrate.value != null && GDPN.patientShareVATrate.value < 0) {
      fieldErrors.push({ fieldName: `servicePatientShareVatRate:${invoiceIndex}:${serviceIndex}` });
    }


    return fieldErrors;
  }

  validateClaimNetAmount() {
    let fieldErrors: FieldError[] = []
    if (this.claim.claimGDPN.net == null || this.claim.claimGDPN.net.value == null || this.claim.claimGDPN.net.value <= 0) {
      fieldErrors.push({ fieldName: 'claimNetAmount' });
    }
    this.store.dispatch(addClaimErrors({ module: 'claimGDPN', errors: fieldErrors }));
  }


  _isInvalidDate(date: Date) {
    return date == null || Number.isNaN(date.getTime()) || Number.isNaN(date.getFullYear()) || Number.isNaN(date.getMonth()) || Number.isNaN(date.getDay()) || date.getTime() > Date.now()
  }
}
