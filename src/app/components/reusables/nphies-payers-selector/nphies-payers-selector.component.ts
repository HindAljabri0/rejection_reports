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

  @Output('payerSelected')
  payerSelectionEmitter: EventEmitter<any> = new EventEmitter();

  @Output('selectionChange')
  selectionChange: EventEmitter<any> = new EventEmitter();

  @Input('isMatSelect')
  isMatSelect = true;

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
    this.getPayers()
  }

  getPayers() {
    this.nphiesSearchService.getPayers().subscribe(event => {
      if (event instanceof HttpResponse) {
        let body = event.body;
        if (body instanceof Array) {
          this.organizations = body;
        }
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        this.errorMessage = errorEvent.error;
      }
    });
  }

  selectPayer(event) {
    if (event.value) {
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
