import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  loadLOVs,
  cancelClaim,
  startValidatingClaim,
  setLoading,
  saveInvoices_Services,
  openCreateByApprovalDialog,
  retrieveClaim,
  toEditMode,
  cancelEdit,
  saveLabResults,
  goToClaim,
  startCreatingNewClaim,
  getUploadId,
  saveClaimChanges
} from '../store/claim.actions';
import { Claim } from '../models/claim.model';

import {
  getClaim,
  getClaimModuleError,
  getClaimModuleIsLoading,
  getDepartments,
  getPageMode,
  getPageType,
  ClaimPageMode,
  ClaimPageType,
  getRetrievedClaimProps,
  getPaginationControl,
} from '../store/claim.reducer';
import { SharedServices } from 'src/app/services/shared.services';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { changePageTitle, hideHeaderAndSideMenu } from 'src/app/store/mainStore.actions';
import { RetrievedClaimProps } from '../models/retrievedClaimProps.model';
import { Location } from '@angular/common';


@Component({
  selector: 'app-main-claim-page',
  templateUrl: './main-claim-page.component.html',
  styles: []
})
export class MainClaimPageComponent implements OnInit, OnDestroy {
  claim: Claim;
  claimProps: RetrievedClaimProps;
  errors: any;
  isLoading = true;

  dentalDepartmentCode: string;
  opticalDepartmentCode: string;
  pharmacyDepartmentCode: string;

  pageMode: ClaimPageMode;
  pageType: ClaimPageType;

  paginationControl: {
    currentIndex: number;
    size: number;
    searchTabCurrentResults: number[];
  };
  claimType = '';
  claimName: string;


  constructor(
    private router: Router,
    private store: Store,
    private sharedService: SharedServices,
    private dialogService: DialogService,
    private location: Location) {
    store.select(getPageMode).subscribe(claimPageMode => {
      this.pageMode = claimPageMode;
      this.editPageTitle();
    });
    store.select(getPageType).subscribe(claimPageType => this.pageType = claimPageType);
    store.select(getClaim).subscribe(claim => {
      const updateTitle = this.claim == null;
      this.claim = claim;
      if (updateTitle) { this.editPageTitle(); }
    });
    store.select(getRetrievedClaimProps).subscribe(props => this.claimProps = props);
    store.select(getClaimModuleError).subscribe(errors => {
      if (errors != null && errors.hasOwnProperty('code')) {
        const code: string = errors['code'];
        switch (code) {
          case 'CLAIM_RETRIEVE_ERROR':
          case 'LOV_ERROR': case 'PAYERS_LIST':
            this.errors = errors;
            break;
          case 'UPLOAD_ID_ERROR':
            this.dialogService.openMessageDialog({
              title: '',
              message: 'Could not reach the server at the moment please try again later.',
              isError: true
            });
            break;
          case 'CLAIM_SAVING_ERROR':
            this.dialogService.openMessageDialog({
              title: errors['status'],
              message: errors['description'],
              isError: true
            });
            break;
          case 'APPROVAL_ERROR_DENTAL': case 'APPROVAL_ERROR_OPTICAL': case 'APPROVAL_ERROR_SERVER':
            this.dialogService.openMessageDialog({
              title: '',
              message: code.endsWith('SERVER') ?
                'Could not reach the server at the moment. Please try again later.' :
                `There is no ${code.endsWith('DENTAL') ? 'Dental' : 'Optical'} approval request approved by this number!`,
              isError: true
            }).subscribe(() => {
              this.startCreatingClaim(code.endsWith('DENTAL') ? this.dentalDepartmentCode : this.opticalDepartmentCode);
            });
            break;
        }
      }
    });
  }


  ngOnInit() {
    this.store.select(getClaimModuleIsLoading).subscribe(loading => {
      this.isLoading = loading;
      this.sharedService.loadingChanged.next(loading);
    });

    this.store.select(getPaginationControl).subscribe(control => {
      this.paginationControl = control;
    });

    const claimId = this.router.routerState.snapshot.url.split('/')[2];
    if (claimId != 'add') {
      this.store.dispatch(hideHeaderAndSideMenu());
      this.store.dispatch(retrieveClaim({ claimId, edit: this.router.routerState.snapshot.url.endsWith('#edit') }));
    }
    this.store.dispatch(loadLOVs());
    this.store.select(getDepartments)
      .subscribe(departments => {
        if (departments != null && departments.length > 0) {
          this.dentalDepartmentCode = departments.find(department => department.name == 'Dental').departmentId + '';
          this.opticalDepartmentCode = departments.find(department => department.name == 'Optical').departmentId + '';
          this.pharmacyDepartmentCode = departments.find(department => department.name == 'Pharmacy').departmentId + '';
        }
      });
  }



  editPageTitle() {
    if (this.pageMode == 'VIEW' || this.pageMode == 'EDIT') {
      const mode = this.pageMode.charAt(0) + this.pageMode.substring(1).toLowerCase();
      this.store.dispatch(changePageTitle({
        title: `${mode} Claim` + (this.claim == null ? '' : ` | ${this.claim.claimIdentities.providerClaimNumber}`)
      }));
    }
  }

  startCreatingClaim(type: string) {
    const now = new Date(Date.now());
    const providerClaimNumber =
      `${this.sharedService.providerId}${now.getFullYear() % 100}${now.getMonth()}${now.getDate()}${now.getHours()}${now.getMinutes()}`;
    this.claimType = type;
    const payers = this.sharedService.getPayersList();
    if (this.claimType == this.dentalDepartmentCode || this.claimType == this.opticalDepartmentCode ||
      this.claimType == this.pharmacyDepartmentCode) {
      this.claimName = type == this.dentalDepartmentCode ? 'Dental' : type == this.opticalDepartmentCode ? 'Optical' : 'Pharmacy';
      this.store.dispatch(openCreateByApprovalDialog({ claimType: type, providerClaimNumber, payers }));
    } else {
      this.claimName = type === 'INPATIENT' ? 'Inpatient' : 'Outpatient';
      this.store.dispatch(startCreatingNewClaim({
        data: {
          claimType: this.claimType,
          providerClaimNumber
        }
      }));

    }
  }





  save() {
    if (this.isLoading) { return; }
    this.store.dispatch(saveLabResults());
    this.store.dispatch(saveInvoices_Services());
    this.store.dispatch(setLoading({ loading: true }));
    this.store.dispatch(startValidatingClaim());
  }

  getClaimStatusLabel(status: string) {
    return this.sharedService.statusToName(status);
  }

  getClaimStatusColor(status: string) {
    if (status != null) {
      return this.sharedService.getCardAccentColor(status);
    }
    return 'all-claim';
  }

  edit() {
    if (this.editable) {
      this.location.go(this.location.path() + '#edit');
      this.store.dispatch(toEditMode());
    }
  }

  cancel() {
    if (this.pageMode == 'CREATE' || this.pageMode == 'CREATE_FROM_RETRIEVED') {
      this.store.dispatch(cancelClaim());
    } else if (this.pageMode == 'EDIT') {
      this.location.go(this.location.path().replace('#edit', ''));
      this.store.dispatch(cancelEdit());
    }
  }

  close() {
    window.close();
  }

  getError() {
    if (this.errors.hasOwnProperty('code')) {
      switch (this.errors['code']) {
        case 'LOV_ERROR': case 'PAYERS_LIST':
          return 'Could not load required data to create/edit claim. Please try again later.';
        case 'CLAIM_RETRIEVE_ERROR':
          return 'Could not load claim at the moment. Please try again later.';
      }
    }
  }

  goToFirstPage() {
    if (this.paginationControl != null && this.paginationControl.currentIndex != 0) {

      this.store.dispatch(goToClaim({ claimId: `${this.paginationControl.searchTabCurrentResults[0]}` }));
    }
  }
  goToPrePage() {
    if (this.paginationControl != null && this.paginationControl.currentIndex != 0) {
      this.store.dispatch(goToClaim({
        claimId: `${this.paginationControl.searchTabCurrentResults[this.paginationControl.currentIndex - 1]}`
      }));
    }
  }
  goToNextPage() {
    if (this.paginationControl != null && this.paginationControl.currentIndex + 1 < this.paginationControl.size) {
      this.store.dispatch(goToClaim({
        claimId: `${this.paginationControl.searchTabCurrentResults[this.paginationControl.currentIndex + 1]}`
      }));
    }
  }
  goToLastPage() {
    if (this.paginationControl != null && this.paginationControl.currentIndex != this.paginationControl.size - 1) {
      this.store.dispatch(goToClaim({ claimId: `${this.paginationControl.searchTabCurrentResults[this.paginationControl.size - 1]}` }));
    }
  }

  get editable() {
    return this.claimProps != null &&
      ['accepted', 'notaccepted', 'failed', 'invalid', 'downloadable', 'returned'].includes(this.claimProps.statusCode.toLowerCase());
  }


  ngOnDestroy(): void {
    this.cancel();
  }


}
