import { Injectable } from '@angular/core';
import { Claim } from '../../models/claim.model';
import { Store } from '@ngrx/store';
import { getClaim, FieldError, getDepartments, ClaimPageType, getPageType } from '../../store/claim.reducer';
import { addClaimErrors } from '../../store/claim.actions';
import { Service } from '../../models/service.model';
import { Period } from '../../models/period.type';

@Injectable({
  providedIn: 'root'
})
export class ClaimValidationService {

  claim: Claim;
  dentalDepartmentCode: string;
  opticalDepartmentCode: string;
  pageType: ClaimPageType;

  constructor(private store: Store) {
    this.store.select(getClaim).subscribe(claim => this.claim = claim);
    this.store.select(getDepartments)
      .subscribe(departments => {
        if (departments != null && departments.length > 0) {
          this.dentalDepartmentCode = departments.find(department => department.name == "Dental").departmentId + '';
          this.opticalDepartmentCode = departments.find(department => department.name == "Optical").departmentId + '';
        }
      });
    this.store.select(getPageType).subscribe(type => this.pageType = type);
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
    this.validateAdmission();
    this.validateLabResults();
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
    // if (fullName == null || fullName.trim().length == 0) {
    //   fieldErrors.push({ fieldName: 'fullName' });
    // } else if (!this.regax.test(fullName)) {
    //   fieldErrors.push({ fieldName: 'fullName', error: 'Characters allowed: (0-9), (a-z), (A-Z), (SPACE), (-)' });
    // }
    if (gender == null || gender + '' == '') {
      fieldErrors.push({ fieldName: 'gender' });
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
    if(this.pageType == 'DENTAL_OPTICAL'){
      if (approvalNum == null || approvalNum.trim().length == 0) {
        fieldErrors.push({ fieldName: 'approvalNum' });
      } else if (!this.regaxWithSym.test(approvalNum)) {
        fieldErrors.push({ fieldName: 'approvalNum', error: 'Characters allowed: (0-9), (a-z), (A-Z), and special characters' });
      }
    }
    this.store.dispatch(addClaimErrors({ module: 'patientInfoErrors', errors: fieldErrors }));
  }

  validatePhysicianInfo() {
    const physicianId = this.claim.caseInformation.physician.physicianID;
    const physicianCategory = this.claim.caseInformation.physician.physicianCategory;
    const physicianName = this.claim.caseInformation.physician.physicianName;
    const department = this.claim.visitInformation.departmentCode;

    let fieldErrors: FieldError[] = [];

    if (this.pageType == 'DENTAL_OPTICAL') {
      if (physicianId != null && physicianId.trim().length > 0 && !this.regaxWithOutSpace.test(physicianId)) {
        fieldErrors.push({ fieldName: 'physicianId', error: 'Characters allowed: (0-9), (a-z), (A-Z), (-)' });
      }
    } else if (this.pageType = 'INPATIENT_OUTPATIENT') {
      if (physicianId == null || physicianId.trim().length == 0) {
        fieldErrors.push({ fieldName: 'physicianId' });
      } else if (!this.regaxWithOutSpace.test(physicianId)) {
        fieldErrors.push({ fieldName: 'physicianId', error: 'Characters allowed: (0-9), (a-z), (A-Z), (-)' });
      }

      if (physicianName == null || physicianName.trim().length == 0) {
        fieldErrors.push({ fieldName: 'physicianName' });
      }

      if (physicianCategory == null || physicianCategory.trim().length == 0) {
        fieldErrors.push({ fieldName: 'physicianCategory' });
      }

      if (department == null || department.trim().length == 0) {
        fieldErrors.push({ fieldName: 'department' });
      }
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
    const significantSign = this.claim.caseInformation.caseDescription.signicantSigns;
    const commReport = this.claim.commreport;
    const eligibilityNum = this.claim.claimIdentities.eligibilityNumber;
    const radiologyReport = this.claim.caseInformation.radiologyReport;
    const otherCondition = this.claim.caseInformation.otherConditions;

    let fieldErrors: FieldError[] = [];

    if (this._isInvalidDate(claimDate)) {
      fieldErrors.push({ fieldName: 'claimDate' });
    }
    if (fileNumber == null || fileNumber.trim().length == 0) {
      fieldErrors.push({ fieldName: 'fileNumber' });
    } else if (!this.regaxWithOutSpace.test(fileNumber)) {
      fieldErrors.push({ fieldName: 'fileNumber', error: 'Characters allowed: (0-9), (a-z), (A-Z), (-)' });
    }
    if (this._isInvalidDate(memberDob) && this._isInvalidPeriod(age)) {
      const message = "Please enter Member DOB or Age."
      fieldErrors.push({ fieldName: 'memberDob', error: message });
      fieldErrors.push({ fieldName: 'age', error: message });
    }

    if (this.pageType == 'INPATIENT_OUTPATIENT') {
      if (mainSymptoms == null || mainSymptoms.trim().length == 0) {
        fieldErrors.push({ fieldName: 'mainSymptoms' });
      }
      if (this._isInvalidPeriod(illnessDuration)) {
        fieldErrors.push({ fieldName: 'illnessDuration' });
      }
    }

    this.store.dispatch(addClaimErrors({ module: 'genInfoErrors', errors: fieldErrors }));
  }

  validateDiagnosis() {
    if (this.claim.claimIdentities.payerID == '102' && this.claim.visitInformation.departmentCode == this.opticalDepartmentCode) {
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
    }

    if (service.serviceDescription == null || service.serviceDescription.trim().length == 0) {
      fieldErrors.push({ fieldName: `serviceDescription:${invoiceIndex}:${serviceIndex}` })
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

    if (this.claim.visitInformation.departmentCode == this.dentalDepartmentCode) {
      if (service.toothNumber == null) {
        fieldErrors.push({ fieldName: `serviceToothNumber:${invoiceIndex}:${serviceIndex}` });
      } else {
        const toothNumbers = [11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28, 31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 51, 52, 53, 54, 55, 61, 62, 63, 64, 65, 71, 72, 73, 74, 75, 81, 82, 83, 84, 85];
        if (!toothNumbers.includes(Number.parseInt(service.toothNumber))) {
          fieldErrors.push({ fieldName: `serviceToothNumber:${invoiceIndex}:${serviceIndex}`, error: 'Please enter a valid tooth number or select one.' });
        }
      }
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

  validateAdmission() {
    let fieldErrors: FieldError[] = [];
    if (this.claim.caseInformation.caseType == 'INPATIENT') {
      let admissionDate;
      let dischargeDate;
      let lengthOfStay;
      let roomNumber;
      let bedNumber;
      if (this.claim.admission != null) {
        admissionDate = this.claim.admission.admissionDate;
        dischargeDate = this.claim.admission.discharge.dischargeDate;
        lengthOfStay = this.claim.admission.discharge.actualLengthOfStay;
        roomNumber = this.claim.admission.roomNumber;
        bedNumber = this.claim.admission.bedNumber;
      }
      if (this._isInvalidDate(admissionDate)) {
        fieldErrors.push({ fieldName: 'admissionDate' });
      }
      if (this._isInvalidDate(dischargeDate)) {
        fieldErrors.push({ fieldName: 'dischargeDate' });
      }
      if (this._isInvalidPeriod(lengthOfStay)) {
        fieldErrors.push({ fieldName: 'lengthOfStay' });
      }
      if (roomNumber == null || roomNumber.trim().length == 0) {
        fieldErrors.push({ fieldName: 'roomNumber' });
      } else if (!this.regax.test(roomNumber)) {
        fieldErrors.push({ fieldName: 'roomNumber', error: 'Characters allowed: (0-9), (a-z), (A-Z), (SPACE), (-)' });
      }
      if (bedNumber == null || bedNumber.trim().length == 0) {
        fieldErrors.push({ fieldName: 'bedNumber' });
      } else if (!this.regax.test(bedNumber)) {
        fieldErrors.push({ fieldName: 'bedNumber', error: 'Characters allowed: (0-9), (a-z), (A-Z), (SPACE), (-)' });
      }
    }
    this.store.dispatch(addClaimErrors({ module: 'admissionErrors', errors: fieldErrors }));
  }

  validateLabResults() {
    let fieldErrors: FieldError[] = [];
    if (this.claim.caseInformation.caseDescription.investigation != null)
      this.claim.caseInformation.caseDescription.investigation.forEach((investigation, i) => {
        if (investigation.investigationCode == null || investigation.investigationCode.trim().length == 0) {
          fieldErrors.push({ fieldName: `testCode:${i}` });
        }
        investigation.observation.forEach((observation, j) => {
          if (observation.observationCode == null || observation.observationCode.trim().length == 0) {
            fieldErrors.push({ fieldName: `componentCode:${i}:${j}` });
          }
        });
      });

    this.store.dispatch(addClaimErrors({ module: 'labResultError', errors: fieldErrors }));
  }


  _isInvalidDate(date: Date) {
    if (date != null && !(date instanceof Date)) {
      date = new Date(date);
    }
    return date == null || Number.isNaN(date.getTime()) || Number.isNaN(date.getFullYear()) || Number.isNaN(date.getMonth()) || Number.isNaN(date.getDay()) || date.getTime() > Date.now()
  }

  _isInvalidPeriod(period: Period) {
    return period == null || ((period.days == null || Number.isNaN(period.days) || period.days <= 0) && (period.months == null || Number.isNaN(period.months) || period.months <= 0) && (period.years == null || Number.isNaN(period.years) || period.years <= 0));
  }
}
