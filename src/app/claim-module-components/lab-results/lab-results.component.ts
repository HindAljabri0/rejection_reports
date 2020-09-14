import { Component, OnInit } from '@angular/core';
import { FieldError } from '../store/claim.reducer';
import { Investigation } from '../models/investigation.model';

@Component({
  selector: 'claim-lab-results',
  templateUrl: './lab-results.component.html',
  styleUrls: ['./lab-results.component.css']
})
export class LabResultsComponent implements OnInit {

  results:Investigation[] = [
    {
      investigationCode: 'code',
      investigationComments: 'the quick brown fox jumped over the...',
      investigationDate: new Date(),
      investigationDescription: 'Description',
      investigationType: 'type',
      observation: [
        {
          observationCode: 'code',
          observationComment: 'The quick brown fox jumped over the...',
          observationDescription: 'description',
          observationUnit: 'Unit',
          observationValue: 'Value'
        }
      ]
    }
  ];

  expandedResult = -1;
  expandedComponent = -1;

  errors: FieldError[] = [];

  constructor() { }

  ngOnInit() {
  }

  afterResultExpanded(i: number) {
    this.expandedResult = i;
  }

  afterComponentExpanded(j: number) {
    this.expandedComponent = j;
  }

  afterResultCollapse(i: number) {
    this.expandedResult = -1;
    this.expandedComponent = -1;
  }

  afterComponentCollapse(resultIndex, componentIndex) {
    this.expandedComponent = -1
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

  resultHasErrors(index) {
    return this.errors.findIndex(error => error.fieldName.split(':')[1] == index) != -1;
  }

  componentHasErrors(resultIndex, componentIndex) {
    return this.errors.findIndex(error => error.fieldName.includes(`:${resultIndex}:${componentIndex}`)) != -1;
  }

}
