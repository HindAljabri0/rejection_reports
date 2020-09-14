import { Component, OnInit } from '@angular/core';
import { FieldError } from '../store/claim.reducer';
import { Investigation } from '../models/investigation.model';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';
import { getClaim, getIsRetrievedClaim, getPageMode } from '../store/claim.reducer';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'claim-lab-results',
  templateUrl: './lab-results.component.html',
  styleUrls: ['./lab-results.component.css']
})
export class LabResultsComponent implements OnInit {

  results: Investigation[];
  resultsControls: {
    testDate: FormControl,
    testCode: FormControl,
    testSerial: FormControl,
    resultDescription: FormControl,
    componentsControls: {
      componentCode: FormControl,
      componentSerial: FormControl,
      componentDescription: FormControl,
      componentLabResult: FormControl,
      componentResultUnit: FormControl,
      componentResultComment: FormControl
    }[]
  }[]

  expandedResult = -1;
  expandedComponent = -1;

  errors: FieldError[] = [];

  constructor(private store: Store, private datePipe: DatePipe) { }

  ngOnInit() {
    this.store.select(getIsRetrievedClaim).pipe(
      withLatestFrom(this.store.select(getClaim)),
      withLatestFrom(this.store.select(getPageMode)),
      map(values => ({ isRetrieved: values[0][0], claim: values[0][1], mode: values[1] }))
    ).subscribe(
      values => {
        if (values.isRetrieved) {
          if (values.claim.caseInformation.caseDescription.investigation != null) {
            values.claim.caseInformation.caseDescription.investigation.forEach(
              investigation => {
                let controls = this.createEmptyResultControls();
                if (investigation.investigationDate != null) {
                  controls.testDate.setValue(this.datePipe.transform(investigation.investigationDate, 'yyyy-MM-dd'))
                }
                controls.testCode.setValue(investigation.investigationCode);
                controls.testSerial.setValue(investigation.investigationType);
                controls.resultDescription.setValue(investigation.investigationDescription);
                controls.testDate.disable({ onlySelf: values.mode != 'CREATE' || investigation.investigationDate != null });
                controls.testCode.disable({ onlySelf: values.mode != 'CREATE' || investigation.investigationCode != null });
                controls.testSerial.disable({ onlySelf: values.mode != 'CREATE' || investigation.investigationType != null });
                controls.resultDescription.disable({ onlySelf: values.mode != 'CREATE' || investigation.investigationDescription != null });

                investigation.observation.forEach(observation => {
                  let componentControls = this.createEmptyComponentControls();
                  componentControls.componentCode.setValue(observation.observationCode);
                  componentControls.componentCode.disable({ onlySelf: values.mode != 'CREATE' || observation.observationCode != null });

                  componentControls.componentDescription.setValue(observation.observationDescription);
                  componentControls.componentDescription.disable({ onlySelf: values.mode != 'CREATE' || observation.observationDescription != null });

                  componentControls.componentLabResult.setValue(observation.observationValue);
                  componentControls.componentLabResult.disable({ onlySelf: values.mode != 'CREATE' || observation.observationValue != null });

                  componentControls.componentResultUnit.setValue(observation.observationUnit);
                  componentControls.componentResultUnit.disable({ onlySelf: values.mode != 'CREATE' || observation.observationUnit != null });

                  componentControls.componentResultComment.setValue(observation.observationComment);
                  componentControls.componentResultComment.disable({ onlySelf: values.mode != 'CREATE' || observation.observationComment != null });

                  componentControls.componentSerial.disable({ onlySelf: values.mode != 'CREATE' });
                  controls.componentsControls.push(componentControls);
                });
                this.resultsControls.push(controls);
              }
            );
          }
        }
      }
    )
  }

  createEmptyResultControls() {
    return {
      testDate: new FormControl(),
      testCode: new FormControl(),
      testSerial: new FormControl(),
      resultDescription: new FormControl(),
      componentsControls: []
    }
  }

  createEmptyComponentControls() {
    return {
      componentCode: new FormControl(),
      componentSerial: new FormControl(),
      componentDescription: new FormControl(),
      componentLabResult: new FormControl(),
      componentResultUnit: new FormControl(),
      componentResultComment: new FormControl()
    }
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
