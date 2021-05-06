import { Component, OnInit, ViewChild } from '@angular/core';
import { ClaimPageMode, FieldError, getLabResultsErrors } from '../store/claim.reducer';
import { Investigation } from '../models/investigation.model';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';
import { getClaim, getPageMode } from '../store/claim.reducer';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Claim } from '../models/claim.model';
import { saveLabResults, updateLabResults } from '../store/claim.actions';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'claim-lab-results',
  templateUrl: './lab-results.component.html',
  styles: []
})
export class LabResultsComponent implements OnInit {

  results: Investigation[];
  resultsControls: {
    results: Investigation,
    testDate: FormControl,
    testCode: FormControl,
    resultDescription: FormControl,
    componentsControls: {
      componentCode: FormControl,
      componentDescription: FormControl,
      componentLabResult: FormControl,
      componentResultUnit: FormControl,
      isOpen: boolean
    }[]
  }[] = [];

  expandedResult = -1;
  expandedComponent = -1;

  errors: FieldError[] = [];

  pageMode: ClaimPageMode;

  constructor(private store: Store, private actions: Actions, private datePipe: DatePipe) { }

  ngOnInit() {
    this.store.select(getPageMode).pipe(
      withLatestFrom(this.store.select(getClaim)),
      map(values => ({ mode: values[0], claim: values[1] }))
    ).subscribe(({ mode, claim }) => {
      this.pageMode = mode;
      if (mode == 'VIEW') {
        this.setData(claim);
        this.toggleEdit(false);
      } else if (mode == 'EDIT') {
        this.setData(claim);
        this.toggleEdit(true);
      } else if (mode == 'CREATE_FROM_RETRIEVED') {
        this.setData(claim);
        this.toggleEdit(false, true);
      }
    });

    this.actions.pipe(
      ofType(saveLabResults)
    ).subscribe(() => {
      if (this.expandedResult != -1) {
        this.updateClaimInvestigations();
      }
    });

    this.store.select(getLabResultsErrors).subscribe(errors => this.errors = errors);
  }

  setData(claim: Claim) {
    this.resultsControls = [];
    if (claim.caseInformation.caseDescription.investigation != null) {
      claim.caseInformation.caseDescription.investigation.forEach(
        investigation => {
          const controls = this.createEmptyResultControls();
          if (investigation.investigationDate != null) {
            controls.testDate.setValue(this.datePipe.transform(investigation.investigationDate, 'yyyy-MM-dd'));
          } else {
            controls.testDate.setValue('');
          }
          controls.testCode.setValue(investigation.investigationCode);
          controls.testSerial.setValue(investigation.investigationType);
          controls.resultDescription.setValue(investigation.investigationDescription);

          investigation.observation.forEach(observation => {
            const componentControls = this.createEmptyComponentControls();
            componentControls.componentCode.setValue(observation.observationCode);

            componentControls.componentDescription.setValue(observation.observationDescription);

            componentControls.componentLabResult.setValue(observation.observationValue);

            componentControls.componentResultUnit.setValue(observation.observationUnit);

            componentControls.componentResultComment.setValue(observation.observationComment);

            controls.componentsControls.push(componentControls);
          });
          this.resultsControls.push(controls);
        }
      );
    }
  }

  toggleEdit(allowEdit: boolean, enableForNulls?: boolean) {
    this.resultsControls.forEach(resultControls => {
      if (allowEdit) {
        resultControls.testDate.enable();
        resultControls.testCode.enable();
        resultControls.resultDescription.enable();
      } else {
        resultControls.testDate.disable();
        resultControls.testCode.disable();
        resultControls.resultDescription.disable();
      }

      resultControls.componentsControls.forEach(componentControl => {
        if (allowEdit) {
          componentControl.componentCode.enable();
          componentControl.componentDescription.enable();
          componentControl.componentLabResult.enable();
          componentControl.componentResultUnit.enable();
        } else {
          componentControl.componentCode.disable();
          componentControl.componentDescription.disable();
          componentControl.componentLabResult.disable();
          componentControl.componentResultUnit.disable();
        }
      });

    });
  }

  createEmptyResultControls() {
    return {
      results: new  Investigation(),
      testDate: new FormControl(),
      testCode: new FormControl(),
      testSerial: new FormControl(),
      resultDescription: new FormControl(),
      componentsControls: []
    };
  }

  createEmptyComponentControls() {
    return {
      componentCode: new FormControl(),
      componentSerial: new FormControl(),
      componentDescription: new FormControl(),
      componentLabResult: new FormControl(),
      componentResultUnit: new FormControl(),
      componentResultComment: new FormControl(),
      isOpen: false
    };
  }

  onDeleteResultClick(i) {
    this.resultsControls.splice(i, 1);
    this.expandedResult = -1;
    this.expandedComponent = -1;
    this.updateClaimInvestigations();
  }

  onDeleteComponentClick(event, i, j) {
    event.stopPropagation();
    this.expandedComponent = -1;
    this.resultsControls[i].componentsControls.splice(j, 1);
    this.updateClaimInvestigations();
  }

  toggleResult(i: number) {
    this.resultsControls.forEach(result => {
      result.componentsControls.forEach(element => {
        element.isOpen = false;
      });
    });
    if (this.expandedResult == -1) {
      this.expandedResult = i;
    } else if (this.expandedResult == i) {
      this.expandedResult = -1;
      this.expandedComponent = -1;
      this.updateClaimInvestigations();
    } else {
      this.expandedResult = i;
      this.updateClaimInvestigations();
    }
  }

  toggleComponentExpansion(event, i, j) {
    event.stopPropagation();
    if (this.resultsControls[i].componentsControls[j].isOpen) {
      this.expandedComponent = -1;
      this.resultsControls[i].componentsControls[j].isOpen = false;
      this.updateClaimInvestigations();
    } else {
      this.resultsControls[i].componentsControls.forEach(element => {
        element.isOpen = false;
      });
      this.resultsControls[i].componentsControls[j].isOpen = true;
      this.expandedComponent = j;
    }
  }

  fieldHasError(fieldName , code) {
    return this.errors.findIndex(error => error.fieldName == fieldName && error.code == code) != -1;
  }

  getFieldError(fieldName ,code) {
    const index = this.errors.findIndex(error => error.fieldName == fieldName && error.code == code);
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

  onAddResultClick() {
    this.expandedResult = -1;
    this.expandedComponent = -1;
    this.resultsControls.push(this.createEmptyResultControls());
    this.expandedResult = this.resultsControls.length - 1;
    this.updateClaimInvestigations();
  }

  onAddComponentClick(i: number) {
    this.expandedComponent = -1;
    this.resultsControls[i].componentsControls.push(this.createEmptyComponentControls());
    this.expandedComponent = this.resultsControls[i].componentsControls.length - 1;
    this.resultsControls[i].componentsControls.forEach(element => {
      element.isOpen = false;
    });
    this.resultsControls[i].componentsControls[this.resultsControls[i].componentsControls.length - 1].isOpen = true;
    this.updateClaimInvestigations();
  }

  updateClaimInvestigations() {
    this.results = this.resultsControls.map(controllers => ({
      investigationCode: controllers.testCode.value,
      investigationComments: null,
      investigationDescription: controllers.resultDescription.value,
      investigationDate: controllers.testDate.value,
      investigationType: null,
      observation: controllers.componentsControls.map(controls => ({
        observationCode: controls.componentCode.value,
        observationDescription: controls.componentDescription.value,
        observationValue: controls.componentLabResult.value,
        observationUnit: controls.componentResultUnit.value,
        observationComment: null
      }))
    }));
    this.store.dispatch(updateLabResults({ investigations: this.results }));
  }

  formatDate(date: any) {
    if (date != null) {
      if (date instanceof Date) {
        return date.toLocaleDateString();
      } else {
        return new Date(date).toLocaleDateString();
      }
    }
    return '';
  }

}
