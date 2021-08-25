import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSelect } from '@angular/material';
import { AddEditPreauthorizationItemComponent } from '../add-edit-preauthorization-item/add-edit-preauthorization-item.component';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

@Component({
  selector: 'app-add-preauthorization',
  templateUrl: './add-preauthorization.component.html',
  styles: []
})
export class AddPreauthorizationComponent implements OnInit {

  @ViewChild('practitionerSelect', { static: true }) practitionerSelect: MatSelect;
  practitionerList: any = [];
  filteredPractitioner: ReplaySubject<{ physicianId: { physicianCode: string }, name: string }[]> = new ReplaySubject<{ physicianId: { physicianCode: string }, name: string }[]>(1);
  Practitioner: FormControl = new FormControl();
  selectedPractitioner = '';

  onDestroy = new Subject<void>();

  constructor(private dialog: MatDialog, private adminService: AdminService) {

  }

  ngOnInit() {

    this.getPractitionerList();
  }

  openAddEditItemDialog() {
    this.dialog.open(AddEditPreauthorizationItemComponent, {
      panelClass: ['primary-dialog', 'dialog-xl']
    });
  }

  getPractitionerList() {
    this.adminService.getPractitionerList('601').subscribe(event => {
      if (event instanceof HttpResponse) {
        this.practitionerList = event.body;
        this.filteredPractitioner.next(this.practitionerList.slice());
        this.Practitioner.valueChanges
          .pipe(takeUntil(this.onDestroy))
          .subscribe(() => {
            this.filterPractitioner();
          });
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        console.log(error);
      }
    });
  }

  filterPractitioner() {
    if (!this.practitionerList) {
      return;
    }
    // get the search keyword
    let search = this.Practitioner.value;
    if (!search) {
      this.filteredPractitioner.next(this.practitionerList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the nations
    this.filteredPractitioner.next(
      this.practitionerList.filter(practitioner => practitioner.name.toLowerCase().indexOf(search) > -1)
    );
  }

  setInitialValueOfPractitioner() {
    this.filteredPractitioner
      .pipe(take(1), takeUntil(this.onDestroy))
      .subscribe(() => {
        this.practitionerSelect.compareWith = (
          a: { physicianId: { physicianCode: string }, name: string },
          b: { physicianId: { physicianCode: string }, name: string }) =>
          a && b && a.physicianId.physicianCode === b.physicianId.physicianCode;
      });
  }

}
