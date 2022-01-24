import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import { SharedServices } from 'src/app/services/shared.services';
import { ContractService } from 'src/app/services/contractService/contract.service';
import { Contract } from 'src/app/models/contractModels/Contract';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { Department } from 'src/app/models/contractModels/Department';
import { Service_List } from 'src/app/models/contractModels/Service_List';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { ContractTemplate } from 'src/app/models/contractModels/ContractTemplate';
import { MatSelectChange } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractSearchModel } from 'src/app/models/contractModels/ContractSearchModel';

@Component({
  selector: 'app-add-edit-view-contract',
  templateUrl: './add-edit-view-contract.component.html',
  styles: []
})
export class AddEditViewContractComponent implements OnInit {
  payersList = [];
  departments: Department[];
  services: Service_List[];
  contract: Contract;
  contractTemplate: ContractTemplate;
  contractToEdit: ContractTemplate[];

  addMode: boolean = false;
  EditMode: boolean = false;

  messageError = "";
  InsCompName = "";
  param: ContractSearchModel = new ContractSearchModel();


  d = new Date();
  oneyear = this.d.setDate(this.d.getDate() + 364);
  InsCompCodeController: FormControl = new FormControl();
  ContractIdController: FormControl = new FormControl();
  ContractNoController: FormControl = new FormControl();
  ContractNameController: FormControl = new FormControl();
  StartDateController: FormControl = new FormControl(new Date());
  EndDateController: FormControl = new FormControl(this.d);
  IsActiveController: FormControl = new FormControl(true);

  _departments: {
    departmentId: number,
    departmentName: string,
    discountController: FormControl,
    discountTypeController: FormControl
  }[] = [];
  _services: {
    serviceId: number,
    serviceName: string,
    serviceCode: string,
    InsServiceCode: FormControl,
    InsServiceName: FormControl,
    departmentId: number,
    cashAmount: number,
    discountAmountController: FormControl,
    discountTypeController: FormControl,
    NetAmount: number,
    discountAmount: number,
    IsCovered: FormControl,
    NeedApproval: FormControl
  }[] = [];

  errors = {
    contractNo: "",
    contractName: "",
    InsCompCode: "",
    StartDate: "",
    EndDate: "",
    departments: "",
    services: "",
    serviceCodes: "",
    serviceNames: ""
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sharedServices: SharedServices,
    private contractService: ContractService,
    private beneficiaryService: ProvidersBeneficiariesService,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.getPayerList();

    this.param.contractId = this.activatedRoute.snapshot.paramMap.get("contractId")
    var url = this.router.url;
    //console.log("Contract Id= "+this.param.contractId);

    if (url.endsWith('add') || this.param.contractId == null) {
      this.addMode = true;
      this.fillData();
    }
    else {
      this.getContract(this.param)
      this.EditMode = true;

    }
  }
  fillEditData(result) {
    //console.log(result);
    let template = result;
    let contract = template.contract;
    this.departments = template.departments.map(dep => ({
      departmentId: dep.departmentId,
      departmentName: dep.departmentName,
      providerId: this.sharedServices.providerId,
      insCompCode: this.InsCompCodeController.value,
      discountType: dep.discountType,
      discountAmount: dep.discountAmount
    }));

    this.SetDepartmentData();

    this.services = template.services.map(serv => ({
      serviceId: serv.serviceId,
      serviceName: serv.serviceName,
      serviceCode: serv.serviceCode,
      departmentId: serv.departmentId,
      insServiceCode: serv.insServiceCode,
      cashAmount: serv.cashAmount,
      insServiceName: serv.insServiceName,
      providerId: this.sharedServices.providerId,
      insDiscountType: serv.insDiscountType,
      insDiscountAmount: serv.insDiscountAmount,
      needApproval: serv.needApproval == 'Y' ? true : false,
      isCovered: serv.isCovered == 'Y' ? true : false,
      netAmount: serv.netAmount
    }));
    this.SetServices();
    this.ContractIdController.setValue(contract.contractId);
    this.ContractNoController.setValue(contract.contractNo);
    this.ContractNameController.setValue(contract.contractName);
    this.InsCompCodeController.setValue(contract.insCompCode);
    this.InsCompName = contract.insCompanyName;
    this.StartDateController.setValue(contract.startDate);
    this.EndDateController.setValue(contract.endDate);
    this.IsActiveController.setValue(contract.isActive == 'Y' ? true : false);

  }
  getContract(param) {
    this.contractService.getContractById(param).subscribe(event => {
      if (event instanceof HttpResponse) {
        const body = event.body;
        if (body instanceof Array) {
          this.contractToEdit = body;
          this.fillEditData(body[0]);
          //console.log(this.contractToEdit);
        }
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {

      }
    });
  }
  fillData() {
    if (this.addMode) {
      this.contractService.getDeparmentsByProviderId(this.sharedServices.providerId).subscribe(event => {
        if (event instanceof HttpResponse) {
          console.log(event.body);
          if (event.body != null && event.body instanceof Array) {
            this.departments = event.body;
            this.SetDepartmentData();
          }
          //this.length = event.body["totalElements"]
        }
      }
        , err => {

          if (err instanceof HttpErrorResponse) {
            console.log(err.message)
            this.departments = null;
          }
        });
      this.contractService.getServiceByProviderId(this.sharedServices.providerId).subscribe(event => {
        if (event instanceof HttpResponse) {
          console.log(event.body);
          if (event.body != null && event.body instanceof Array) {
            this.services = event.body;
            this.SetServices();
          }
          //this.length = event.body["totalElements"]
        }
      }
        , err => {

          if (err instanceof HttpErrorResponse) {
            console.log(err.message)
            this.services = null;
          }
        });
    }
  }
  SetDepartmentData() {
    //console.log(this.departments);
    for (let dept of this.departments) {
      this._departments.push(
        {
          departmentId: dept.departmentId,
          departmentName: dept.departmentName,
          discountController: new FormControl(dept.discountAmount),
          discountTypeController: new FormControl(dept.discountType == null ? "SR" : dept.discountType)
        }
      )
    }
  }
  SetServices() {
    for (let service of this.services) {
      this._services.push(
        {
          serviceId: service.serviceId,
          serviceName: service.serviceName,
          serviceCode: service.serviceCode,
          InsServiceCode: new FormControl(service.insServiceCode),
          InsServiceName: new FormControl(service.insServiceName),
          departmentId: service.departmentId,
          cashAmount: service.cashAmount,
          discountAmountController: new FormControl(service.insDiscountAmount),
          discountTypeController: new FormControl(service.insDiscountType),
          discountAmount: service.cashAmount - service.netAmount,
          NetAmount: service.netAmount,
          NeedApproval: new FormControl(service.needApproval ? true : false),
          IsCovered: new FormControl(service.isCovered ? true : false)
        }
      )
    }
  }
  changeAmount(e, serviceId) {
    /*this._services.filter(x=>x.serviceId) =*/
    //console.log("Discount Amount = "+ e.target.value);
    this.ApplySingleDiscount(serviceId, null);
  }
  changeType(e, serviceId) {
    //this._services.filter(s=>s.serviceId == serviceId);
    //console.log("Discount Type = "+e.value + " service Id = "+serviceId);
    this.ApplySingleDiscount(serviceId, e.value);
  }
  ApplySingleDiscount(serviceId, type) {

    for (let service of this._services) {
      //type == null? service.discountTypeController.value : type;
      if (serviceId == service.serviceId) {
        console.log(type);
        service.discountAmount = (type != null && type == "SR" ? service.discountAmountController.value : (service.cashAmount * service.discountAmountController.value / 100));
        service.NetAmount = service.cashAmount - service.discountAmount;//(service.discountTypeController.value != null && service.discountTypeController.value == "SR" ? service.discountAmountController.value : (service.cashAmount * service.discountAmountController.value / 100));
      }
    }
  }
  ApplyDiscount() {

    for (let dept of this._departments) {
      //console.log("deptId = " + dept.departmentId + " dept discount = " + dept.discountController.value + " dept disocunt type = " + dept.discountTypeController.value);
      if (dept.discountController.value != null) {
        for (let service of this._services) {
          if (service.departmentId == dept.departmentId) {
            service.discountTypeController.setValue(dept.discountTypeController.value);
            service.InsServiceCode.setValue(service.serviceCode);
            service.InsServiceName.setValue(service.serviceName);
            service.discountAmountController.setValue(dept.discountController.value);
            service.discountAmount = (dept.discountTypeController.value != null && dept.discountTypeController.value == "SR" ? dept.discountController.value : (service.cashAmount * dept.discountController.value / 100));
            service.NetAmount = service.cashAmount - (dept.discountTypeController.value != null && dept.discountTypeController.value == "SR" ? dept.discountController.value : (service.cashAmount * dept.discountController.value / 100));
            service.IsCovered.setValue(true);
          }
        }
      }
    }
  }
  checkError() {
    let thereIsError = false;
    this.errors.contractNo = "";
    this.errors.contractName = "";
    this.errors.StartDate = "";
    this.errors.EndDate = "";
    this.errors.InsCompCode = "";

    if (this.InsCompCodeController == null || this.InsCompCodeController.value == null) {
      this.errors.InsCompCode = "Insurance Company must be specified"
      thereIsError = true;
    }
    if (this.ContractNoController == null || this.ContractNoController.value == null) {
      this.errors.contractNo = "Contract No must be specified"
      thereIsError = true;
    }
    if (this.ContractNameController == null || this.ContractNameController.value == null) {
      this.errors.contractName = "Contract Name must be specified"
      thereIsError = true;
    }

    if (this.StartDateController == null) {
      this.errors.StartDate = "Start Date must be specified"
      thereIsError = true;
    }
    if (this.EndDateController == null) {
      this.errors.EndDate = "End Date must be specified"
      thereIsError = true;
    }
    if (this.EndDateController != null && this.StartDateController != null && this.StartDateController.value > this.EndDateController.value) {
      this.errors.EndDate = "End Date must be greater than start date"
      thereIsError = true;
    }
    if (this._departments != null && this._departments.filter(function (obj) {
      return obj.discountController.value != null;
    }).length == 0) {
      this.errors.departments = "You must Enter At least one discount value for Department"
      thereIsError = true;
    }
    if (this._services != null && this._services.filter(function (obj) {
      return obj.discountAmountController.value != null;
    }).length == 0) {
      this.errors.services = "You must Enter At least one discount value for service"
      thereIsError = true;
    }
    if (this._services != null && this._services.filter(function (obj) {
      return obj.InsServiceCode.value != null;
    }).length == 0) {
      this.errors.serviceCodes = "You must Enter Insurance Service Code for service"
      thereIsError = true;
    }
    if (this._services != null && this._services.filter(function (obj) {
      return obj.InsServiceCode.value != null;
    }).length == 0) {
      this.errors.serviceNames = "You must Enter Insurance Service Name for service"
      thereIsError = true;
    }
    return thereIsError;

  }
  selectedValue(event: MatSelectChange) {
    this.InsCompName = event.source.triggerValue;

    //console.log(this.InsCompName);
  }
  SaveData() {


    if (this.checkError()) { return }
    this.contractTemplate = new ContractTemplate();
    this.contract = new Contract();
    this.contract.contractId = this.addMode ? 0 : this.ContractIdController.value;
    this.contract.contractNo = this.ContractNoController.value;
    this.contract.contractName = this.ContractNameController.value;
    this.contract.startDate = this.StartDateController.value;
    this.contract.endDate = this.EndDateController.value;
    this.contract.isActive = this.IsActiveController.value ? "Y" : "N";
    this.contract.providerId = this.sharedServices.providerId;
    this.contract.insCompCode = this.InsCompCodeController.value;
    this.contract.insCompanyName = this.InsCompName;
    //Set Tamplate Data
    this.contractTemplate.contract = this.contract;

    this.contractTemplate.departments = this._departments.filter(function (obj) {
      return obj.discountController.value != null;
    }).map(dep => ({
      departmentId: dep.departmentId,
      providerId: this.sharedServices.providerId,
      insCompCode: this.InsCompCodeController.value,
      discountType: dep.discountTypeController.value,
      discountAmount: dep.discountController.value
    }));

    this.contractTemplate.services = this._services.filter(function (obj) {
      return obj.discountAmountController.value != null;
    }).map(service => ({

      serviceId: service.serviceId,
      insDiscountAmount: service.discountAmountController.value,
      netAmount: service.NetAmount,
      insServiceCode: service.InsServiceCode.value,
      insServiceName: service.InsServiceName.value,
      providerId: this.sharedServices.providerId,
      insDiscountType: service.discountTypeController.value,
      needApproval: service.NeedApproval.value ? "Y" : "N",
      isCovered: service.IsCovered.value ? "Y" : "N",

    }));
    //End of set data
    //console.log(JSON.stringify(this.contractTemplate));

    this.contractService.ManipulateContract(this.contractTemplate).subscribe(event => {
      if (event instanceof HttpResponse) {
        console.log(event.body);
        if (event.body != null) {
          this.dialogService.openMessageDialog({
            title: '',
            message: `Contract Saved successfully`,
            isError: false
          }).subscribe(event => { window.location.reload(); });
          this.sharedServices.loadingChanged.next(false);
        }
      }
    }
      , err => {

        if (err instanceof HttpErrorResponse) {
          if (err.status == 500) {
            this.messageError = "could not reach server Please try again later "

          } else {
            this.messageError = err.message;
          }

          this.dialogService.openMessageDialog({
            title: '',

            message: this.messageError,
            isError: true
          });
          this.sharedServices.loadingChanged.next(false);
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

}
