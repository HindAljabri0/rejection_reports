import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-nphies-payers-selector',
  templateUrl: './nphies-payers-selector.component.html',
  styleUrls: ['./nphies-payers-selector.component.css']
})
export class NphiesPayersSelectorComponent implements OnInit {

  @Input() Form: FormGroup;
  @Input() isSubmitted;
  @Input() isRequired = true;

  @Input() insurancePayer: any;

  // tslint:disable-next-line:no-output-rename
  @Output('payerSelected') payerSelectionEmitter: EventEmitter<any> = new EventEmitter();

  // tslint:disable-next-line:no-output-rename
  @Output('selectionChange') selectionChange: EventEmitter<any> = new EventEmitter();

  // tslint:disable-next-line:no-input-rename
  @Input('isMatSelect') isMatSelect = true;

  selectedPayer: any;

  payerName = '';
  duplicatePayer = false;

  organizations: {
    id: string
    code: string,
    display: string,
    displayAlt: string,
    subList: {
      id: string
      code: string,
      display: string,
      displayAlt: string
    }[]
  }[] = [];

  errorMessage: string;

  constructor(private nphiesSearchService: ProviderNphiesSearchService) { }

  ngOnInit() {
    this.getPayers();
  }

  getPayers() {
    this.nphiesSearchService.getPayers().subscribe(event => {
      if (event instanceof HttpResponse) {
        const body = event.body;
        if (body instanceof Array) {
          this.organizations = body;
          this.setDestinationId();
        }
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        this.errorMessage = errorEvent.error;
      }
    });
  }

  // For extracted claims which has invalid destination Id
  setDestinationId() {
    if (this.Form && this.Form.controls.insurancePlanPayerId && this.Form.controls.insurancePlanPayerId.value) {
      const payerNphiesIdValue = this.Form.controls.insurancePlanPayerId.value;
      this.organizations.forEach(x => {
        if (x.subList.find(y => y.code === payerNphiesIdValue)) {
          this.Form.controls.destinationId.setValue(x.code);
        }
      });
    } else if (this.insurancePayer) {
      if (this.organizations.filter(x => x.subList.find(y => y.code === this.insurancePayer)).length > 1) {
        this.organizations.filter(x => x.subList.find(y => y.code === this.insurancePayer)).forEach(x => {
          this.payerName = x.subList.find(y => y.code === this.insurancePayer).display;
        });
        // this.insurancePayer = '';
        this.duplicatePayer = true;
        this.selectionChange.emit({ value: { payerNphiesId: '' } });
      } else {
        this.payerName = '';
        this.duplicatePayer = false;
      }
    }
  }

  selectPayer(event) {
    if (event.value) {
      this.duplicatePayer = false;
      const payerNphiesIdValue = event.value;
      let organizationNphiesIdValue = '';

      this.organizations.forEach(x => {
        if (x.subList.find(y => y.code === payerNphiesIdValue)) {
          organizationNphiesIdValue = x.code;
        }
      });

      this.selectionChange.emit({ value: { payerNphiesId: payerNphiesIdValue, organizationNphiesId: organizationNphiesIdValue } });
    } else {
      this.selectionChange.emit({ value: '' });
    }
  }
}
