import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SharedServices } from 'src/app/services/shared.services';
import { Store } from '@ngrx/store';
import { updatePhysicianId, updatePhysicianName, updatePhysicianCategory, updateDepartment } from '../store/claim.actions';
import { getPhysicianCategory, getDepartments, FieldError, getPhysicianErrors } from '../store/claim.reducer';

@Component({
  selector: 'claim-physician-header',
  templateUrl: './physician.component.html',
  styleUrls: ['./physician.component.css']
})
export class PhysicianComponent implements OnInit {

  physicianNameController: FormControl = new FormControl();
  physicianIdController: FormControl = new FormControl();
  selectedCategery: string;
  selectedDepartment: string;

  categories: any[] = [];
  departments: any[] = [
    {name:'Dental', departmentId: '2'},
    {name:'Optical', departmentId: '20'},
  ];

  errors: FieldError[] = [];

  constructor(private sharedServices: SharedServices, private store: Store) { }

  ngOnInit() {
    this.store.select(getPhysicianErrors).subscribe(errors => this.errors = errors);
    this.store.select(getPhysicianCategory).subscribe(category => this.categories = category);
    if (this.departments.length > 0) {
      this.selectedDepartment = this.departments[0].departmentId;
      this.store.dispatch(updateDepartment({ department: this.departments[0].departmentId }));
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
        this.store.dispatch(updatePhysicianCategory({ physicianCategory: this.selectedCategery }));
        break;
      case 'department':
        this.store.dispatch(updateDepartment({ department: this.selectedDepartment }));
        break;
    }
  }

  beautfyCategory(category:string){
    return category.replace('_', ' ').toLowerCase();
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
