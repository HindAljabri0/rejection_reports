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
  pharmacyDepartmentCode: string;
  pageType: ClaimPageType;

  constructor(private store: Store) {
    this.store.select(getClaim).subscribe(claim => this.claim = claim);
    this.store.select(getDepartments)
      .subscribe(departments => {
        if (departments != null && departments.length > 0) {
          this.dentalDepartmentCode = departments.find(department => department.name == "Dental").departmentId + '';
          this.opticalDepartmentCode = departments.find(department => department.name == "Optical").departmentId + '';
          this.pharmacyDepartmentCode = departments.find(department => department.name == 'Pharmacy').departmentId + '';
        }
      });
    this.store.select(getPageType).subscribe(type => this.pageType = type);
  }


  startValidation() {
    this.validateRequires();
  }


  validateRequires(){
    const claimDate = this.claim.visitInformation.visitDate;
    const invoiceNumber = this.claim.invoice;
    const patientFileNumber = this.claim.caseInformation.patient.patientFileNumber;
    const departmentCode = this.claim.visitInformation.departmentCode;
    
    let invoiceErrors: FieldError[] = [];
    let genInfoErrors: FieldError[] = [];

    invoiceNumber.forEach((invoice, index) => {
      if (invoice.invoiceNumber == null || invoice.invoiceNumber.trim().length == 0) {
        invoiceErrors.push({ fieldName: `INVOICENUM`,code:`${index}` , error:'Invoice Number must be specified'});
      }else if(invoice.invoiceNumber.trim().length > 30){
        invoiceErrors.push({ fieldName: `INVOICENUM`,code:`${index}` , error:' Invoice Number must be less than 30 characters'}); 
      }
    });
    if (claimDate == null || Number.isNaN(claimDate.getTime())) {
      genInfoErrors.push({ fieldName: 'VSITDATE', error:'Claim Date must be specified' });
    }
    if (patientFileNumber == null || patientFileNumber.trim().length == 0) {
      genInfoErrors.push({ fieldName: 'PATFILNO', error:'Patient File Number must be specified' });
    }else if( patientFileNumber.trim().length > 60){
      genInfoErrors.push({ fieldName: 'PATFILNO', error:'Patient File Number must be less than 60 characters ' });
    }

    if(departmentCode == null || departmentCode.trim().length == 0 || Number.isNaN(Number.parseInt(departmentCode))){
      genInfoErrors.push({fieldName: 'DPARCODE', error:'Department must be specified.'})
    }

    this.store.dispatch(addClaimErrors({ module: 'invoiceErrors', errors: invoiceErrors }));
    this.store.dispatch(addClaimErrors({ module: 'genInfoErrors', errors: genInfoErrors }));
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
