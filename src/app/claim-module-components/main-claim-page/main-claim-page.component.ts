import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { startCreatingNewClaim, loadLOVs, cancelClaim, startValidatingClaim, setLoading, saveInvoices_Services, getUploadId, saveClaim } from '../store/claim.actions';
import { Claim } from '../models/claim.model';
import { getClaim, getClaimType, getClaimModuleError, getClaimModuleIsLoading, getClaimObjectErrors } from '../store/claim.reducer';
import { Observable } from 'rxjs';
import { SharedServices } from 'src/app/services/shared.services';
import { skipWhile, withLatestFrom } from 'rxjs/operators';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';

@Component({
  selector: 'app-main-claim-page',
  templateUrl: './main-claim-page.component.html',
  styleUrls: ['./main-claim-page.component.css']
})
export class MainClaimPageComponent implements OnInit {

  claim: Claim;
  errors: any;
  isLoading: boolean = true;

  constructor(private router: Router, private store: Store, private sharedService: SharedServices, private dialogService: DialogService) {
    store.select(getClaim).subscribe(claim => this.claim = claim);
    store.select(getClaimModuleError).subscribe(errors => {
      if (errors.hasOwnProperty('code')) {
        switch (errors['code']) {
          case 'LOV_ERROR': case 'PAYERS_LIST':
            this.errors = errors
            break;
          case 'UPLOAD_ID_ERROR': case 'CLAIM_SAVING_ERROR':
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
      //to be changed later if we decide to view/edit the claim here.
      this.router.navigate(['/']);
    }
    this.store.dispatch(loadLOVs());
  }

  startCreatingClaim(type: string) {
    this.store.dispatch(startCreatingNewClaim({ caseType: type, providerClaimNumber: `${this.sharedService.providerId}-${Date.now()}` }));
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
        })
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
