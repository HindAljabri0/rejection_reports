import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, PageEvent } from '@angular/material';
import { classRequest } from 'src/app/models/contractModels/classModels/classRequest';
import { classResponseTemplate } from 'src/app/models/contractModels/classModels/classResponseTemplate';
import { Policy } from 'src/app/models/contractModels/PolicyModels/Policy';
import { PolicySearchModel } from 'src/app/models/contractModels/PolicyModels/PolicySearchModel';
import { ContractClassService } from 'src/app/services/classService/contractClassService.service';
import { PolicyService } from 'src/app/services/policyService/policyService.service';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styles: []
})
export class ClassesComponent implements OnInit {
  policyList: Policy[];
  payersList = [];
  search: classRequest;
  classes: classResponseTemplate[];

  PolicyController: FormControl = new FormControl();
  insuranceCompanyController: FormControl = new FormControl();
  classNameController: FormControl = new FormControl();

  constructor(
    private sharedServices: SharedServices,
    private policyService: PolicyService,
    private beneficiaryService: ProvidersBeneficiariesService,
    private classService: ContractClassService,
    private dialog: MatDialog) { }
  length = 100;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 50, 100];
  showFirstLastButtons = true;
  policyLoad: PolicySearchModel = new PolicySearchModel();


  ngOnInit() {
    this.getPolicyList();
    this.getPayerList();
    this.searchByCriteria();
  }

  handlePageEvent(event: PageEvent) {

    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    localStorage.setItem('pagesize', event.pageSize + '');
    this.searchByCriteria();

  }
  fillSearchData() {
    this.search = new classRequest();
    this.search.insuranceCompCode = this.insuranceCompanyController.value == "0" ? null : this.insuranceCompanyController.value;
    this.search.policyId = this.PolicyController.value == 0 ? null : this.PolicyController.value;
    this.search.className = this.classNameController.value;
    this.search.providerId = this.sharedServices.providerId;
    this.search.page = this.pageIndex;
    this.search.size = this.pageSize;
    this.search.Withpagenation = true;

  }
  /*ResetOthers(value) {
    console.log("value = "+value);
    if (value == 1) {
      this.PolicyController.setValue(null);
      this.insuranceCompanyController.setValue(null);
    } else if (value == 2) {
      
      this.classNameController.setValue("");
      this.PolicyController.setValue(null);
    } else if (value == 3) {
      this.classNameController.setValue("");
      this.insuranceCompanyController.setValue(null);
    }
  }*/
  searchByCriteria() {

    this.fillSearchData();
    this.classService.getClassBySearchParam(this.search).subscribe(event => {
      if (event instanceof HttpResponse) {
        console.log(event.body);
        if (event.body != null && event.body instanceof Array)
          this.classes = event.body;
        //this.length = event.body["totalElements"]
      }
    }
      , err => {

        if (err instanceof HttpErrorResponse) {
          console.log(err.message)
          this.classes = null;
        }
      });
  }
  getPayerList() {
    this.beneficiaryService.getPayers().subscribe(event => {
      if (event instanceof HttpResponse) {
        const body = event.body;
        if (body instanceof Array) {
          this.payersList = body;
        }
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {

      }
    });
  }
  getPolicyList() {
    this.policyLoad.withpagenation = false;
    this.policyLoad.providerId = this.sharedServices.providerId;
    this.policyService.getPolicyBySearchParam(this.policyLoad).subscribe(event => {
      if (event instanceof HttpResponse) {
        console.log(event.body);
        if (event.body != null && event.body instanceof Array)
          this.policyList = event.body;
        //this.length = event.body["totalElements"]
      }
    }
      , err => {

        if (err instanceof HttpErrorResponse) {
          console.log(err.message)
          this.policyList = null;
        }
      });
  }
}
