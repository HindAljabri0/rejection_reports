import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { updatePhysicianId, updatePhysicianName, updatePhysicianCategory, updateDepartment, updatePageType } from '../store/claim.actions';
import {
  getPhysicianCategory,
  getDepartments,
  FieldError,
  getPhysicianErrors,
  getDepartmentCode,
  getClaim,
  getPageType,
  ClaimPageType,
  getPageMode,
  ClaimPageMode
} from '../store/claim.reducer';
import { map, withLatestFrom } from 'rxjs/operators';
import { Claim } from '../models/claim.model';

@Component({
  selector: 'claim-physician-header',
  templateUrl: './physician.component.html',
  styles: []
})
export class PhysicianComponent implements OnInit {

  physicianNameController: FormControl = new FormControl();
  physicianIdController: FormControl = new FormControl();
  selectedCategory = '';
  categoryEditable = true;
  selectedDepartment: number;
  departmentEditable = true;

  categories: any[] = [];
  departments: any[];

  errors: FieldError[] = [];


  pageType: ClaimPageType;
  pageMode: ClaimPageMode;
  @Input() claimType = '';

  constructor(private store: Store) {
  }

  ngOnInit() {
    this.store.select(getPhysicianCategory).subscribe(category => this.categories = category);
    this.store.select(getPageType).subscribe(type => this.pageType = type);
    this.store.select(getDepartments).pipe(
      withLatestFrom(this.store.select(getPageMode)),
      map(values => ({ departments: values[0], mode: values[1] }))
    ).subscribe(values => {
      if (values.mode.startsWith('CREATE')) {
        this.departments = values.departments.filter(department => department.name == 'Dental' || department.name == 'Optical');
      } else {
        this.departments = values.departments;
      }
    });
    this.store.select(getPageMode).pipe(
      withLatestFrom(this.store.select(getClaim)),
      map(values => ({ mode: values[0], claim: values[1] }))
    ).subscribe(({ mode, claim }) => {
      this.pageMode = mode;
      if (mode == 'VIEW') {
        this.setData(claim);
        this.toggleEdit(false);
      } else if (mode == 'EDIT') {
        this.setData(claim);
        this.toggleEdit(true);
      } else if (mode == 'CREATE_FROM_RETRIEVED') {
        this.setData(claim);
        this.toggleEdit(false, true);
      }
    });
    this.store.select(getPhysicianErrors).subscribe(errors => this.errors = errors);

    this.store.select(getDepartmentCode).subscribe(type => this.selectedDepartment = +type);
    setTimeout(() => {
      const category = this.selectedCategory;
      const department = this.selectedDepartment;
      this.selectedDepartment = 1;
      this.selectedCategory = '-1';
      setTimeout(() => { this.selectedDepartment = department; this.selectedCategory = category; }, 500);
    }, 500);
  }

  setData(claim: Claim) {
    this.physicianIdController.setValue(claim.caseInformation.physician.physicianID);
    this.physicianNameController.setValue(claim.caseInformation.physician.physicianName);
    this.selectedCategory = claim.caseInformation.physician.physicianCategory;
    this.selectedDepartment = +claim.visitInformation.departmentCode;
  }
  toggleEdit(allowEdit: boolean, enableForNulls?: boolean) {
    this.categoryEditable = allowEdit || (enableForNulls && !this.categories.includes(this.selectedCategory));
    this.departmentEditable = allowEdit;
    if (allowEdit || (enableForNulls && (this.physicianNameController.value == null || this.physicianNameController.value == ''))) {
      this.physicianNameController.enable();
    } else {
      this.physicianNameController.disable();
    }
    if (enableForNulls) {
      if (this.physicianIdController.value == null || this.physicianIdController.value == '') {
        this.physicianIdController.disable();
      } else {
        this.physicianIdController.enable();
      }
    } else {
      this.physicianIdController.disable();
    }
  }

  updateClaim(field: string) {
    switch (field) {
      case 'physicianId':
        this.store.dispatch(updatePhysicianId({ physicianId: this.physicianIdController.value }));
        break;
      case 'physicianName':
        this.store.dispatch(updatePhysicianName({ physicianName: this.physicianNameController.value }));
        break;
      case 'physicianCategory':
        this.store.dispatch(updatePhysicianCategory({ physicianCategory: this.selectedCategory }));
        break;
      case 'department':
        const dental = this.departments.find(department => department.name == 'Dental');
        const optical = this.departments.find(department => department.name == 'Optical');
        const pharmacy = this.departments.find(department => department.name == 'Pharmacy');
        if ((dental != null && this.selectedDepartment == dental.departmentId)
          || (optical != null && this.selectedDepartment == optical.departmentId)
          || (pharmacy != null && this.selectedDepartment == pharmacy.departmentId)) {
          this.store.dispatch(updatePageType({ pageType: 'DENTAL_OPTICAL' }));
        } else {
          this.store.dispatch(updatePageType({ pageType: 'INPATIENT_OUTPATIENT' }));
        }
        this.store.dispatch(updateDepartment({ department: this.selectedDepartment.toString() }));
        break;
    }
  }

  beautifyCategory(category) {
    if (category != null && category != '-1') {
      let str = category.substr(0, 1) + category.substr(1).toLowerCase();
      if (str.includes('_')) {
        const split = str.split('_');
        str = split[0] + ' ' + this.beautifyCategory(split[1].toUpperCase());
      }
      return str;
    } else {
      return '';
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

  departmentsHasCode(code) {
    return this.departments.findIndex(dep => dep.departmentId == code) > -1;
  }
}
