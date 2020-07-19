import { Component, OnInit, ViewChild } from '@angular/core';
import { Invoice } from '../models/invoice.model';
import { FieldError, getInvoicesErrors, getSelectedPayer, getClaimType, getVisitDate, getSelectedTab, getDepartments } from '../store/claim.reducer';
import { Store } from '@ngrx/store';
import { updateClaimDate, updateInvoices_Services, selectGDPN, saveInvoices_Services } from '../store/claim.actions';
import { FormControl } from '@angular/forms';
import { Service } from '../models/service.model';
import { HttpResponse } from '@angular/common/http';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { SharedServices } from 'src/app/services/shared.services';
import { Actions, ofType } from '@ngrx/effects';
import { MatMenuTrigger } from '@angular/material';

@Component({
  selector: 'claim-invoices-services',
  templateUrl: './invoices-services.component.html',
  styleUrls: ['./invoices-services.component.css']
})
export class InvoicesServicesComponent implements OnInit {

  controllers: {
    invoice: Invoice,
    invoiceNumber: FormControl,
    invoiceDate: FormControl,
    services: {
      serviceDate: FormControl,
      serviceCode: FormControl,
      serviceDescription: FormControl,
      unitPrice: FormControl,
      quntity: FormControl,
      patientShare: FormControl,
      serviceDiscount: FormControl,
      serviceDiscountUnit: 'SAR' | 'PERCENT';
      toothNumber: FormControl,
      netVatRate: FormControl,
      patientShareVatRate: FormControl
    }[]
  }[] = [];
  expandedInvoice = -1;
  expandedService = -1;

  priceListExist: boolean = true;
  servicesOptions: string[] = [];
  searchServicesController: FormControl = new FormControl();
  payerId: string;

  claimType: string;
  visitDate: Date;
  toothNumbers: string[] = [];
  departments: any[] = [];

  errors: FieldError[] = [];

  constructor(private store: Store, private actions: Actions, private adminService: AdminService, private sharedServices: SharedServices) { }

  ngOnInit() {
    this.store.select(getInvoicesErrors).subscribe(errors => this.errors = errors);
    this.store.select(getClaimType).subscribe(type => {
      this.claimType = type;
      if (type == '2') {
        this.initToothNumbers();
      }
    });
    this.store.select(getVisitDate).subscribe(date => this.visitDate = date);
    this.store.select(getSelectedPayer).subscribe(payerId => {
      this.payerId = payerId
      this.priceListExist = true;
      this.searchServicesController.setValue('');
    });
    this.expandedInvoice = 0;
    this.expandedService = 0;

    this.store.select(getSelectedTab).subscribe(index => {
      if (index == 3) {
        this.store.dispatch(selectGDPN({ invoiceIndex: this.expandedInvoice, serviceIndex: this.expandedService }));
      } else {
        this.store.dispatch(selectGDPN({}));
      }
    });

    this.store.select(getDepartments).subscribe(departments => {
      this.departments = departments;
      this.addInvoice();
    }).unsubscribe();

    this.actions.pipe(
      ofType(saveInvoices_Services)
    ).subscribe(() => { if (this.expandedInvoice != -1) this.createInvoiceFromControl(this.expandedInvoice) });
  }

  addInvoice() {
    this.controllers.push({ invoice: new Invoice(), invoiceDate: new FormControl(), invoiceNumber: new FormControl(), services: [] });
    if (this.departments.length > 0) {
      this.controllers[this.controllers.length - 1].invoice.invoiceDepartment = `${this.departments[0].departmentId}`;
    }
    this.addService(this.controllers.length - 1);
  }

  addService(invoiceIndex) {
    this.controllers[invoiceIndex].services.push({
      serviceDate: new FormControl(),
      serviceCode: new FormControl(),
      serviceDescription: new FormControl(),
      unitPrice: new FormControl(0),
      quntity: new FormControl(0),
      patientShare: new FormControl(0),
      serviceDiscount: new FormControl(0),
      serviceDiscountUnit: 'PERCENT',
      toothNumber: new FormControl(this.toothNumbers.length > 0? this.toothNumbers[0]:null),
      netVatRate: new FormControl(0),
      patientShareVatRate: new FormControl(0)
    });
    this.updateClaim();
  }

  afterInvoiceExpanded(i: number) {
    this.expandedInvoice = i;
    this.store.dispatch(selectGDPN({ invoiceIndex: this.expandedInvoice, serviceIndex: this.expandedService }));
  }

  afterServiceExpanded(j: number) {
    this.expandedService = j;
    this.store.dispatch(selectGDPN({ invoiceIndex: this.expandedInvoice, serviceIndex: this.expandedService }));
  }

  afterInvoiceCollapse(i: number) {
    this.expandedInvoice = -1;
    this.expandedService = -1;
    this.createInvoiceFromControl(i);
    this.store.dispatch(selectGDPN({ invoiceIndex: this.expandedInvoice, serviceIndex: this.expandedService }));
  }

  afterServiceCollapse(invoiceIndex, serviceIndex) {
    this.expandedService = -1
    this.store.dispatch(selectGDPN({ invoiceIndex: this.expandedInvoice, serviceIndex: this.expandedService }));
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


  createInvoiceFromControl(i: number) {
    let invoice: Invoice = new Invoice();
    invoice.invoiceNumber = this.controllers[i].invoiceNumber.value;
    invoice.invoiceDate = this.controllers[i].invoiceDate.value == null ? null:new Date(this.controllers[i].invoiceDate.value);
    invoice.invoiceDepartment = this.controllers[i].invoice.invoiceDepartment;
    
    invoice.service = this.controllers[i].services.map((service) => this.createServiceFromControl(service));
    let GDPN = invoice.invoiceGDPN;
    GDPN.discount.value = invoice.service.map(service => {
      if(service.serviceGDPN.discount.type == 'PERCENT'){
        let discount = (service.serviceGDPN.gross.value - service.serviceGDPN.patientShare.value) * (service.serviceGDPN.discount.value / 100);
        discount = Number.parseFloat(discount.toPrecision(discount.toFixed().length + 2));
        return discount;
      } else return service.serviceGDPN.discount.value;
    }).reduce((pre, cur) => pre + cur);
    GDPN.discount.type = "SAR";
    GDPN.gross.value = invoice.service.map(service => service.serviceGDPN.gross.value).reduce((pre, cur) => pre + cur);
    GDPN.net.value = invoice.service.map(service => service.serviceGDPN.net.value).reduce((pre, cur) => pre + cur);
    GDPN.netVATamount.value = invoice.service.map(service => service.serviceGDPN.netVATamount.value).reduce((pre, cur) => pre + cur);
    GDPN.netVATrate.value = invoice.service.map(service => service.serviceGDPN.netVATrate.value).reduce((pre, cur) => pre + cur);
    GDPN.patientShare.value = invoice.service.map(service => service.serviceGDPN.patientShare.value).reduce((pre, cur) => pre + cur);
    GDPN.patientShareVATamount.value = invoice.service.map(service => service.serviceGDPN.patientShareVATamount.value).reduce((pre, cur) => pre + cur);
    GDPN.patientShareVATrate.value = invoice.service.map(service => service.serviceGDPN.patientShareVATrate.value).reduce((pre, cur) => pre + cur);
    this.controllers[i].invoice = invoice;
    this.updateClaim();
  }

  createServiceFromControl(service) {
    let gross = service.unitPrice.value * service.quntity.value;
    gross = Number.parseFloat(gross.toPrecision(gross.toFixed().length + 2));
    let net = gross - service.patientShare.value;
    if (service.serviceDiscountUnit == 'PERCENT') {
      net -= (net * (service.serviceDiscount.value / 100));
    } else {
      net -= service.serviceDiscount.value;
    }
    net = Number.parseFloat(net.toPrecision(net.toFixed().length + 2));
    let netVat = (net * (service.netVatRate.value / 100));
    netVat = Number.parseFloat(netVat.toPrecision(netVat.toFixed().length + 2));
    let patientShareVATamount = (service.patientShare.value * (service.patientShareVatRate.value / 100));
    patientShareVATamount = Number.parseFloat(patientShareVATamount.toPrecision(patientShareVATamount.toFixed().length + 2));
    let newService: Service = {
      serviceType: 'NA',
      serviceDate: service.serviceDate.value == null? null:new Date(service.serviceDate.value),
      serviceCode: service.serviceCode.value,
      serviceDescription: service.serviceDescription.value,
      unitPrice: {value: service.unitPrice.value, type:'SAR'},
      requestedQuantity: service.quntity.value,
      toothNumber: service.toothNumber.value,
      serviceGDPN: {
        patientShare: { value: service.patientShare.value, type: 'SAR' },
        discount: { value: service.serviceDiscount.value, type: service.serviceDiscountUnit },
        netVATrate: { value: service.netVatRate.value, type: 'PERCENT' },
        patientShareVATrate: { value: service.patientShareVatRate.value, type: 'PERCENT' },
        gross: { value: gross, type: 'SAR' },
        net: { value: net, type: 'SAR' },
        netVATamount: { value: netVat, type: 'SAR' },
        patientShareVATamount: { value: patientShareVATamount, type: 'SAR' },

      },
    };
    return newService;
  }

  updateInvoiceDepartment(i, event) {
    this.controllers[i].invoice = { ...this.controllers[i].invoice, invoiceDepartment: event.target.value };
  }

  updateServiceToothNumber(i, j, event){
    this.controllers[i].services[j].toothNumber.setValue(event.target.value);

  }

  updateClaim() {
    this.store.dispatch(updateInvoices_Services({ invoices: this.controllers.map(control => control.invoice) }));
  }


  onAddAnathorInvoiceClick(event, index) {
    event.stopPropagation();
    this.afterInvoiceCollapse(index);
    this.onAddInvoiceClick();
  }

  onAddAnathorServiceClick(event, invoiceIndex, serviceIndex) {
    event.stopPropagation();
    this.afterServiceCollapse(invoiceIndex, serviceIndex);
    this.onAddServiceClick(invoiceIndex);
  }

  onAddInvoiceClick() {
    this.addInvoice();
    this.expandedInvoice = this.controllers.length - 1;
    this.expandedService = 0;
    this.store.dispatch(selectGDPN({ invoiceIndex: this.expandedInvoice, serviceIndex: this.expandedService }));
  }

  onAddServiceClick(invoiceIndex) {
    this.addService(invoiceIndex);
    this.expandedService = this.controllers[invoiceIndex].services.length - 1;
    this.store.dispatch(selectGDPN({ invoiceIndex: this.expandedInvoice, serviceIndex: this.expandedService }));
  }

  onDeleteInvoiceClick(event, i) {
    event.stopPropagation();
    this.controllers.splice(i, 1);
    this.updateClaim();
  }

  onDeleteServiceClick(event, i, j) {
    event.stopPropagation();
    this.controllers[i].services.splice(j, 1);
    this.createInvoiceFromControl(i);
  }

  searchServices() {
    this.servicesOptions = [];
    let query: string = this.searchServicesController.value;
    if (query != null && query != '')
      this.adminService.searchSeviceCode(query.toUpperCase(), this.sharedServices.providerId, this.payerId).subscribe(
        event => {
          if (event instanceof HttpResponse) {
            if (event.body instanceof Object) {
              // this.priceListExist = event.body['content'].length > 0;
              Object.keys(event.body['content']).forEach(key => {
                this.servicesOptions.push(`${event.body['content'][key]["code"]} | ${event.body['content'][key]["description"]}`.toUpperCase())
              });
            }
          }
        }
      );
  }

  selectService(option:string) {
    let code = option.split('|')[0];
    let des = option.split('|')[1];
    this.controllers[this.expandedInvoice].services[this.expandedService].serviceCode.setValue(code.trim());
    this.controllers[this.expandedInvoice].services[this.expandedService].serviceDescription.setValue(des);
    this.searchServicesController.setValue('');
  }

  initToothNumbers() {
    this.toothNumbers.push('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T');
    for (let i = 0; i <= 85; i++) {
      this.toothNumbers.push(`${i}`);
    }
  }

  invoiceHasErrors(index){
    return this.errors.findIndex(error => error.fieldName.split(':')[1] == index) != -1;
  }

  serviceHasErrors(invoiceIndex, serviceIndex){
    return this.errors.findIndex(error => error.fieldName.includes(`:${invoiceIndex}:${serviceIndex}`)) != -1;
  }

}
