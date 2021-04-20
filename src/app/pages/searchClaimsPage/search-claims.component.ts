import { Component, OnInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { SharedServices } from '../../services/shared.services';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SearchService } from '../../services/serchService/search.service';
import { HttpResponse, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { ClaimSubmittionService } from '../../services/claimSubmittionService/claim-submittion.service';
import { Location } from '@angular/common';
import { ClaimStatus } from 'src/app/models/claimStatus';
import { SearchStatusSummary } from 'src/app/models/searchStatusSummary';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { SearchedClaim } from 'src/app/models/searchedClaim';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { ClaimService } from 'src/app/services/claimService/claim.service';
import { EligibilityService } from 'src/app/services/eligibilityService/eligibility.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { NotificationsService } from 'src/app/services/notificationService/notifications.service';
import { UploadSummary } from 'src/app/models/uploadSummary';
import { ViewedClaim } from 'src/app/models/viewedClaim';
import { Store } from '@ngrx/store';
import { requestClaimsPage, SearchPaginationAction, setSearchCriteria, storeClaims } from './store/search.actions';
import { Actions, ofType } from '@ngrx/effects';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ClaimError } from 'src/app/models/claimError';
import { ValidationService } from 'src/app/services/validationService/validation.service';

@Component({
  selector: 'app-search-claims',
  templateUrl: './search-claims.component.html',
  styles: []
})
export class SearchClaimsComponent implements OnInit, AfterViewChecked, OnDestroy {
  owlCarouselOptions: OwlOptions = {
    mouseDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 300,
    navText: ['', ''],
    margin: 14,
    responsive: {
      0: {
        items: 3,
        slideBy: 3
      },
      992: {
        items: 4,
        slideBy: 4
      },
      1200: {
        items: 5,
        slideBy: 5
      }
    },
    nav: true
  };

  file: File;

  isManagingAttachments = false;

  isViewChecked = false;

  progressChange: Subject<{ percentage: number }> = new Subject();


  placeholder = '-';
  cardsClickAble = true;
  extraCards = 3;
  extraNumbers: number[];

  detailCardTitle: string;
  detailTopActionIcon = 'ic-download.svg';

  providerId: string;
  from: string;
  to: string;
  payerId: string;
  batchId: string;
  uploadId: string;
  casetype: string;
  claimId: string;
  claimRefNo: string;
  memberId: string;
  invoiceNo: string;
  patientFileNo: string;
  policyNo: string;
  editMode: string;
  routerSubscription: Subscription;

  summaries: SearchStatusSummary[];
  currentSummariesPage = 1;
  searchResult: PaginatedResult<SearchedClaim>;
  claims: SearchedClaim[];
  uploadSummaries: UploadSummary[];
  selectedClaims: string[] = new Array();
  selectedClaimsCountOfPage = 0;
  allCheckBoxIsIndeterminate: boolean;
  allCheckBoxIsChecked: boolean;

  paginatorPagesNumbers: number[];
  // @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  paginatorPageSizeOptions = [10, 20, 50, 100];
  manualPage = null;


  selectedCardKey: number;
  selectedPage: number;

  errorMessage: string;

  submittionErrors: Map<string, string>;

  queryStatus: number;
  queryPage: number;

  waitingEligibilityCheck = false;
  eligibilityWaitingList: { result: string, waiting: boolean }[] = [];
  watchingEligibility = false;
  currentSelectedTab = 0;
  validationDetails: ClaimError[];
  results: any[];
  showValidationTab = false;
  isRevalidate = false;
  isSubmit = false;
  isDeleteBtnVisible: boolean = true;
  status: any = 1;


  constructor(
    public location: Location,
    public submittionService: ClaimSubmittionService,
    public commen: SharedServices,
    public routeActive: ActivatedRoute,
    public router: Router,
    public searchService: SearchService,
    private dialogService: DialogService,
    private claimService: ClaimService,
    private eligibilityService: EligibilityService,
    private notificationService: NotificationsService,
    private validationService: ValidationService,
    private store: Store,
    private actions$: Actions) { }

  ngOnDestroy(): void {
    this.notificationService.stopWatchingMessages('eligibility');
    localStorage.removeItem(SEARCH_TAB_RESULTS_KEY);
    this.routerSubscription.unsubscribe();
  }

  ngOnInit() {
    this.fetchData();
    this.routerSubscription = this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd && event.url.includes('/claims') && !event.url.includes('/add'))
    ).subscribe(() => {
      this.fetchData();
    });
    this.dialogService.onClaimDialogClose.subscribe(value => {
      if (value != null) {
        this.reloadClaim(value);
      }
      this.claimId = null;
      this.editMode = null;
      this.resetURL();
    });
    this.submittionErrors = new Map();
    this.actions$.pipe(
      ofType(requestClaimsPage),
    ).subscribe(data => {
      switch (data.action) {
        case SearchPaginationAction.firstPage:
          this.goToFirstPage();
          break;
        case SearchPaginationAction.previousPage:
          this.goToPrePage();
          break;
        case SearchPaginationAction.nextPage:
          this.goToNextPage();
          break;
        case SearchPaginationAction.lastPage:
          this.goToLastPage();
          break;
      }
    });
  }

  ngAfterViewChecked() {
    this.isViewChecked = true;
  }

  async fetchData() {
    this.commen.searchIsOpenChange.next(true);
    this.claims = new Array();
    this.summaries = new Array();
    this.commen.loadingChanged.next(true);
    this.selectedClaims = new Array();
    this.selectedClaimsCountOfPage = 0;
    this.errorMessage = null;
    this.routeActive.params.subscribe(value => {
      this.providerId = value.providerId;
    }).unsubscribe();
    this.routeActive.queryParams.subscribe(value => {
      this.from = value.from;
      this.to = value.to;
      this.payerId = value.payer;
      this.batchId = value.batchId;
      this.uploadId = value.uploadId;
      this.queryStatus = value.status == null ? 0 : Number.parseInt(value.status, 10);
      this.queryPage = value.page == null ? 0 : Number.parseInt(value.page, 10) - 1;
      if (Number.isNaN(this.queryStatus) || this.queryStatus < 0) { this.queryStatus = 0; }
      if (Number.isNaN(this.queryPage) || this.queryPage < 0) { this.queryPage = 0; }
      this.casetype = value.casetype;
      this.claimId = value.claimId;
      this.claimRefNo = value.claimRefNo;
      this.memberId = value.memberId;
      this.invoiceNo = value.invoiceNo;
      this.patientFileNo = value.patientFileNo;
      this.policyNo = value.policyNo;
      this.editMode = value.editMode;
      this.store.dispatch(setSearchCriteria({
        batchId: this.batchId,
        fromDate: this.from,
        memberId: this.memberId,
        invoiceNo: this.invoiceNo,
        patientFileNo: this.patientFileNo,
        policyNo: this.policyNo,
        payerId: this.payerId,
        provClaimNum: this.claimRefNo,
        toDate: this.to,
        uploadId: this.uploadId,
        statuses: ['All']
      }));
    }).unsubscribe();
    if ((this.payerId == null || this.from == null || this.to == null || this.payerId == '' || this.from == '' || this.to == '') &&
      (this.batchId == null || this.batchId == '') &&
      (this.uploadId == null || this.uploadId == '') &&
      (this.claimRefNo == null || this.claimRefNo == '') &&
      (this.memberId == null || this.memberId == '') &&
      (this.invoiceNo == null || this.invoiceNo == '') &&
      (this.patientFileNo == null || this.patientFileNo == '') &&
      (this.policyNo == null || this.policyNo == '')) {
      this.commen.loadingChanged.next(false);
      this.router.navigate(['']);
    }
    this.showValidationTab = false;
    let statusCode = await this.getSummaryOfStatus([ClaimStatus.ALL]);
    if (statusCode == 200 && this.summaries[0] != null && this.summaries[0].statuses != null) {
      let statuses = this.summaries[0].statuses;
      statuses.sort((s1, s2) => {
        if (this.isReadyForSubmissionStatus(s1) || s1 == 'NotAccepted' || s1 == 'Batched' || this.isUnderProcessingStatus(s1)) {
          return -1;
        } else if (this.isReadyForSubmissionStatus(s2) || s2 == 'NotAccepted' || s2 == 'Batched' || this.isUnderProcessingStatus(s2)) {
          return 1;
        }
        return 0;
      })
      let underProcessingIsDone = false;
      let rejectedByPayerIsDone = false;
      let readyForSubmissionIsDone = false;
      let paidIsDone = false;
      for (let i = 0; i < statuses.length; i++) {
        let status = statuses[i];
        if (this.isUnderProcessingStatus(status)) {
          if (!underProcessingIsDone)
            await this.getSummaryOfStatus([ClaimStatus.OUTSTANDING, 'PENDING', 'UNDER_PROCESS']);
          underProcessingIsDone = true;
        } else if (this.isRejectedByPayerStatus(status)) {
          if (!rejectedByPayerIsDone)
            await this.getSummaryOfStatus([ClaimStatus.REJECTED, 'DUPLICATE']);
          rejectedByPayerIsDone = true;
        } else if (this.isReadyForSubmissionStatus(status)) {
          if (!readyForSubmissionIsDone)
            await this.getSummaryOfStatus([ClaimStatus.Accepted, 'Failed']);
          readyForSubmissionIsDone = true;
        } else if (this.isPaidStatus(status)) {
          if (!paidIsDone)
            await this.getSummaryOfStatus([ClaimStatus.PAID, 'SETTLED']);
          paidIsDone = true;
        }
        else if (this.isInvalidStatus(status)) {
          await this.getSummaryOfStatus([ClaimStatus.INVALID]);
        }
        else {
          await this.getSummaryOfStatus([status]);
        }
      }
    }

    this.getResultsOfStatus(this.queryStatus, this.queryPage);

    if (!this.hasData && this.errorMessage == null) { this.errorMessage = 'Sorry, we could not find any result.'; }
  }





  async getSummaryOfStatus(statuses: string[]): Promise<number> {
    this.commen.loadingChanged.next(true);
    let event;
    event = await this.searchService.getSummaries(this.providerId,
      statuses,
      this.from,
      this.to,
      this.payerId,
      this.batchId,
      this.uploadId,
      this.casetype,
      this.claimRefNo,
      this.memberId,
      this.invoiceNo,
      this.patientFileNo,
      this.policyNo).toPromise().catch(error => {
        this.commen.loadingChanged.next(false);
        if (error instanceof HttpErrorResponse) {
          if ((error.status / 100).toFixed() == '4') {
            this.errorMessage = error.message;
          } else if ((error.status / 100).toFixed() == '5') {
            this.errorMessage = 'Server could not handle the request. Please try again later.';
          } else {
            this.errorMessage = 'Somthing went wrong.';
          }
          return error.status;
        }
      });
    if (event instanceof HttpResponse) {
      if ((event.status / 100).toFixed() == '2') {
        const summary: any = new SearchStatusSummary(event.body);
        if (summary.totalClaims > 0) {
          this.summaries.push(summary);
        }
      }
    }
    this.commen.loadingChanged.next(false);
    return event.status;
  }

  getResultsOfStatus(key: number, page?: number, pageSize?: number) {
    if (this.summaries[key] == null) { return; }
    if (this.summaries.length == 0) { return; }
    this.commen.loadingChanged.next(true);
    this.detailTopActionIcon = 'ic-download.svg';

    if (this.selectedCardKey != null && key != this.selectedCardKey) {
      this.selectedClaims = new Array();
      this.selectedClaimsCountOfPage = 0;
      this.setAllCheckBoxIsIndeterminate();
    }
    this.selectedCardKey = key;
    this.selectedPage = page;
    this.resetURL();


    if (key == 0) {
      this.isRevalidate = true;
      this.isSubmit = false;
    } else {
      if (this.summaries[key].statuses[0].toLowerCase() == ClaimStatus.Accepted.toLowerCase()) {
        this.isRevalidate = true;
        this.isSubmit = true;
      } else if (this.summaries[key].statuses[0].toLowerCase() == ClaimStatus.NotAccepted.toLowerCase()) {
        this.isRevalidate = true;
        this.isSubmit = false;
      }
      else if (this.summaries[this.selectedCardKey].statuses[0] === ClaimStatus.REJECTED.toLowerCase()) {
        this.isRevalidate = false;
        this.isSubmit = false;
        this.summaries[key].statuses = this.summaries[key].statuses.filter(ele => ele !== 'invalid');
      }
      else if (this.summaries[this.selectedCardKey].statuses[0] === ClaimStatus.INVALID.toLowerCase()) {
        this.isRevalidate = true;
        this.isSubmit = false;
      }
      else {
        this.isRevalidate = false;
        this.isSubmit = false;
      }
    }

    const name = this.commen.statusToName(this.summaries[this.selectedCardKey].statuses[0]).toLocaleUpperCase();
    this.isDeleteBtnVisible = (name === ClaimStatus.PARTIALLY_PAID || name === ClaimStatus.PAID || name === ClaimStatus.Under_Processing || this.summaries[this.selectedCardKey].statuses[0] === ClaimStatus.REJECTED.toLocaleLowerCase()) ? false : true;

    this.claims = new Array();
    this.store.dispatch(storeClaims({
      claims: this.claims,
      currentPage: page,
      maxPages: this.searchResult != null ? this.searchResult.totalPages : 0,
      pageSize: pageSize
    }));
    this.searchResult = null;
    this.currentSelectedTab = 0;
    this.validationDetails = [];
    this.searchService.getResults(this.providerId,
      this.from,
      this.to,
      this.payerId,
      this.summaries[key].statuses,
      page,
      pageSize,
      this.batchId,
      this.uploadId,
      this.casetype,
      this.claimRefNo,
      this.memberId,
      this.invoiceNo,
      this.patientFileNo,
      this.policyNo).subscribe((event) => {
        if (event instanceof HttpResponse) {
          if ((event.status / 100).toFixed() == '2') {
            this.searchResult = new PaginatedResult(event.body, SearchedClaim);
            this.claims = this.searchResult.content;
            this.storeSearchResultsForClaimViewPagination();
            this.store.dispatch(setSearchCriteria({ statuses: this.summaries[key].statuses }));
            this.store.dispatch(storeClaims({
              claims: this.claims,
              currentPage: this.searchResult.number,
              maxPages: this.searchResult.totalPages,
              pageSize: this.searchResult.size
            }));
            this.selectedClaimsCountOfPage = 0;
            for (const claim of this.claims) {
              if (this.selectedClaims.includes(claim.claimId)) { this.selectedClaimsCountOfPage++; }
            }
            if (this.payerId == null) { this.payerId = this.claims[0].payerId; }
            this.setAllCheckBoxIsIndeterminate();
            this.detailCardTitle = this.commen.statusToName(this.summaries[key].statuses[0]);
            const pages = Math.ceil((this.searchResult.totalElements / this.searchResult.numberOfElements));
            this.paginatorPagesNumbers = Array(pages).fill(pages).map((x, i) => i);
            this.manualPage = this.searchResult.number;
            // Validation Details
            const content = event.body['content'];
            this.validationDetails = [];
            content.forEach((element) => {
              if (element.claimErrors && element.claimErrors.length > 0) {
                const claimErrors = element.claimErrors;
                claimErrors.forEach((error) => {
                  const claimError = new ClaimError();
                  claimError.providerClaimeNo = element.providerClaimNumber;
                  claimError.status = element.status;
                  claimError.fieldName = error.fieldName;
                  claimError.description = error.description;
                  claimError.code = error.code;
                  this.validationDetails.push(claimError);
                });
              }
            });

          } else if ((event.status / 100).toFixed() == '4') {
            console.log('400');
          } else if ((event.status / 100).toFixed() == '5') {
            console.log('500');
          } else {
            console.log('000');
          }
          this.commen.loadingChanged.next(false);
        }
        if (this.claimId != null) {
          const index = this.claims.findIndex(claim => claim.claimId == this.claimId);
          if (index != -1) {
            this.showClaim(this.claims[index].status, this.claimId, (this.editMode != null && this.editMode == 'true'));
          }
        }
      }, error => {
        if (error instanceof HttpErrorResponse) {
          if ((error.status / 100).toFixed() == '4') {
            this.errorMessage = 'Access Denied.';
          } else if ((error.status / 100).toFixed() == '5') {
            this.errorMessage = 'Server could not handle the request. Please try again later.';
          } else {
            this.errorMessage = 'Somthing went wrong.';
          }
        }
        this.commen.loadingChanged.next(false);
      });

    const status = this.routeActive.snapshot.queryParamMap.get('status');


    this.status = status === null ? this.status : status;
  }
  storeSearchResultsForClaimViewPagination() {
    if (this.claims != null && this.claims.length > 0) {
      const claimsIds = this.claims.map(claim => claim.claimId);
      localStorage.setItem(SEARCH_TAB_RESULTS_KEY, claimsIds.join(','));
    } else {
      localStorage.removeItem(SEARCH_TAB_RESULTS_KEY);
    }
  }

  submitSelectedClaims() {
    if (this.commen.loading) {
      return;
    } else if (this.selectedClaims.length == 0) {
      this.dialogService.openMessageDialog(new MessageDialogData('', 'Please select at least 1 Accepted claim first.', true));
      return;
    }
    this.commen.loadingChanged.next(true);
    this.submittionService.submitClaims(this.selectedClaims, this.providerId, this.payerId).subscribe((event) => {
      if (event instanceof HttpResponse) {
        if (event.body['queuedStatus'] == 'QUEUED') {
          this.dialogService.openMessageDialog(
            new MessageDialogData('Success', 'The selected claims were queued to be submitted.', false)
          ).subscribe(result => {
            this.resetURL();
            this.fetchData();
          });
        }
        if (event['error'] != null) {
          for (const error of event['error']['errors']) {
            this.submittionErrors.set(error['claimID'], 'Code: ' + error['errorCode'] + ', Description: ' + error['errorDescription']);
          }
        }
        this.commen.loadingChanged.next(false);
      }
      this.deSelectAll();
    }, errorEvent => {
      this.commen.loadingChanged.next(false);
      if (errorEvent instanceof HttpErrorResponse) {
        if (errorEvent.status >= 500 || errorEvent.status == 0) {
          if (errorEvent.status == 501 && errorEvent.error['errors'] != null) {
            this.dialogService.openMessageDialog(new MessageDialogData('', errorEvent.error['errors'][0].errorDescription, true));
          } else {
            this.dialogService.openMessageDialog(new MessageDialogData('', 'Could not reach the server. Please try again later.', true));
          }
        }
        if (errorEvent.error['errors'] != null) {
          for (const error of errorEvent.error['errors']) {
            this.submittionErrors.set(error['claimID'], 'Code: ' + error['errorCode'] + ', Description: ' + error['errorDescription']);
          }
        }
      }
      this.deSelectAll();
    });
  }

  submitAllAcceptedClaims() {
    if (this.commen.loading) {
      return;
    }



    this.commen.loadingChanged.next(true);
    this.submittionService.submitAllClaims(this.providerId, this.from, this.to, this.payerId, this.batchId, this.uploadId, this.casetype,
      this.claimRefNo, this.memberId, this.invoiceNo, this.patientFileNo, this.policyNo).subscribe((event) => {

        if (event instanceof HttpResponse) {
          if (event.body['queuedStatus'] == 'QUEUED') {
            this.dialogService.openMessageDialog(
              new MessageDialogData('Success', 'The selected claims were queued to be submitted.', false)
            ).subscribe(result => {
              this.resetURL();
              this.fetchData();
            });
          }
          this.commen.loadingChanged.next(false);
        }
      }, errorEvent => {
        this.commen.loadingChanged.next(false);
        if (errorEvent instanceof HttpErrorResponse) {
          if (errorEvent.status >= 500 || errorEvent.status == 0) {
            if (errorEvent.status == 501 && errorEvent.error['errors'] != null) {
              this.dialogService.openMessageDialog(new MessageDialogData('', errorEvent.error['errors'][0].errorDescription, true));
            } else {
              this.dialogService.openMessageDialog(new MessageDialogData('', 'Could not reach the server. Please try again later.', true));
            }
          }
          if (errorEvent.error['errors'] != null) {
            for (const error of errorEvent.error['errors']) {
              this.submittionErrors.set(error['claimID'], 'Code: ' + error['errorCode'] + ', Description: ' + error['errorDescription']);
            }
          }
        }
      });
  }

  reValidateClaims() {

    if (this.commen.loading) { return; }
    this.commen.loadingChanged.next(true);
    this.validationService.reValidateClaims(this.providerId,
      this.payerId,
      this.batchId,
      this.uploadId,
      null,
      this.claimRefNo,
      this.patientFileNo,
      this.invoiceNo,
      this.policyNo,
      this.summaries[this.selectedCardKey].statuses,
      this.memberId,
      this.selectedClaims,
      this.from, this.to)
      .subscribe(event => {
        if (event instanceof HttpResponse) {
          const numberOfClaims = event.body['numberOfClaims'];
          const numberOfRejectedClaims = event.body['numberOfRejectedClaims'];
          const numberOfAcceptedClaims = event.body['numberOfAcceptedClaims'];
          const numberOfDownloadableClaims = event.body['numberOfDownloadableClaims'];

          this.dialogService.openMessageDialog({
            title: 'Validation Results',
            message: `No. of Cliam: ${numberOfClaims} \nNo of Rejected by Waseel: ${numberOfRejectedClaims}\nNo. of Ready submission:${numberOfAcceptedClaims} \nNo. of Downloadable:${numberOfDownloadableClaims}`,
            isError: false
          }).subscribe(result => {
            location.reload();
          });

          this.commen.loadingChanged.next(false);

        }
      }, errorEvent => {
        if (errorEvent instanceof HttpErrorResponse) {
          this.dialogService.openMessageDialog({
            title: 'Validation Results',
            message: errorEvent.message,
            isError: true
          });



        }
        this.commen.loadingChanged.next(false);
      });
  }


  get hasData() {
    this.extraNumbers = new Array();
    this.extraCards = 6 - this.summaries.length;
    if (this.extraCards < 0) { this.extraCards = 0; }
    for (let i = 0; i < this.extraCards; i++) {
      this.extraNumbers.push(i);
    }
    return this.summaries.length > 0;
  }
  get loading() {
    return this.commen.loading;
  }



  get paginatorLength() {
    if (this.searchResult != null) {
      return this.searchResult.totalElements;
    } else { return 0; }
  }


  paginatorAction(event) {
    this.manualPage = event['pageIndex'];
    if (this.summaries[this.selectedCardKey] != null) {
      this.getResultsOfStatus(this.selectedCardKey, event['pageIndex'], event['pageSize']);
    }
  }
  updateManualPage(index) {
    this.manualPage = index;
    this.paginatorAction({
      previousPageIndex: this.searchResult.number,
      pageIndex: index,
      pageSize: this.searchResult.numberOfElements,
      length: this.searchResult.size
    });
  }

  setAllCheckBoxIsIndeterminate() {
    if (this.claims != null) {
      this.allCheckBoxIsIndeterminate = this.selectedClaimsCountOfPage != this.claims.length && this.selectedClaimsCountOfPage != 0;
    } else { this.allCheckBoxIsIndeterminate = false; }
    this.setAllCheckBoxIsChecked();
  }
  setAllCheckBoxIsChecked() {
    if (this.claims != null) {
      this.allCheckBoxIsChecked = this.selectedClaimsCountOfPage == this.claims.length;
    } else { this.allCheckBoxIsChecked = false; }
  }
  selectClaim(claimId: string) {
    if (!this.selectedClaims.includes(claimId)) {
      this.selectedClaims.push(claimId);
      this.selectedClaimsCountOfPage++;
    } else {
      this.selectedClaims.splice(this.selectedClaims.indexOf(claimId), 1);
      this.selectedClaimsCountOfPage--;
    }
    this.setAllCheckBoxIsIndeterminate();
  }
  selectAllinPage() {
    if (this.selectedClaimsCountOfPage != this.claims.length) {
      for (const claim of this.claims) {
        if (!this.selectedClaims.includes(claim.claimId)) {
          this.selectClaim(claim.claimId);
        }
      }
    } else {
      for (const claim of this.claims) {
        this.selectClaim(claim.claimId);
      }
    }
  }
  deSelectAll() {
    if (this.allCheckBoxIsIndeterminate) {
      this.selectAllinPage();
      this.selectAllinPage();
    } else if (this.allCheckBoxIsChecked) {
      this.selectAllinPage();
    }
  }

  get selectionCountText() {
    if (this.searchResult != null) {
      return this.selectedClaims.length + ' of ' + this.searchResult.totalElements + ' are selected.';
    } else { return '0 of 0 are selected.'; }
  }

  resetURL() {
    if (this.routerSubscription.closed) { return; }
    let claimInfo = '', path = '';
    if (this.claimId != null) {
      claimInfo = `&claimId=${this.claimId}`;
    }
    if (this.editMode != null) {
      claimInfo += `&editMode=${this.editMode}`;
    }
    if (this.from != null && this.to != null && this.payerId != null) {
      path = `/${this.providerId}/claims?from=${this.from}&to=${this.to}&payer=${this.payerId}`
        + (this.casetype != null ? `&casetype=${this.casetype}` : '') + claimInfo;

    } else if (this.batchId != null) {
      path = `/${this.providerId}/claims?batchId=${this.batchId}` + claimInfo;
    } else if (this.uploadId != null) {
      path = `/${this.providerId}/claims?uploadId=${this.uploadId}` + claimInfo;
    } else if (this.claimRefNo != null) {
      path = `/${this.providerId}/claims?claimRefNo=${this.claimRefNo}` + claimInfo;
    } else if (this.memberId != null) {
      path = `/${this.providerId}/claims?memberId=${this.memberId}` + claimInfo;
    } else if (this.invoiceNo != null) {
      path = `/${this.providerId}/claims?invoiceNo=${this.invoiceNo}` + claimInfo;
    } else if (this.patientFileNo != null) {
      path = `/${this.providerId}/claims?patientFileNo=${this.patientFileNo}` + claimInfo;
    } else if (this.policyNo != null) {
      path = `/${this.providerId}/claims?policyNo=${this.policyNo}` + claimInfo;
    }
    if (this.selectedCardKey != 0) {
      path += `&status=${this.selectedCardKey}`
    }
    if (this.selectedPage != null && this.selectedPage > 0) {
      path += `&page=${(this.selectedPage + 1)}`
    }
    if (path !== '')
      this.location.go(path);
  }


  showClaim(claimStatus: string, claimId: string, edit?: boolean) {
    window.open(`${location.protocol}//${location.host}/${location.pathname.split('/')[1]}/claims/${claimId}` +
      (edit != null && edit ? '#edit' : ''));
  }

  reloadClaim(claim: ViewedClaim) {
    let flag = false;
    const index = this.claims.findIndex(oldClaim => oldClaim.claimId == `${claim.claimid}`);
    const oldStatus = this.claims[index].status;
    if (oldStatus != claim.status) {
      const summaries = this.summaries;

      const oldSummaryIndex = summaries.findIndex(summary => summary.statuses.includes(this.claims[index].status.toLowerCase()));
      summaries[oldSummaryIndex] = {
        totalClaims: this.summaries[oldSummaryIndex].totalClaims - 1,
        totalNetAmount: this.summaries[oldSummaryIndex].totalNetAmount - claim.net,
        totalVatNetAmount: this.summaries[oldSummaryIndex].totalVatNetAmount - claim.netvatamount,
        statuses: this.summaries[oldSummaryIndex].statuses,
        uploadName: this.summaries[oldSummaryIndex].uploadName
      };
      this.claims[index].status = claim.status;
      const newSummaryIndex = summaries.findIndex(summary => summary.statuses.includes(claim.status.toLowerCase()));
      if (newSummaryIndex != -1) {
        summaries[newSummaryIndex] = {
          totalClaims: this.summaries[newSummaryIndex].totalClaims + 1,
          totalNetAmount: this.summaries[newSummaryIndex].totalNetAmount + claim.net,
          totalVatNetAmount: this.summaries[newSummaryIndex].totalVatNetAmount + claim.netvatamount,
          statuses: this.summaries[newSummaryIndex].statuses,
          uploadName: this.summaries[newSummaryIndex].uploadName
        };
        window.setTimeout(() => {
          this.summaries = summaries;
        }, 1000);
      } else {
        flag = true;
        this.fetchData();
      }
    }
    if (!flag) {
      if (this.selectedCardKey != 0 && oldStatus != this.claims[index].status) {
        this.claims.splice(index, 1);
      } else {
        this.claims[index].memberId = claim.memberid;
        this.claims[index].policyNumber = claim.policynumber;
        this.claims[index].nationalId = claim.nationalId;
        this.claims[index].numOfPriceListErrors = claim.errors.filter(error => error.code == 'SERVCOD-VERFIY' ||
          error.code == 'SERVCOD-RESTRICT').length;
        this.claims[index].numOfAttachments = claim.attachments.length;
        this.claims[index].eligibilitycheck = null;
      }
    }
  }

  checkClaim(id: string) {
    this.eligibilityWaitingList[id] = { result: '', waiting: true };
    this.handleEligibilityCheckRequest(this.eligibilityService.checkEligibility(this.providerId, this.payerId, [Number.parseInt(id, 10)]));
  }

  checkSelectedClaims() {
    this.selectedClaims.forEach(claimid => this.eligibilityWaitingList[claimid] = { result: '', waiting: true });
    this.waitingEligibilityCheck = true;
    this.handleEligibilityCheckRequest(this.eligibilityService.checkEligibility(this.providerId,
      this.payerId,
      this.selectedClaims.map(id => Number.parseInt(id, 10))));
  }


  checkAllClaims() {
    this.waitingEligibilityCheck = true;

    this.handleEligibilityCheckRequest(this.eligibilityService.checkEligibilityByDateOrUploadId(this.providerId,
      this.payerId,
      this.from,
      this.to,
      this.uploadId,
      this.batchId,
      this.claimRefNo,
      this.memberId,
      this.invoiceNo,
      this.patientFileNo,
      this.policyNo,
      this.casetype));
  }
  /*checkAllClaims() {
    this.waitingEligibilityCheck = true;
    this.handleEligibilityCheckRequest(this.eligibilityService.checkEligibilityByDateOrUploadId(this.providerId,
      this.payerId,
      this.from,
      this.to,
      this.uploadId));
  }*/

  handleEligibilityCheckRequest(request: Observable<HttpEvent<unknown>>) {
    this.watchEligibilityChanges();
    request.subscribe(event => {
      if (event instanceof HttpResponse) {
        this.deSelectAll();
      }
    }, errorEvent => {
      this.waitingEligibilityCheck = false;
      this.eligibilityWaitingList = [];
      if (errorEvent instanceof HttpErrorResponse) {
        if (errorEvent.status == 400) {
          this.dialogService.openMessageDialog(new MessageDialogData(
            '', 'Some of the selected claims are already checked or are not ready for submission.', true)
          );
        } else if ((errorEvent.status / 100).toFixed() == '5') {
          if (errorEvent.error['errors'] != null) {
            this.dialogService.openMessageDialog(new MessageDialogData('', errorEvent.error['errors'][0].errorDescription, true));

          } else {
            this.dialogService.openMessageDialog(
              new MessageDialogData('', 'Could not reach the server at the moment. Please try again leter.', true)
            );
          }
        }
      }
    });
  }
  watchEligibilityChanges() {
    if (this.watchingEligibility) { return; }

    this.watchingEligibility = true;

    this.notificationService.startWatchingMessages(this.providerId, 'eligibility');
    this.notificationService._messageWatchSources['eligibility'].subscribe(value => {
      value = value.replace(`"`, '').replace(`"`, '');
      const splitedValue: string[] = value.split(':');
      if (splitedValue.length == 2) {
        const index = this.claims.findIndex(claim => claim.claimId == splitedValue[0]);
        if (index > -1) {
          this.claims[index].eligibilitycheck = splitedValue[1];
        }
        if (this.eligibilityWaitingList[splitedValue[0]] != null) {
          this.eligibilityWaitingList[splitedValue[0]].result = splitedValue[1];
          this.eligibilityWaitingList[splitedValue[0]].waiting = false;
        }
      }
      if ((this.eligibilityWaitingList.length != 0 && this.eligibilityWaitingList.every(claim => !claim.waiting))
        || this.claims.every(claim => claim.status == 'Accepted' && claim.eligibilitycheck != null)) {
        // this.notificationService.stopWatchingMessages('eligibility');
        this.waitingEligibilityCheck = false;
      }
    });
  }

  claimIsWaitingEligibility(claimId: string) {
    return this.eligibilityWaitingList[claimId] != null && this.eligibilityWaitingList[claimId].waiting;
  }
  get isWaitingForEligibility() {
    return this.waitingEligibilityCheck;
  }

  deleteClaim(claimId: string, refNumber: string) {
    this.dialogService.openMessageDialog(
      new MessageDialogData('Delete Claim?',
        `This will delete claim with reference: ${refNumber}. Are you sure you want to delete it? This cannot be undone.`,
        false,
        true))
      .subscribe(result => {
        if (result === true) {
          this.commen.loadingChanged.next(true);
          this.claimService.deleteClaim(this.providerId, claimId).subscribe(event => {
            if (event instanceof HttpResponse) {
              this.commen.loadingChanged.next(false);
              this.dialogService.openMessageDialog(new MessageDialogData('',
                `Claim with reference ${refNumber} was deleted successfully.`,
                false))
                .subscribe(afterColse => this.fetchData());
            }
          }, errorEvent => {
            if (errorEvent instanceof HttpErrorResponse) {
              this.commen.loadingChanged.next(false);
              this.dialogService.openMessageDialog(new MessageDialogData('', errorEvent.message, true));
            }
          });
        }
      });
  }

  async download() {
    if (this.detailTopActionIcon == 'ic-check-circle.svg') { return; }
    this.commen.loadingChanged.next(true);
    let event;
    event = await this.searchService.downloadSummaries(this.providerId,
      this.summaries[this.selectedCardKey].statuses,
      this.from,
      this.to,
      this.payerId,
      this.batchId,
      this.uploadId,
      this.claimRefNo,
      this.memberId,
      this.invoiceNo,
      this.patientFileNo,
      this.policyNo).toPromise().catch(error => {
        if (error instanceof HttpErrorResponse) {
          this.dialogService.openMessageDialog(new MessageDialogData('',
            'Could not reach the server at the moment. Please try again later.',
            true));
        }
        this.commen.loadingChanged.next(false);
      });

    if (event instanceof HttpResponse) {
      if (navigator.msSaveBlob) { // IE 10+
        const exportedFilenmae = this.detailCardTitle + '_' + this.from + '_' + this.to + '.csv';
        const blob = new Blob([event.body as BlobPart], { type: 'text/csv;charset=utf-8;' });
        navigator.msSaveBlob(blob, exportedFilenmae);
      } else {
        const a = document.createElement('a');
        const excelData = event.body + '';
        a.href = 'data:attachment/csv;charset=ISO-8859-1,' + encodeURIComponent(excelData);
        a.target = '_blank';
        if (this.from != null) {
          a.download = this.detailCardTitle + '_' + this.from + '_' + this.to + '.csv';
        } else if (this.batchId != null) {
          a.download = this.detailCardTitle + '_Batch_' + this.batchId + '.csv';
        } else if (this.uploadId != null) {
          a.download = this.detailCardTitle + '_ClaimsIn_' + this.summaries[0].uploadName + '.csv';
        } else if (this.claimRefNo != null) {
          a.download = this.detailCardTitle + '_RefNo_' + this.claimRefNo + '.csv';
        } else if (this.memberId != null) {
          a.download = this.detailCardTitle + '_Member_' + this.memberId + '.csv';
        } else if (this.invoiceNo != null) {
          a.download = this.detailCardTitle + '_InvoiceNo_' + this.invoiceNo + '.csv';
        } else if (this.patientFileNo != null) {
          a.download = this.detailCardTitle + '_PatientFileNo_' + this.patientFileNo + '.csv';
        } else if (this.policyNo != null) {
          a.download = this.detailCardTitle + '_PolicyNo_' + this.policyNo + '.csv';
        }

        a.click();
        this.detailTopActionIcon = 'ic-check-circle.svg';
        this.commen.loadingChanged.next(false);
      }
    }
  }

  submitAll() {
    if (this.selectedClaims.length == 0) {
      this.submitAllAcceptedClaims();
    } else {
      this.submitSelectedClaims();
    }
  }

  get isLoading() {
    return this.commen.loading;
  }

  get uploadNameExist() {
    return this.summaries[0] != null && this.summaries[0].uploadName != null;
  }

  getIsRejectedByPayer(status: string) {
    return status == ClaimStatus.INVALID ||
      status == ClaimStatus.REJECTED ||
      status == ClaimStatus.PARTIALLY_PAID ||
      status == ClaimStatus.PARTIALLY_APPROVED;
  }

  accentColor(status) {
    return this.commen.getCardAccentColor(status);
  }

  goToFirstPage() {
    this.paginatorAction({ pageIndex: 0, pageSize: 10 });
  }
  goToPrePage() {
    if (this.searchResult.number != 0) {
      this.paginatorAction({ pageIndex: this.searchResult.number - 1, pageSize: 10 });
    }
  }
  goToNextPage() {
    if (this.searchResult.number + 1 < this.searchResult.totalPages) {
      this.paginatorAction({ pageIndex: this.searchResult.number + 1, pageSize: 10 });
    }
  }
  goToLastPage() {
    this.paginatorAction({ pageIndex: this.searchResult.totalPages - 1, pageSize: 10 });
  }

  nextSummary() {
    if (this.currentSummariesPage + 1 < this.summaries.length) {
      this.currentSummariesPage++;
    }
  }
  previousSummary() {
    if (this.currentSummariesPage - 1 > 0) {
      this.currentSummariesPage--;
    }
  }

  isEligibleState(status: string) {
    if (status == null) { return false; }
    return status.toLowerCase() == 'eligible';
  }

  get showEligibilityButton() {
    return this.summaries[this.selectedCardKey].statuses.includes('accepted') ||
      this.summaries[this.selectedCardKey].statuses.includes('all');
  }
  deleteClaimByUploadid() {
    this.dialogService.openMessageDialog(
      new MessageDialogData('Delete Upload?',
        `This will delete all claims according to your selection criteria. Are you sure you want to delete it? This cannot be undone.`,
        false,
        true))
      .subscribe(result => {
        if (result === true) {
          this.commen.loadingChanged.next(true);
          this.claimService.deleteClaimByUploadid(this.providerId, this.payerId, this.batchId, this.uploadId, null, this.claimRefNo, this.patientFileNo, this.invoiceNo, this.policyNo, this.summaries[this.selectedCardKey].statuses, this.memberId, this.selectedClaims, this.from, this.to).subscribe(event => {
            if (event instanceof HttpResponse) {
              this.commen.loadingChanged.next(false);
              const status = event.body['status'];
              if (status == "Deleted") {
                this.dialogService.openMessageDialog(
                  new MessageDialogData('',
                    `Your claims deleted successfully.`,
                    false))
                  .subscribe(afterColse => {
                    // this.claimService.summaryChange.next(new UploadSummary());
                    // this.router.navigate(['']);
                    location.reload();
                  });
              }
              else {
                const error = event.body['errors'];
                this.dialogService.openMessageDialog(
                  new MessageDialogData('',
                    error[0].description,
                    false));
              }

            }
          }, errorEvent => {
            if (errorEvent instanceof HttpErrorResponse) {
              this.commen.loadingChanged.next(false);
              this.dialogService.openMessageDialog(new MessageDialogData('', errorEvent.message, true));
            }
          });
        }
      });
  }

  isUnderProcessingStatus(status: string) {
    status = status.toUpperCase();
    return status == ClaimStatus.OUTSTANDING.toUpperCase() ||
      status == 'PENDING' || status == 'UNDER_PROCESS';
  }

  isRejectedByPayerStatus(status: string) {
    status = status.toUpperCase();
    return status == ClaimStatus.REJECTED.toUpperCase() ||
      status == 'DUPLICATE';
  }

  isReadyForSubmissionStatus(status: string) {
    status = status.toUpperCase();
    return status == ClaimStatus.Accepted.toUpperCase() ||
      status == 'FAILED';
  }

  isPaidStatus(status: string) {
    status = status.toUpperCase();
    return status == ClaimStatus.PAID.toUpperCase() ||
      status == 'SETTLED';
  }
  isInvalidStatus(status: string) {
    status = status.toUpperCase();
    return status == ClaimStatus.INVALID.toUpperCase();
  }
}


export const SEARCH_TAB_RESULTS_KEY = 'search_tab_result';
