import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SharedServices } from 'src/app/services/shared.services';
import { Store } from '@ngrx/store';
import { updatePhysicianId, updatePhysicianName, updatePhysicianCategory, updateDepartment } from '../store/claim.actions';
import { getPhysicianCategory, getDepartments, FieldError, getPhysicianErrors, getDepartmentCode, getIsRetrievedClaim, getClaim, getPageType, ClaimPageType, getPageMode } from '../store/claim.reducer';
import { map, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'claim-physician-header',
  templateUrl: './physician.component.html',
  styleUrls: ['./physician.component.css']
})
export class PhysicianComponent implements OnInit {

  isRetrievedClaim: boolean = false;

  physicianNameController: FormControl = new FormControl();
  physicianIdController: FormControl = new FormControl();
  selectedCategory: string;
  categoryEditable: boolean = true;
  selectedDepartment: string;
  departmentEditable: boolean = true;

  categories: any[] = [];
  departments: any[];

  errors: FieldError[] = [];

  pageType: ClaimPageType;

  constructor(private store: Store) { }

  ngOnInit() {
    this.store.select(getPhysicianErrors).subscribe(errors => this.errors = errors);
    this.store.select(getPhysicianCategory).subscribe(category => this.categories = category);
    this.store.select(getPageType).subscribe(type => this.pageType = type);
    this.store.select(getDepartments).pipe(
      withLatestFrom(this.store.select(getPageType)),
      map(values => ({ departments: values[0], type: values[1] }))
    ).subscribe(values => {
      if (values.type == 'DENTAL_OPTICAL') {
        this.departments = values.departments.filter(department => department.name == "Dental" || department.name == "Optical")
      } else if (values.type = 'INPATIENT_OUTPATIENT') {
        this.departments = values.departments;
      }
    });
    this.store.select(getDepartmentCode).subscribe(type => this.selectedDepartment = type);

    this.store.select(getIsRetrievedClaim).pipe(
      withLatestFrom(this.store.select(getClaim)),
      withLatestFrom(this.store.select(getPageMode)),
      map(values => ({isRetrieved: values[0][0], claim: values[0][1], mode: values[1]}))
    ).subscribe((values) => {
      this.isRetrievedClaim = values.isRetrieved;
      if (this.isRetrievedClaim) {
        this.physicianIdController.setValue(values.claim.caseInformation.physician.physicianID);
        this.physicianIdController.disable({ onlySelf: values.claim.caseInformation.physician.physicianID != null })
        this.physicianNameController.setValue(values.claim.caseInformation.physician.physicianName);
        this.physicianNameController.disable({ onlySelf: values.claim.caseInformation.physician.physicianName != null });
        this.selectedCategory = values.claim.caseInformation.physician.physicianCategory;
        this.categoryEditable = !this.categories.includes(this.selectedCategory) && values.mode == 'CREATE';
        if(values.mode != 'CREATE'){
          this.selectedDepartment = `${values.claim.visitInformation.departmentCode}`;
        }
        this.departmentEditable = false;

      } else {

      }

    }).unsubscribe();
    setTimeout(() => {
      const department = this.selectedDepartment;
      this.selectedDepartment = '1';
      setTimeout(() => this.selectedDepartment = department, 500);
    }, 500);
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
        this.store.dispatch(updateDepartment({ department: this.selectedDepartment }));
        break;
    }
  }

  beautifyCategory(category: string) {
    let str = category.substr(0, 1) + category.substr(1).toLowerCase();
    if (str.includes('_')) {
      let split = str.split('_');
      str = split[0] + ' ' + this.beautifyCategory(split[1].toUpperCase());
    }
    return str;
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
