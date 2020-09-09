import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadLOVs, cancelClaim, startValidatingClaim, setLoading, saveInvoices_Services, getUploadId, openCreateByApprovalDialog, retrieveClaim } from '../store/claim.actions';
import { Claim } from '../models/claim.model';
import { getClaim, getClaimModuleError, getClaimModuleIsLoading, getClaimObjectErrors, getDepartments, getPageMode, getPageType, ClaimPageMode, ClaimPageType } from '../store/claim.reducer';
import { SharedServices } from 'src/app/services/shared.services';
import { skipWhile, withLatestFrom, filter } from 'rxjs/operators';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { hideHeaderAndSideMenu } from 'src/app/store/mainStore.actions';

@Component({
  selector: 'app-main-claim-page',
  templateUrl: './main-claim-page.component.html',
  styleUrls: ['./main-claim-page.component.css']
})
export class MainClaimPageComponent implements OnInit {

  claim: Claim;
  errors: any;
  isLoading: boolean = true;

  dentalDepartmentCode: string;
  opticalDepartmentCode: string;

  pageMode:ClaimPageMode;
  pageType:ClaimPageType;

  constructor(private router: Router, private store: Store, private sharedService: SharedServices, private dialogService: DialogService) {
    store.select(getPageMode).subscribe(claimPageMode => this.pageMode = claimPageMode);
    store.select(getPageType).subscribe(claimPageType => this.pageType = claimPageType);
    store.select(getClaim).subscribe(claim => this.claim = claim);
    store.select(getClaimModuleError).subscribe(errors => {
      if (errors != null && errors.hasOwnProperty('code')) {
        let code: string = errors['code'];
        switch (code) {
          case 'LOV_ERROR': case 'PAYERS_LIST':
            this.errors = errors
            break;
          case 'UPLOAD_ID_ERROR':
            this.dialogService.openMessageDialog({
              title: '',
              message: 'Could not reach the server at the moment please try again later.',
              isError: true
            })
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
                `There is no ${code.endsWith('DENTAL') ? 'Dental' : 'Optical'} approval requrest approved by this number!`,
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
    const claimId = this.router.routerState.snapshot.url.split('/')[2];
    if (claimId != 'add') {
      this.store.dispatch(hideHeaderAndSideMenu());
      this.store.dispatch(retrieveClaim({ claimId: claimId }));
    }
    this.store.dispatch(loadLOVs());
    this.store.select(getDepartments)
      .subscribe(departments => {
        if (departments != null && departments.length > 0) {
          this.dentalDepartmentCode = departments.find(department => department.name == "Dental").departmentId + '';
          this.opticalDepartmentCode = departments.find(department => department.name == "Optical").departmentId + '';
        }
      });
  }

  startCreatingClaim(type: string) {
    let now = new Date(Date.now());
    let providerClaimNumber = `${this.sharedService.providerId}${now.getFullYear() % 100}${now.getMonth()}${now.getDate()}${now.getHours()}${now.getMinutes()}`;
    let payers = this.sharedService.getPayersList();
    this.store.dispatch(openCreateByApprovalDialog({ claimType: type, providerClaimNumber: providerClaimNumber, payers: payers }));
  }

  save() {
    this.store.dispatch(saveInvoices_Services());
    this.store.dispatch(setLoading({ loading: true }));
    this.store.dispatch(startValidatingClaim());
    let sub = this.store.select(getClaimModuleIsLoading).pipe(
      skipWhile(loading => loading),
      withLatestFrom(this.store.select(getClaimObjectErrors))
    ).subscribe((values) => {
      if (values[1].diagnosisErrors.length == 0
        && values[1].genInfoErrors.length == 0
        && values[1].patientInfoErrors.length == 0
        && values[1].physicianErrors.length == 0
        && values[1].claimGDPN.length == 0
        && values[1].invoicesErrors.length == 0
      ) {
        this.store.dispatch(setLoading({ loading: true }));
        this.store.dispatch(getUploadId({ providerId: this.sharedService.providerId }));
      } else if (values[1].claimGDPN.length > 0
        && values[1].diagnosisErrors.length == 0
        && values[1].genInfoErrors.length == 0
        && values[1].patientInfoErrors.length == 0
        && values[1].physicianErrors.length == 0
        && values[1].invoicesErrors.length == 0) {
        this.dialogService.openMessageDialog({
          title: '',
          message: 'Claim net amount cannot be zero. At least one invoice should have non-zero net amount.',
          isError: true
        });
      }
    }).unsubscribe();
  }

  cancel() {
    this.store.dispatch(cancelClaim());
  }

  getError() {
    if (this.errors.hasOwnProperty('code')) {
      switch (this.errors['code']) {
        case 'LOV_ERROR': case 'PAYERS_LIST':
          return 'Could not load required data to create new claim, please try again later.';
      }
    }
  }

}
