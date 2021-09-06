import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Claim } from 'src/app/claim-module-components/models/claim.model';
import { RetrievedClaimProps } from 'src/app/claim-module-components/models/retrievedClaimProps.model';
import { ClaimPageMode, ClaimPageType, getPageMode, getPageType, getClaim, getRetrievedClaimProps, getClaimModuleError, getClaimModuleIsLoading, getPaginationControl } from 'src/app/claim-module-components/store/claim.reducer';
import { Store } from '@ngrx/store';
import { SharedServices } from 'src/app/services/shared.services';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { hideHeaderAndSideMenu, changePageTitle } from 'src/app/store/mainStore.actions';
import { retrieveClaim, loadLOVs, openCreateByApprovalDialog, startCreatingNewClaim, saveLabResults, saveInvoices_Services, setLoading, startValidatingClaim, toEditMode, cancelClaim, cancelEdit, goToClaim } from 'src/app/claim-module-components/store/claim.actions';
import { getDepartments } from '../dashboard/store/dashboard.reducer';
import { Location } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-edit-claim',
  templateUrl: './edit-claim.component.html',
  styles: []
})
export class EditClaimComponent implements OnInit, OnDestroy {



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
  isViewOnly: boolean = false;

  routerSubscription: Subscription;

  constructor(
    private dialogRef: MatDialogRef<EditClaimComponent>,
    private store: Store,
    private sharedService: SharedServices,
    private dialogService: DialogService,
    private location: Location,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data) {
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
  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }


  ngOnInit() {
    this.store.select(getClaimModuleIsLoading).subscribe(loading => {
      this.isLoading = loading;
      this.sharedService.loadingChanged.next(loading);
    });
    if (this.location.path().includes('isViewOnly'))
      this.isViewOnly = true;


    this.store.select(getPaginationControl).subscribe(control => {
      this.paginationControl = control;
    });

    // const claimId = this.router.routerState.snapshot.url.split('/')[2];
    const claimId = this.data.claimId;
    this.router.navigate([], {
      relativeTo: this.activatedRouter,
      queryParams: { claimId: claimId },
      queryParamsHandling: 'merge'
    });
    if (claimId != 'add') {
      this.store.dispatch(hideHeaderAndSideMenu());
      this.store.dispatch(retrieveClaim({ claimId: claimId, edit: location.href.includes('#edit') }));
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

    this.routerSubscription = this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd && event.url.includes('/claims') && !event.url.includes('/add')
        && event.url.includes('#reload'))
    ).subscribe((event) => {
      this.routerSubscription.unsubscribe();
      this.ngOnInit();
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
    if (this.claimType == this.dentalDepartmentCode || this.claimType == this.opticalDepartmentCode || this.claimType == this.pharmacyDepartmentCode) {
      this.claimName = type == this.dentalDepartmentCode ? 'Dental' : type == this.opticalDepartmentCode ? 'Optical' : 'Pharmacy';
      this.store.dispatch(openCreateByApprovalDialog({ claimType: type, providerClaimNumber: providerClaimNumber, payers: payers }));
    } else {
      this.claimName = type === 'INPATIENT' ? 'Inpatient' : 'Outpatient';
      this.store.dispatch(startCreatingNewClaim({
        data: {
          claimType: this.claimType,
          providerClaimNumber: providerClaimNumber
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

  close(result?) {
    this.dialogRef.close(result != null ? `${result}` : null);
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
      this.cancel();
      this.data.claimId = this.paginationControl.searchTabCurrentResults[0];
      this.ngOnInit();
    }
  }
  goToPrePage() {
    if (this.paginationControl != null && this.paginationControl.currentIndex != 0) {
      this.cancel();
      this.data.claimId = this.paginationControl.searchTabCurrentResults[this.paginationControl.currentIndex - 1];
      this.ngOnInit();
    }
  }
  goToNextPage() {
    if (this.paginationControl != null && this.paginationControl.currentIndex + 1 < this.paginationControl.size) {
      this.cancel();
      this.data.claimId = this.paginationControl.searchTabCurrentResults[this.paginationControl.currentIndex + 1];
      this.ngOnInit();
    }
  }
  goToLastPage() {
    this.cancel();
    this.data.claimId = this.paginationControl.searchTabCurrentResults[this.paginationControl.size - 1];
    this.ngOnInit();
  }

  get editable() {
    return this.claimProps != null &&
      ['accepted', 'notaccepted', 'failed', 'invalid', 'downloadable', 'returned'].includes(this.claimProps.statusCode.toLowerCase());
  }
}
