import { Component, OnInit } from '@angular/core';
import { Invoice } from '../models/invoice.model';
import { FieldError, getInvoicesErrors } from '../store/claim.reducer';
import { Store } from '@ngrx/store';
import { Service } from 'src/app/models/service';

@Component({
  selector: 'claim-invoices-services',
  templateUrl: './invoices-services.component.html',
  styleUrls: ['./invoices-services.component.css']
})
export class InvoicesServicesComponent implements OnInit {

  invoices:Invoice[] = [];
  expandedInvoice = -1;
  expandedService = -1;

  errors:FieldError[] = [];

  constructor(private store: Store) { }

  ngOnInit() {
    this.store.select(getInvoicesErrors).subscribe(errors => this.errors = errors);
    this.invoices.push(new Invoice());
    this.expandedInvoice = 0;
    this.expandedService = 0;
  }

  afterInvoiceExpanded(i:number){
    this.expandedInvoice = i;
  }

  afterInvoiceCollapse(){
    this.expandedInvoice = -1;
    this.expandedService = -1;
  }

  fieldHasError(fieldName){
    return this.errors.findIndex(error => error.fieldName == fieldName) != -1;
  }

  getFieldError(fieldName){
    const index = this.errors.findIndex(error => error.fieldName == fieldName);
    if(index > -1){
      return this.errors[index].error || '';
    }
    return '';
  }



}
