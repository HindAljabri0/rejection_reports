import { Component, OnInit } from '@angular/core';
import { Invoice } from '../models/invoice.model';
import { FieldError, getInvoicesErrors } from '../store/claim.reducer';
import { Store } from '@ngrx/store';
import { updateClaimDate, updateInvoices_Services } from '../store/claim.actions';
import { FormControl } from '@angular/forms';
import { Service } from '../models/service.model';

@Component({
  selector: 'claim-invoices-services',
  templateUrl: './invoices-services.component.html',
  styleUrls: ['./invoices-services.component.css']
})
export class InvoicesServicesComponent implements OnInit {

  controllers: {
    invoice:Invoice,
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

  errors: FieldError[] = [];

  constructor(private store: Store) { }

  ngOnInit() {
    this.store.select(getInvoicesErrors).subscribe(errors => this.errors = errors);
    this.addInvoice();
    this.expandedInvoice = 0;
    this.expandedService = 0;
  }

  addInvoice() {
    this.controllers.push({ invoice:new Invoice(), invoiceDate: new FormControl(), invoiceNumber: new FormControl(), services: [] });
    this.addService(this.controllers.length - 1);
  }

  addService(invoiceIndex) {
    this.controllers[invoiceIndex].services.push({
      serviceDate: new FormControl(),
      serviceCode: new FormControl(),
      serviceDescription: new FormControl(),
      unitPrice: new FormControl(),
      quntity: new FormControl(),
      patientShare: new FormControl(),
      serviceDiscount: new FormControl(),
      serviceDiscountUnit: 'PERCENT',
      toothNumber: new FormControl(),
      netVatRate: new FormControl(),
      patientShareVatRate: new FormControl()
    })
  }

  afterInvoiceExpanded(i: number) {
    this.expandedInvoice = i;
  }

  afterInvoiceCollapse(i: number) {
    this.expandedInvoice = -1;
    this.expandedService = -1;
    this.createInvoiceFromControl(i);

  }

  afterServiceCollapse(invoiceIndex, serviceIndex){
    this.expandedService = -1
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
    invoice.invoiceDate = this.controllers[i].invoiceDate.value;
    invoice.service = this.controllers[i].services.map((service) => this.createServiceFromControl(service));
    let GDPN = invoice.invoiceGDPN;
    GDPN.discount.value = invoice.service.map(service => service.serviceGDPN.discount.value).reduce((pre, cur) => pre + cur);
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

  createServiceFromControl(service){
    let gross = (service.unitPrice.value * service.quntity.value);
    let net = gross - service.patientShare.value;
    if (service.serviceDiscountUnit == 'PERCENT') {
      net -= (net * (service.serviceDiscount.value / 100));
    } else {
      net -= service.serviceDiscount.value;
    }
    let netVat = net * (service.netVatRate.value / 100);
    let patientShareVATamount = service.patientShare.value * (service.patientShareVatRate.value / 100)
    let newService: Service = {
      serviceDate: new Date(service.serviceDate.value),
      serviceCode: service.serviceCode.value,
      serviceDescription: service.serviceDescription.value,
      unitPrice: service.unitPrice.value,
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

  updateClaim() {
    this.store.dispatch(updateInvoices_Services({ invoices: this.controllers.map(control => control.invoice) }));
  }


  onAddAnathorInvoiceClick(event, index){
    event.stopPropagation();
    this.afterInvoiceCollapse(index);
    this.onAddInvoiceClick();
  }

  onAddAnathorServiceClick(event, invoiceIndex, serviceIndex){
    event.stopPropagation();
    this.afterServiceCollapse(invoiceIndex, serviceIndex);
    this.onAddServiceClick(invoiceIndex);
  }

  onAddInvoiceClick(){
    this.addInvoice();
    this.expandedInvoice = this.controllers.length-1;
    this.expandedService = 0;
  }

  onAddServiceClick(invoiceIndex){
    this.addService(invoiceIndex);
    this.expandedService = this.controllers[invoiceIndex].services.length-1;
  }

  onDeleteInvoiceClick(event, i){
    event.stopPropagation();
    this.controllers.splice(i, 1);
    this.updateClaim();
  }

  onDeleteServiceClick(event, i, j){
    event.stopPropagation();
    this.controllers[i].services.splice(j, 1);
    this.createInvoiceFromControl(i);
  }

}
