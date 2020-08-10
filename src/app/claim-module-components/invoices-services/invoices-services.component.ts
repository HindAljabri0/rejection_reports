import { Component, OnInit } from '@angular/core';
import { Invoice } from '../models/invoice.model';
import { FieldError, getInvoicesErrors, getSelectedPayer, getClaimType, getVisitDate, getSelectedTab, getDepartments, getIsRetrievedClaim as getIsRetrievedClaim } from '../store/claim.reducer';
import { Store } from '@ngrx/store';
import { updateInvoices_Services, selectGDPN, saveInvoices_Services, openSelectServiceDialog, addRetrievedServices, makeRetrievedServiceUnused } from '../store/claim.actions';
import { FormControl } from '@angular/forms';
import { Service } from '../models/service.model';
import { HttpResponse } from '@angular/common/http';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { SharedServices } from 'src/app/services/shared.services';
import { Actions, ofType } from '@ngrx/effects';
import { DatePipe } from '@angular/common';
import { ServiceDecision } from '../models/serviceDecision.model';

@Component({
  selector: 'claim-invoices-services',
  templateUrl: './invoices-services.component.html',
  styleUrls: ['./invoices-services.component.css']
})
export class InvoicesServicesComponent implements OnInit {

  isRetrievedClaim: boolean = false;

  controllers: {
    invoice: Invoice,
    invoiceNumber: FormControl,
    invoiceDate: FormControl,
    services: {
      retrieved: boolean,
      serviceNumber: number,
      serviceDate: FormControl,
      serviceCode: FormControl,
      serviceDescription: FormControl,
      unitPrice: FormControl,
      quantity: FormControl,
      patientShare: FormControl,
      serviceDiscount: FormControl,
      serviceDiscountUnit: 'SAR' | 'PERCENT';
      toothNumber: FormControl,
      netVatRate: FormControl,
      patientShareVatRate: FormControl,
      priceCorrection: number,
      rejection: number
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

  constructor(private store: Store, private actions: Actions, private adminService: AdminService, private sharedServices: SharedServices, private datePipe: DatePipe) { }

  ngOnInit() {
    this.store.select(getIsRetrievedClaim).subscribe(isRetrieved => this.isRetrievedClaim = isRetrieved);
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
        this.store.dispatch(selectGDPN({ invoiceIndex: this.expandedInvoice }));
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

    this.actions.pipe(ofType(addRetrievedServices)).subscribe(data => {
      if (data.serviceIndex != null) {
        const service = data.services[0].service;
        const decision = data.services[0].decision;
        this.editService(service, decision, data.invoiceIndex, data.serviceIndex);
      } else {
        data.services.forEach(s => {
          this.addService(data.invoiceIndex);
          this.editService(s.service, s.decision, data.invoiceIndex, this.controllers[data.invoiceIndex].services.length - 1);
        });
      }
    });
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
      retrieved: false,
      serviceNumber: null,
      serviceDate: new FormControl(),
      serviceCode: new FormControl(),
      serviceDescription: new FormControl(),
      unitPrice: new FormControl(0),
      quantity: new FormControl(0),
      patientShare: new FormControl(0),
      serviceDiscount: new FormControl(0),
      serviceDiscountUnit: 'PERCENT',
      toothNumber: new FormControl(this.toothNumbers.length > 0 ? this.toothNumbers[0] : null),
      netVatRate: new FormControl(0),
      patientShareVatRate: new FormControl(0),
      priceCorrection: 0,
      rejection: 0
    });
    this.updateClaim();
  }

  editService(service: Service, decision: ServiceDecision, i: number, j: number) {
    this.controllers[i].services[j].retrieved = true;
    this.controllers[i].services[j].serviceNumber = service.serviceNumber;
    this.controllers[i].services[j].serviceDate.setValue(this.datePipe.transform(service.serviceDate, 'yyyy-MM-dd'));
    this.controllers[i].services[j].serviceDate.disable({ onlySelf: true });
    this.controllers[i].services[j].serviceCode.setValue(service.serviceCode);
    this.controllers[i].services[j].serviceCode.disable({ onlySelf: true });
    this.controllers[i].services[j].serviceDescription.setValue(service.serviceDescription);
    this.controllers[i].services[j].serviceDescription.disable({ onlySelf: true });
    this.controllers[i].services[j].unitPrice.setValue(decision.unitPrice.value);
    this.controllers[i].services[j].unitPrice.disable({ onlySelf: true });
    this.controllers[i].services[j].quantity.setValue(decision.approvedQuantity);
    this.controllers[i].services[j].quantity.disable({ onlySelf: true });
    this.controllers[i].services[j].patientShare.setValue(service.serviceGDPN.patientShare.value);
    this.controllers[i].services[j].serviceDiscount.setValue(service.serviceGDPN.discount.value);
    this.controllers[i].services[j].serviceDiscountUnit = service.serviceGDPN.discount.type == 'PERCENT' ? 'PERCENT' : 'SAR';
    this.controllers[i].services[j].toothNumber.setValue(service.toothNumber);
    if (service.toothNumber != null)
      this.controllers[i].services[j].toothNumber.disable({ onlySelf: true });
    this.controllers[i].services[j].netVatRate.setValue(service.serviceGDPN.netVATrate.value);
    this.controllers[i].services[j].patientShareVatRate.setValue(service.serviceGDPN.patientShareVATrate.value);
    this.controllers[i].services[j].priceCorrection = decision.serviceGDPN.priceCorrection.value;
    this.controllers[i].services[j].rejection = decision.serviceGDPN.rejection.value;
    this.createInvoiceFromControl(i);
  }

  afterInvoiceExpanded(i: number) {
    this.expandedInvoice = i;
    this.store.dispatch(selectGDPN({ invoiceIndex: this.expandedInvoice }));
  }

  afterServiceExpanded(j: number) {
    this.expandedService = j;
    this.store.dispatch(selectGDPN({ invoiceIndex: this.expandedInvoice }));
  }

  afterInvoiceCollapse(i: number) {
    this.expandedInvoice = -1;
    this.expandedService = -1;
    this.createInvoiceFromControl(i);
    this.store.dispatch(selectGDPN({ invoiceIndex: this.expandedInvoice }));
  }

  afterServiceCollapse(invoiceIndex, serviceIndex) {
    this.expandedService = -1
    this.store.dispatch(selectGDPN({ invoiceIndex: this.expandedInvoice }));
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
    invoice.invoiceDate = this.controllers[i].invoiceDate.value == null ? null : new Date(this.controllers[i].invoiceDate.value);
    invoice.invoiceDepartment = this.controllers[i].invoice.invoiceDepartment;

    invoice.service = this.controllers[i].services.map((service) => this.createServiceFromControl(service));
    let GDPN = invoice.invoiceGDPN;
    GDPN.discount.value = invoice.service.map(service => {
      if (service.serviceGDPN.discount.type == 'PERCENT') {
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
    let gross = this.calcGross(service);
    let net = this.calcNet(service, gross);
    let netVat = this.calcNetVat(service, net);
    let patientShareVATamount = this.calcPatientVatRate(service);
    let newService: Service = {
      serviceType: 'N/A',
      serviceDate: service.serviceDate.value == null ? null : new Date(service.serviceDate.value),
      serviceCode: service.serviceCode.value,
      serviceDescription: service.serviceDescription.value,
      unitPrice: { value: service.unitPrice.value, type: 'SAR' },
      requestedQuantity: service.quantity.value,
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

  calcGross(service){
    let gross = service.unitPrice.value * service.quantity.value;
    gross = Number.parseFloat(gross.toPrecision(gross.toFixed().length + 2));
    return gross;
  }

  calcNet(service, gross?){
    if(gross == null) gross = this.calcGross(service);
    let net = gross - service.patientShare.value;
    if (service.serviceDiscountUnit == 'PERCENT') {
      net -= (net * (service.serviceDiscount.value / 100));
    } else {
      net -= service.serviceDiscount.value;
    }
    net += service.priceCorrection;
    net -= service.rejection;
    net = Number.parseFloat(net.toPrecision(net.toFixed().length + 2));
    return net;
  }

  calcNetVat(service, net?){
    if(net == null) net = this.calcNet(service);
    let netVat = (net * (service.netVatRate.value / 100));
    netVat = Number.parseFloat(netVat.toPrecision(netVat.toFixed().length + 2));
    return netVat;
  }

  calcPatientVatRate(service){
    let patientShareVATamount = (service.patientShare.value * (service.patientShareVatRate.value / 100));
    patientShareVATamount = Number.parseFloat(patientShareVATamount.toPrecision(patientShareVATamount.toFixed().length + 2));
    return patientShareVATamount;
  }

  updateInvoiceDepartment(i, event) {
    this.controllers[i].invoice = { ...this.controllers[i].invoice, invoiceDepartment: event.target.value };
  }

  updateServiceToothNumber(i, j, event) {
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

  onSelectRetrievedServiceClick(event, invoiceIndex, serviceIndex) {
    event.stopPropagation();
    this.createInvoiceFromControl(this.expandedInvoice);
    this.store.dispatch(openSelectServiceDialog({
      invoiceIndex: invoiceIndex,
      invoiceNumber: this.controllers[invoiceIndex].invoiceNumber.value,
      invoiceDate: this.controllers[invoiceIndex].invoiceDate.value != null ? new Date(this.controllers[invoiceIndex].invoiceDate.value) : null,
      serviceIndex: serviceIndex,
    }));
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
    this.store.dispatch(selectGDPN({ invoiceIndex: this.expandedInvoice }));
  }

  onAddRetrievedServiceClick(invoiceIndex) {
    this.createInvoiceFromControl(this.expandedInvoice);
    this.store.dispatch(openSelectServiceDialog({
      invoiceIndex: invoiceIndex,
      invoiceNumber: this.controllers[invoiceIndex].invoiceNumber.value,
      invoiceDate: this.controllers[invoiceIndex].invoiceDate.value != null ? new Date(this.controllers[invoiceIndex].invoiceDate.value) : null,
      serviceIndex: -1,
    }));
  }

  onAddServiceClick(invoiceIndex) {
    this.addService(invoiceIndex);
    this.expandedService = this.controllers[invoiceIndex].services.length - 1;
    this.store.dispatch(selectGDPN({ invoiceIndex: this.expandedInvoice }));
  }

  onDeleteInvoiceClick(event, i) {
    event.stopPropagation();
    this.controllers[i].services.forEach(s => {
      if (s.retrieved) {
        this.store.dispatch(makeRetrievedServiceUnused({ serviceNumber: s.serviceNumber }));
      }
    });
    this.controllers.splice(i, 1);
    this.updateClaim();
  }

  onDeleteServiceClick(event, i, j) {
    event.stopPropagation();
    if (this.controllers[i].services[j].retrieved) {
      this.store.dispatch(makeRetrievedServiceUnused({ serviceNumber: this.controllers[i].services[j].serviceNumber }));
    }
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

  selectService(option: string) {
    let code = option.split('|')[0];
    let des = option.split('|')[1];
    this.controllers[this.expandedInvoice].services[this.expandedService].serviceCode.setValue(code.trim());
    this.controllers[this.expandedInvoice].services[this.expandedService].serviceDescription.setValue(des);
    this.searchServicesController.setValue('');
  }

  initToothNumbers() {
    for (let i = 11; i <= 18; i++) {
      this.toothNumbers.push(`${i}`);
    }
    for (let i = 21; i <= 28; i++) {
      this.toothNumbers.push(`${i}`);
    }
    for (let i = 31; i <= 38; i++) {
      this.toothNumbers.push(`${i}`);
    }
    for (let i = 41; i <= 48; i++) {
      this.toothNumbers.push(`${i}`);
    }
    for (let i = 51; i <= 55; i++) {
      this.toothNumbers.push(`${i}`);
    }
    for (let i = 61; i <= 65; i++) {
      this.toothNumbers.push(`${i}`);
    }
    for (let i = 71; i <= 75; i++) {
      this.toothNumbers.push(`${i}`);
    }
    for (let i = 81; i <= 85; i++) {
      this.toothNumbers.push(`${i}`);
    }
  }

  invoiceHasErrors(index) {
    return this.errors.findIndex(error => error.fieldName.split(':')[1] == index) != -1;
  }

  serviceHasErrors(invoiceIndex, serviceIndex) {
    return this.errors.findIndex(error => error.fieldName.includes(`:${invoiceIndex}:${serviceIndex}`)) != -1;
  }

}
