import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, PageEvent } from '@angular/material';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { ContractService } from 'src/app/services/contractService/contract.service';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: []
})
export class InvoicesComponent implements OnInit {

  constructor(        
    private dialog: MatDialog,
    private sharedServices: SharedServices,
    private contractService: ContractService,
    private adminService: AdminService,
    private providerNphiesSearchService: ProviderNphiesSearchService,
    private dialogService: DialogService
  ) { }

  departmentList = [];
  doctorList = [];
  invoiceList = [];
  invoicesSelectedDepartment: string;
  invoicesSelectedBill: string;
  invoicesSelectedDoctor: string;

  invoicesControllerDepartment: FormControl = new FormControl();
  invoicesControllerDoctor: FormControl = new FormControl();
  invoicesControllerBill: FormControl = new FormControl();

  length = 100;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 50, 100];
  showFirstLastButtons = true;

  handlePageEvent(event: PageEvent) {

    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;

    localStorage.setItem('pagesize', event.pageSize + '');

}

  ngOnInit() {
    this.getDepartmentList();
    this.getDoctorList();
  }

  getDepartmentList() {
    this.contractService.getDeparmentsByProviderId(this.sharedServices.providerId).subscribe(event => {
        if (event instanceof HttpResponse) {
            const body = event.body;
            if (body instanceof Array) {
                this.departmentList = body;
            }
        }
    }, errorEvent => {
        if (errorEvent instanceof HttpErrorResponse) {

        }
    });
  }

  getDoctorList() {
  this.adminService.getPractitionerList(this.sharedServices.providerId).subscribe(event => {
      if (event instanceof HttpResponse) {
          const body = event.body;
          if (body instanceof Array) {
              this.doctorList = body;
          }
      }
  }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {

      }
  });
  }

}
