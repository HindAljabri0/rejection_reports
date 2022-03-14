import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, PageEvent } from '@angular/material';
import { InvoiceSearchModel } from 'src/app/models/contractModels/BillingModels/InvoiceSearchModel';
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
    private sharedServices: SharedServices,
    private contractService: ContractService,
    private adminService: AdminService,
    private dialogService: DialogService,

  ) { }

  departmentList = [];
  doctorList = [];
  invoiceList = [];
  invoiceSearchModel:InvoiceSearchModel;
  invoicesSelectedBill: FormControl = new FormControl();
  invoicesSelectedDepartment: string;
  invoicesSelectedDoctor: string;

  invoicesControllerDepartment: FormControl = new FormControl();
  invoicesControllerDoctor: FormControl = new FormControl();

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

  errors = {
    billNo: "",
    departmentNo: "",
    doctorNo: "",
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

  checkError() {
    let thereIsError = false;

    if (this.invoicesSelectedBill.value == null && this.invoicesSelectedDepartment == null && this.invoicesSelectedDoctor == null) {
      this.errors.billNo = "Please fill atleast one field for Search";
      this.errors.departmentNo = "Please fill atleast one field for Search";
      this.errors.doctorNo = "Please fill atleast one field for Search";
      thereIsError = true;
    }

    if (this.invoicesSelectedBill.value != null && this.invoicesSelectedDepartment != null && this.invoicesSelectedDoctor != null) {
      this.errors.billNo = "Please fill only one field for Search";
      this.errors.departmentNo = "Please fill only one field for Search";
      this.errors.doctorNo = "Please fill only one field for Search";
      thereIsError = true;
    }

    if (this.invoicesSelectedBill.value != null && this.invoicesSelectedDepartment != null && this.invoicesSelectedDoctor == null) {
      this.errors.billNo = "Please fill only one field for Search";
      this.errors.departmentNo = "Please fill only one field for Search";
      thereIsError = true;
    }

    if (this.invoicesSelectedBill.value != null && this.invoicesSelectedDepartment == null && this.invoicesSelectedDoctor != null) {
      this.errors.billNo = "Please fill only one field for Search";
      this.errors.doctorNo = "Please fill only one field for Search";
      thereIsError = true;
    }

    if (this.invoicesSelectedBill.value == null && this.invoicesSelectedDepartment != null && this.invoicesSelectedDoctor != null) {
      this.errors.departmentNo = "Please fill only one field for Search";
      this.errors.doctorNo = "Please fill only one field for Search";
      thereIsError = true;
    }
    return thereIsError;
  }

  searchInvoice(){
    if (this.checkError()) { return }
    this.invoiceSearchModel=new InvoiceSearchModel();

    this.invoiceSearchModel.billNo=this.invoicesSelectedBill.value;
    this.invoiceSearchModel.departmentNo=this.invoicesSelectedDepartment;
    this.invoiceSearchModel.doctorId=this.invoicesSelectedDoctor;

    this.getInvoiceList(this.invoiceSearchModel);

  }


  getInvoiceList(invoiceSearchModelLocal:InvoiceSearchModel) {
    this.contractService.getInvoiceList(invoiceSearchModelLocal,this.sharedServices.providerId).subscribe(event => {
        if (event instanceof HttpResponse) {
            const body = event.body;
            if (body instanceof Array) {
                this.invoiceList = body;
            }else{
              this.dialogService.openMessageDialog({
                title: '',
                message: `No Invoices Found for Search Criteria`,
                isError: true
             });
            }
        }
    }, errorEvent => {
        if (errorEvent instanceof HttpErrorResponse) {

        }
    });
  }

}
