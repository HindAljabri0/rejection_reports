import { Location } from '@angular/common';
import { HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';
import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as JSZip from 'jszip';
import * as moment from 'moment';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ClaimListModel } from 'src/app/claim-module-components/models/claim-list.model';
import { ClaimError } from 'src/app/models/claimError';
import { ClaimListFilterSelection } from 'src/app/models/claimListSearch';
import { ClaimStatus } from 'src/app/models/claimStatus';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { DownloadStatus } from 'src/app/models/downloadRequest';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { SearchedClaim } from 'src/app/models/searchedClaim';
import { SearchStatusSummary } from 'src/app/models/searchStatusSummary';
import { UploadSummary } from 'src/app/models/uploadSummary';
import { ViewedClaim } from 'src/app/models/viewedClaim';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { ClaimService } from 'src/app/services/claimService/claim.service';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { DownloadService } from 'src/app/services/downloadService/download.service';
import { EligibilityService } from 'src/app/services/eligibilityService/eligibility.service';
import { NotificationsService } from 'src/app/services/notificationService/notifications.service';
import { ValidationService } from 'src/app/services/validationService/validation.service';
import { ClaimSubmittionService } from '../../services/claimSubmittionService/claim-submittion.service';
import { SearchService } from '../../services/serchService/search.service';
import { SharedServices } from '../../services/shared.services';
import { setSearchCriteria, storeClaims } from './store/search.actions';


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
    autoWidth: true,
    responsive: {
      0: {
        items: 3,
        slideBy: 3
      },
      992: {
        items: 4,
        slideBy: 4
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
  manualPage = null;


  selectedCardKey: number;

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
  isDeleteBtnVisible = true;
  status: any = 1;
  isAllCards = false;

  length = 0;
  pageSize = 100;
  pageIndex = 0;
  pageSizeOptions = [10, 50, 100];
  showFirstLastButtons = true;
  allFilters: any = [
    { key: 'CLAIMDATE', value: 'claimDate' },
    { key: 'CLAIMREFNO', value: 'claimRefNO' },
    { key: 'DR_NAME', value: 'drName' },
    { key: 'MEMBERID', value: 'memberID' },
    { key: 'NATIONALID', value: 'nationalId' },
    { key: 'PATIENTFILENO', value: 'patientFileNO' },
  ];
  appliedFilters: any = [];
  fdrname = '';
  fnationalid = '';
  fclaimdate = '';
  fclaimRefNo = '';
  fmemberId = '';
  fpatientFileNo = '';

  isPBMValidationVisible = false;
  apiPBMValidationEnabled: any;
  claimList: ClaimListModel = new ClaimListModel();
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
    private adminService: AdminService,
    private downloadService: DownloadService,
    private actions$: Actions) { }

  ngOnDestroy(): void {
    this.notificationService.stopWatchingMessages('eligibility');
    localStorage.removeItem(SEARCH_TAB_RESULTS_KEY);
    this.routerSubscription.unsubscribe();
  }

  ngOnInit() {
    this.pageSize = localStorage.getItem('pagesize') != null ? Number.parseInt(localStorage.getItem('pagesize'), 10) : 10;
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
    // this.actions$.pipe(
    //   ofType(requestClaimsPage),
    // ).subscribe(data => {
    //   switch (data.action) {
    //     case SearchPaginationAction.firstPage:
    //       this.getResultsOfStatus(this.selectedCardKey, this.pageIndex, this.pageSize);
    //       break;
    //     case SearchPaginationAction.previousPage:
    //       this.goToPrePage();
    //       break;
    //     case SearchPaginationAction.nextPage:
    //       this.goToNextPage();
    //       break;
    //     case SearchPaginationAction.lastPage:
    //       this.goToLastPage();
    //       break;
    //   }
    // });
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
      this.fdrname = value.drname;
      this.fnationalid = value.nationalId;
      this.fclaimdate = value.claimDate;

      this.reloadFilterParams(value);


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
    const statusCode = await this.getSummaryOfStatus([ClaimStatus.ALL]);
    if (statusCode == 200 && this.summaries[0] != null && this.summaries[0].statuses != null) {
      const statuses = this.summaries[0].statuses;
      statuses.sort((s1, s2) => {
        if (this.isReadyForSubmissionStatus(s1) || s1 == 'NotAccepted' || s1 == 'Batched' || this.isUnderProcessingStatus(s1)) {
          return -1;
        } else if (this.isReadyForSubmissionStatus(s2) || s2 == 'NotAccepted' || s2 == 'Batched' || this.isUnderProcessingStatus(s2)) {
          return 1;
        }
        return 0;
      });
      let underProcessingIsDone = false;
      let rejectedByPayerIsDone = false;
      let readyForSubmissionIsDone = false;
      let paidIsDone = false;
      let invalidIsDone = false;
      for (const status of statuses) {
        if (this.isUnderProcessingStatus(status)) {
          if (!underProcessingIsDone) {
            await this.getSummaryOfStatus([ClaimStatus.OUTSTANDING, 'PENDING', 'UNDER_PROCESS']);
          }
          underProcessingIsDone = true;
        } else if (this.isRejectedByPayerStatus(status)) {
          if (!rejectedByPayerIsDone) {
            await this.getSummaryOfStatus([ClaimStatus.REJECTED, 'DUPLICATE']);
          }
          rejectedByPayerIsDone = true;
        } else if (this.isReadyForSubmissionStatus(status)) {
          if (!readyForSubmissionIsDone) {
            await this.getSummaryOfStatus([ClaimStatus.Accepted, 'Failed']);
          }
          readyForSubmissionIsDone = true;
        } else if (this.isPaidStatus(status)) {
          if (!paidIsDone) {
            await this.getSummaryOfStatus([ClaimStatus.PAID, 'SETTLED']);
          }
          paidIsDone = true;
        } else if (this.isInvalidStatus(status)) {
          if (!invalidIsDone) {
            await this.getSummaryOfStatus([ClaimStatus.INVALID, 'RETURNED']);
          }
          invalidIsDone = true;
        } else {
          await this.getSummaryOfStatus([status]);
        }
      }
    }

    this.getResultsOfStatus(this.queryStatus, this.queryPage);

    if (!this.hasData && this.errorMessage == null) { this.errorMessage = 'Sorry, we could not find any result.'; }
  }
  reloadFilterParams(params) {
    this.fclaimRefNo = params.filter_claimRefNo !== undefined
      && params.filter_claimRefNo !== null
      && params.filter_claimRefNo !== '' ? params.filter_claimRefNo : this.claimRefNo;
    this.fmemberId = params.filter_memberId !== undefined
      && params.filter_memberId !== null
      && params.filter_memberId !== '' ? params.filter_memberId : this.memberId;
    this.fpatientFileNo = params.filter_patientFileNo !== undefined
      && params.filter_patientFileNo !== null
      && params.filter_patientFileNo !== '' ? params.filter_patientFileNo : this.patientFileNo;
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

  getResultsOfStatus(key: number, page?: number) {
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
    this.resetURL();


    if (key == 0) {
      this.isRevalidate = false;
      this.isSubmit = false;
      this.isAllCards = true;
    } else {
      if (this.summaries[key].statuses[0].toLowerCase() == ClaimStatus.Accepted.toLowerCase()) {
        this.isRevalidate = true;
        this.isSubmit = true;
      } else if (this.summaries[key].statuses[0].toLowerCase() == ClaimStatus.NotAccepted.toLowerCase()) {
        this.isRevalidate = true;
        this.isSubmit = false;
      } else if (this.summaries[this.selectedCardKey].statuses[0] === ClaimStatus.REJECTED.toLowerCase()) {
        this.isRevalidate = false;
        this.isSubmit = false;
        this.summaries[key].statuses = this.summaries[key].statuses.filter(ele => ele !== 'invalid');
      } else if (this.summaries[this.selectedCardKey].statuses[0] === ClaimStatus.INVALID.toLowerCase()) {
        this.isRevalidate = true;
        this.isSubmit = false;
      } else {
        this.isRevalidate = false;
        this.isSubmit = false;
      }
      this.isAllCards = false;
    }

    const name = this.commen.statusToName(this.summaries[this.selectedCardKey].statuses[0]).toLowerCase();
    this.isDeleteBtnVisible = (name === ClaimStatus.PARTIALLY_PAID.toLowerCase()
      || name === ClaimStatus.PAID.toLowerCase()
      || name === ClaimStatus.Under_Processing.toLowerCase()
      || name === ClaimStatus.Under_Submision.toLowerCase()
      || this.summaries[this.selectedCardKey].statuses[0] === ClaimStatus.REJECTED.toLowerCase()) ? false : true;
    this.isPBMValidationVisible = this.apiPBMValidationEnabled
      && this.summaries[this.selectedCardKey].statuses[0] === ClaimStatus.Accepted.toLowerCase() ? true : false;

    this.claims = new Array();
    this.store.dispatch(storeClaims({
      claims: this.claims,
      currentPage: page,
      maxPages: this.searchResult != null ? this.searchResult.totalPages : 0,
      pageSize: this.pageSize
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
      this.pageSize,
      this.batchId,
      this.uploadId,
      this.casetype,
      this.fclaimRefNo,
      this.fmemberId,
      this.invoiceNo,
      this.fpatientFileNo,
      this.policyNo,
      this.fdrname,
      this.fnationalid,
      this.fclaimdate).subscribe((event) => {
        if (event instanceof HttpResponse) {
          if ((event.status / 100).toFixed() == '2') {
            this.searchResult = new PaginatedResult(event.body, SearchedClaim);
            if (this.searchResult.content.length > 0) {
              this.claims = this.searchResult.content;
              this.length = this.searchResult.totalElements;
              this.pageSize = this.searchResult.size;
              this.pageIndex = this.searchResult.number;
              console.log('this.length:' + this.length + 'this.pageSize:' + this.pageSize + 'this.pageIndex:' + this.pageIndex);
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

          }
          if (this.claimId != null) {
            const index = this.claims.findIndex(claim => claim.claimId == this.claimId);
            if (index != -1) {
              this.showClaim(this.claims[index].status, this.claimId, (this.editMode != null && this.editMode == 'true'));
              this.claimId = null;
              this.editMode = null;
            }
          }
          this.commen.loadingChanged.next(false);
          this.reloadFilters();

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
    this.getPBMValidation();
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
    this.submittionService.submitAllClaims(this.providerId, null, null, null, null, null, null, this.selectedClaims).subscribe((event) => {
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
    this.submittionService.submitAllClaims(this.providerId, this.from, this.to, this.payerId, this.batchId, this.uploadId, [this.casetype],
      null, this.fclaimRefNo, this.fmemberId, this.invoiceNo, this.fpatientFileNo, this.policyNo, this.fdrname, this.fnationalid,
      this.fclaimdate).subscribe((event) => {

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
      null,
      this.batchId,
      this.uploadId,
      null,
      this.fclaimRefNo,
      this.fpatientFileNo,
      this.invoiceNo,
      this.policyNo,
      this.summaries[this.selectedCardKey].statuses,
      this.fmemberId,
      this.selectedClaims,
      this.from, this.to, this.fdrname, this.fnationalid, this.fclaimdate)
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
    let claimInfo = '';
    let path = '';
    if (this.claimId != null) {
      claimInfo = `&claimId=${this.claimId}`;
    }
    if (this.editMode != null) {
      claimInfo += `&editMode=${this.editMode}`;
    }
    if (this.from != null && this.to != null && this.payerId != null && this.uploadId === null) {
      path = `/${this.providerId}/claims?from=${this.from}&to=${this.to}&payer=${this.payerId}`
        + (this.casetype != null ? `&casetype=${this.casetype}` : '') + claimInfo;

    } else if (this.batchId != null && this.uploadId === null) {
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

    if (this.fclaimRefNo != null && this.fclaimRefNo !== '' && this.fclaimRefNo !== undefined &&
      (this.claimRefNo === null || this.claimRefNo === undefined || this.claimRefNo === '')) {
      path += `&filter_claimRefNo=${this.fclaimRefNo}`;
    }
    if (this.fmemberId != null && this.fmemberId !== '' && this.fmemberId !== undefined &&
      (this.memberId === null || this.memberId === undefined || this.memberId === '')) {
      path += `&filter_memberId=${this.fmemberId}`;
    }
    if (this.fpatientFileNo != null && this.fpatientFileNo !== '' && this.fpatientFileNo !== undefined &&
      (this.patientFileNo === null || this.patientFileNo === undefined || this.patientFileNo === '')) {
      path += `&filter_patientFileNo=${this.fpatientFileNo}`;
    }
    if (this.fdrname != null && this.fdrname !== '' && this.fdrname !== undefined) {
      path += `&drname=${this.fdrname}`;
    }
    if (this.fnationalid != null && this.fnationalid !== '' && this.fnationalid !== undefined) {
      path += `&nationalId=${this.fnationalid}`;
    }
    if (this.fclaimdate != null && this.fclaimdate !== '' && this.fclaimdate !== undefined) {
      path += `&claimDate=${this.fclaimdate}`;
    }
    if (this.selectedCardKey != 0) {
      path += `&status=${this.selectedCardKey}`;
    }
    if (this.pageIndex != null && this.pageIndex > 0) {
      path += `&page=${(this.pageIndex)}`;
    }
    if (path !== '' && path !== this.router.url) {
      this.location.go(path);
    }
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
        uploadName: this.summaries[oldSummaryIndex].uploadName,
        patientShare: this.summaries[oldSummaryIndex].patientShare - claim.patientShare,
        discount: this.summaries[oldSummaryIndex].discount - claim.discount,
        actualPaid: this.summaries[oldSummaryIndex].actualPaid,
        actualDeducted: this.summaries[oldSummaryIndex].actualDeducted
      };
      this.claims[index].status = claim.status;
      const newSummaryIndex = summaries.findIndex(summary => summary.statuses.includes(claim.status.toLowerCase()));
      if (newSummaryIndex != -1) {
        summaries[newSummaryIndex] = {
          totalClaims: this.summaries[newSummaryIndex].totalClaims + 1,
          totalNetAmount: this.summaries[newSummaryIndex].totalNetAmount + claim.net,
          totalVatNetAmount: this.summaries[newSummaryIndex].totalVatNetAmount + claim.netvatamount,
          statuses: this.summaries[newSummaryIndex].statuses,
          uploadName: this.summaries[newSummaryIndex].uploadName,
          patientShare: this.summaries[oldSummaryIndex].patientShare + claim.patientShare,
          discount: this.summaries[oldSummaryIndex].discount + claim.discount,
          actualPaid: this.summaries[newSummaryIndex].actualPaid,
          actualDeducted: this.summaries[newSummaryIndex].actualDeducted
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
        this.claims[index].numOfPriceListErrors = claim.errors.filter(error =>
          error.code.startsWith('SERVCOD-RESTRICT')).length;
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
      this.batchId,
      this.uploadId,
      this.fclaimRefNo,
      this.fmemberId,
      this.invoiceNo,
      this.fpatientFileNo,
      this.policyNo,
      this.casetype,
      this.fdrname,
      this.fnationalid,
      this.fclaimdate
    ));
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
    // if (this.eligibilityWaitingList.length === 0)
    //   this.waitingEligibilityCheck = false;
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

      if (splitedValue.length >= 2) {
        const inde = this.claims.findIndex(claim => claim.claimId == splitedValue[0]);
        if (inde > -1) {
          const claims: any = [];
          this.claims.map((ele: any, index: number) => {
            const newModel = new SearchedClaim(ele.body);
            newModel.batchId = ele['batchId'];
            newModel.claimDate = ele['claimDate'];
            newModel.claimId = ele['claimId'];
            newModel.providerClaimNumber = ele['providerClaimNumber'];
            newModel.drName = ele['drName'];
            newModel.policyNumber = ele['policyNumber'];
            newModel.memberId = ele['memberId'];
            newModel.nationalId = ele['nationalId'];
            newModel.submissionDate = ele['submissionDate'];
            newModel.patientFileNumber = ele['patientFileNumber'];
            newModel.claimDate = ele['claimDate'];
            newModel.netAmount = ele['netAmount'];
            newModel.netVatAmount = ele['netVatAmount'];
            newModel.unitOfNetAmount = ele['unitOfNetAmount'];
            newModel.unitOfNetVatAmount = ele['unitOfNetVatAmount'];
            newModel.status = ele['status'];
            newModel.statusDetail = ele['statusDetail'];
            newModel.payerId = ele['payerId'];
            newModel.numOfAttachments = ele['numOfAttachments'];
            newModel.numOfPriceListErrors = ele['numOfPriceListErrors'];
            newModel.eligibilitycheck = inde === index ? splitedValue[1] : ele['eligibilitycheck'];
            newModel.batchNumber = ele['batchNumber'];
            newModel.eligibilityStatusDesc = splitedValue[2] != undefined &&
              inde === index ? splitedValue[2] : ele['eligibilityStatusDesc'];
            claims.push(newModel);
          });
          this.claims = new Array();
          this.claims = claims;

          // if (splitedValue.length >= 2) {
          //   const index = this.claims.findIndex(claim => claim.claimId == splitedValue[0]);
          //   if (index > -1) {
          //     console.log(this.claims[index]);

          //     this.claims[index].eligibilitycheck = splitedValue[1];
          //     if(splitedValue[2] != undefined){
          //       this.claims[index].eligibilityStatusDesc = splitedValue[2];
          //     }
          //   }
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

    let event;
    let excel = false;
    if (this.summaries[this.selectedCardKey].statuses.length == 1 &&
      (this.summaries[this.selectedCardKey].statuses.includes('Downloadable'.toLowerCase()))) {
      this.dialogService.openMessageDialog({
        title: '',
        isError: false,
        message: 'Do you want to download payers format ? ',
        cancelButtonText: 'No',
        confirmButtonText: 'Yes',
        withButtons:true


      }).subscribe(result => {
        if (result == true) {
          event = this.searchService.downloadExcelSummaries(this.providerId,
            this.summaries[this.selectedCardKey].statuses,
            this.from,
            this.to,
            this.payerId,
            this.batchId,
            this.uploadId,
            this.fclaimRefNo,
            this.memberId,
            this.invoiceNo,
            this.fpatientFileNo,
            this.policyNo,
            this.fdrname,
            this.fnationalid,
            this.fclaimdate);
          excel = true;
        }
        else {
          event = this.searchService.downloadSummaries(this.providerId,
            this.summaries[this.selectedCardKey].statuses,
            this.from,
            this.to,
            this.payerId,
            this.batchId,
            this.uploadId,
            this.fclaimRefNo,
            this.memberId,
            this.invoiceNo,
            this.fpatientFileNo,
            this.policyNo,
            this.fdrname,
            this.fnationalid,
            this.fclaimdate);

        }
        this.downloadService.startDownload(event)
          .subscribe(status => {
            if (status != DownloadStatus.ERROR) {
              this.detailTopActionIcon = 'ic-check-circle.svg';
            } else {
              this.detailTopActionIcon = 'ic-download.svg';
            }
          });
      })

    } else {
      event = this.searchService.downloadSummaries(this.providerId,
        this.summaries[this.selectedCardKey].statuses,
        this.from,
        this.to,
        this.payerId,
        this.batchId,
        this.uploadId,
        this.fclaimRefNo,
        this.memberId,
        this.invoiceNo,
        this.fpatientFileNo,
        this.policyNo,
        this.fdrname,
        this.fnationalid,
        this.fclaimdate);
    }
    if (event != null) {


      this.downloadService.startDownload(event)
        .subscribe(status => {
          if (status != DownloadStatus.ERROR) {
            this.detailTopActionIcon = 'ic-check-circle.svg';
          } else {
            this.detailTopActionIcon = 'ic-download.svg';
          }
        });
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

  // goToFirstPage() {
  //   this.paginatorAction({ pageIndex: 0, pageSize: 10 });
  // }
  // goToPrePage() {
  //   if (this.searchResult.number != 0) {
  //     this.paginatorAction({ pageIndex: this.searchResult.number - 1, pageSize: 10 });
  //   }
  // }
  // goToNextPage() {
  //   if (this.searchResult.number + 1 < this.searchResult.totalPages) {
  //     this.paginatorAction({ pageIndex: this.searchResult.number + 1, pageSize: this.pageSize });
  //   }
  // }
  // goToLastPage() {
  //   this.paginatorAction({ pageIndex: this.searchResult.totalPages - 1, pageSize: this.pageSize });
  // }

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
    if (this.commen.isAdmin && this.commen.isProvider && this.isAllCards) {
      this.dialogService.openConfirmAdminDeleteDialog().subscribe(action => {
        switch (action) {
          case 'deleteAll':
            this.dialogService.openMessageDialog(
              new MessageDialogData('Delete Claims?',
                `This will delete all claims according to your selection criteria. Are you sure you want to delete it? This cannot be undone.`,
                false,
                true))
              .subscribe(result => {
                if (result === true) {
                  this.commen.loadingChanged.next(true);
                  const status = this.isAllCards ? null : this.summaries[this.selectedCardKey].statuses;
                  this.claimService.deleteClaimByCriteria(this.providerId, this.payerId, this.batchId, this.uploadId, null,
                    this.fclaimRefNo, this.fpatientFileNo, this.invoiceNo, this.policyNo, status, this.fmemberId, this.selectedClaims,
                    this.from, this.to, this.fdrname, this.fnationalid, this.fclaimdate).subscribe(event => {
                      if (event instanceof HttpResponse) {
                        this.commen.loadingChanged.next(false);
                        const status = event.body['status'];
                        if (status == 'Deleted') {
                          this.dialogService.openMessageDialog(
                            new MessageDialogData('',
                              `Your claims deleted successfully.`,
                              false))
                            .subscribe(afterColse => {
                              //  this.commen.showUploadsCenterChange.next(false);
                              // this.claimService.summaryChange.next(new UploadSummary());
                              this.router.navigate(['/uploads']);
                              // location.reload();
                            });
                        } else if (status === 'AlreadySumitted') {
                          this.dialogService.openMessageDialog(
                            new MessageDialogData('',
                              `Your claims deleted successfully. Some claims have not deleted because they are already submitted.`,
                              false))
                            .subscribe(afterColse => {
                              // this.claimService.summaryChange.next(new UploadSummary());

                              // location.reload();

                              this.router.navigate(['/uploads']);
                            });

                        } else {
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
            break;
          case 'confirm':
            this.commen.loadingChanged.next(true);
            this.claimService.deleteClaimByCriteria(this.providerId, this.payerId, this.batchId, this.uploadId, null, this.fclaimRefNo,
              this.fpatientFileNo, this.invoiceNo, this.policyNo, ['Accepted', 'NotAccepted', 'Downloaded', 'Failed'], this.fmemberId,
              this.selectedClaims, this.from, this.to, this.fdrname, this.fnationalid, this.fclaimdate)
              .subscribe(event => {
                if (event instanceof HttpResponse) {
                  this.commen.loadingChanged.next(false);
                  const status = event.body['status'];
                  if (status == 'Deleted') {
                    this.dialogService.openMessageDialog(
                      new MessageDialogData('',
                        `Your claims deleted successfully.`,
                        false))
                      .subscribe(afterColse => {
                        //  this.commen.showUploadsCenterChange.next(false);
                        // this.claimService.summaryChange.next(new UploadSummary());
                        this.router.navigate(['/uploads']);
                        // location.reload();
                      });
                  } else if (status === 'AlreadySumitted') {
                    this.dialogService.openMessageDialog(
                      new MessageDialogData('',
                        `Your claims deleted successfully. Some claims have not deleted because they are already submitted.`,
                        false))
                      .subscribe(afterColse => {
                        // this.claimService.summaryChange.next(new UploadSummary());

                        // location.reload();

                        this.router.navigate(['/uploads']);
                      });

                  } else {
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

            break;

        }
      });
    } else {
      this.dialogService.openMessageDialog(
        new MessageDialogData('Delete Claims?',
          `This will delete all claims according to your selection criteria. Are you sure you want to delete it? This cannot be undone.`,
          false,
          true))
        .subscribe(result => {
          if (result === true) {
            this.commen.loadingChanged.next(true);
            const status = this.isAllCards ? null : this.summaries[this.selectedCardKey].statuses;
            this.claimService.deleteClaimByCriteria(this.providerId, this.payerId, this.batchId, this.uploadId, null, this.fclaimRefNo,
              this.fpatientFileNo, this.invoiceNo, this.policyNo, status, this.fmemberId, this.selectedClaims, this.from, this.to,
              this.fdrname, this.fnationalid, this.fclaimdate).subscribe(event => {
                if (event instanceof HttpResponse) {
                  this.commen.loadingChanged.next(false);
                  const status = event.body['status'];
                  if (status == 'Deleted') {
                    this.dialogService.openMessageDialog(
                      new MessageDialogData('',
                        `Your claims deleted successfully.`,
                        false))
                      .subscribe(afterColse => {
                        //  this.commen.showUploadsCenterChange.next(false);
                        // this.claimService.summaryChange.next(new UploadSummary());
                        this.router.navigate(['/uploads']);
                        // location.reload();
                      });
                  } else if (status === 'AlreadySumitted') {
                    this.dialogService.openMessageDialog(
                      new MessageDialogData('',
                        `Your claims deleted successfully. Some claims have not deleted because they are already submitted.`,
                        false))
                      .subscribe(afterColse => {
                        // this.claimService.summaryChange.next(new UploadSummary());

                        // location.reload();

                        this.router.navigate(['/uploads']);
                      });

                  } else {
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
    return status == ClaimStatus.INVALID.toUpperCase() || status == 'RETURNED';
  }

  handlePageEvent(event: PageEvent) {
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    localStorage.setItem('pagesize', event.pageSize + '');
    console.log(event);
    if (this.summaries[this.selectedCardKey] != null) {
      this.getResultsOfStatus(this.selectedCardKey, this.pageIndex);
    }
  }
  searchClaimBased(key: string) {
    const filterKey = this.allFilters.find(ele => ele.key === key);
    const data = {
      key: filterKey.key,
    };
    switch (key) {
      case ClaimListFilterSelection.MEMBERID:
        this.fmemberId = this.claimList.memberID;
        break;
      case ClaimListFilterSelection.PATIENTFILENO:
        this.fpatientFileNo = this.claimList.patientFileNO;
        break;
      case ClaimListFilterSelection.DR_NAME:
        this.fdrname = this.claimList.drName;
        break;
      case ClaimListFilterSelection.NATIONALID:
        this.fnationalid = this.claimList.nationalId;
        break;
      case ClaimListFilterSelection.CLAIMDATE:
        const dates: any = this.claimList.claimDate;
        this.fclaimdate = dates.format('DD-MM-yyyy');
        break;
      case ClaimListFilterSelection.CLAIMREFNO:
        this.fclaimRefNo = this.claimList.claimRefNO;
        break;
    }


    this.appliedFilters.push(data);
    this.pageIndex = 0;
    this.getResultsOfStatus(this.selectedCardKey, this.pageIndex);
  }


  setParamsValueSummary(key: string) {
    this.fmemberId = key === ClaimListFilterSelection.MEMBERID ? this.claimList.memberID : this.memberId;
    this.fpatientFileNo = key === ClaimListFilterSelection.PATIENTFILENO ? this.claimList.patientFileNO : this.patientFileNo;
    this.fclaimRefNo = key === ClaimListFilterSelection.CLAIMREFNO ? this.claimList.claimRefNO : this.claimRefNo;
    this.fdrname = ClaimListFilterSelection.DR_NAME ? this.claimList.drName : this.fdrname;
    this.fnationalid = ClaimListFilterSelection.NATIONALID ? this.claimList.nationalId : this.fnationalid;
    const dates = this.claimList.claimDate !== undefined && this.claimList.claimDate !== null &&
      this.claimList.claimDate !== '' ? this.claimList.claimDate.format('DD-MM-yyyy') : '';
    this.fclaimdate = ClaimListFilterSelection.CLAIMDATE ? dates : this.fclaimdate;
  }


  clearFilters(name: string, key = false) {
    if (this.appliedFilters.length > 0) {
      if (!key) {
        const findKey = this.allFilters.find(subele => subele.value === name);
        this.claimList[findKey.value] = '';
        switch (findKey.key) {
          case ClaimListFilterSelection.MEMBERID:
            this.fmemberId = this.claimList.memberID;
            break;
          case ClaimListFilterSelection.PATIENTFILENO:
            this.fpatientFileNo = this.claimList.patientFileNO;
            break;
          case ClaimListFilterSelection.DR_NAME:
            this.fdrname = this.claimList.drName;
            break;
          case ClaimListFilterSelection.NATIONALID:
            this.fnationalid = this.claimList.nationalId;
            break;
          case ClaimListFilterSelection.CLAIMDATE:
            const dates = this.claimList.claimDate !== undefined && this.claimList.claimDate !== null &&
              this.claimList.claimDate !== '' &&
              typeof this.claimList.claimDate !== 'string' ? this.claimList.claimDate.format('DD-MM-yyyy') : '';
            this.fclaimdate = ClaimListFilterSelection.CLAIMDATE ? dates : this.fclaimdate;
            break;
          case ClaimListFilterSelection.CLAIMREFNO:
            this.fclaimRefNo = this.claimList.claimRefNO;
            break;
        }
        this.appliedFilters = this.appliedFilters.filter(sele => sele.key !== findKey.key);
      } else {
        this.claimList = new ClaimListModel();
        this.setParamsValueSummary('');
        this.appliedFilters = [];
      }
    }
    this.pageIndex = 0;
    this.getResultsOfStatus(this.selectedCardKey, this.pageIndex);
  }

  checkAppliedFilter(name: string) {
    const data = this.appliedFilters.find(ele => ele.key === name);
    return data !== null && data !== undefined && this.appliedFilters.length > 0 ? 'action-active' : '';
  }

  get claimSearchSelection() {
    return ClaimListFilterSelection;
  }

  reloadFilters() {
    this.appliedFilters = [];
    this.claimList = new ClaimListModel();
    if (this.fdrname != null && this.fdrname !== '' && this.fdrname !== undefined) {
      this.setReloadedFilters(ClaimListFilterSelection.DR_NAME);
    }
    if (this.fnationalid != null && this.fnationalid !== '' && this.fnationalid !== undefined) {
      this.setReloadedFilters(ClaimListFilterSelection.NATIONALID);
    }
    if (this.fclaimdate != null && this.fclaimdate !== '' && this.fclaimdate !== undefined &&
      typeof this.claimList.claimDate !== 'string') {
      this.setReloadedFilters(ClaimListFilterSelection.CLAIMDATE);
    }
    if (this.fclaimRefNo != null && this.fclaimRefNo !== '' && this.fclaimRefNo !== undefined &&
      (this.claimRefNo === null || this.claimRefNo === undefined || this.claimRefNo === '')) {
      this.setReloadedFilters(ClaimListFilterSelection.CLAIMREFNO);
    }
    if (this.fmemberId != null && this.fmemberId !== '' && this.fmemberId !== undefined &&
      (this.memberId === null || this.memberId === undefined || this.memberId === '')) {
      this.setReloadedFilters(ClaimListFilterSelection.MEMBERID);
    }
    if (this.fpatientFileNo != null && this.fpatientFileNo !== '' && this.fpatientFileNo !== undefined &&
      (this.patientFileNo === null || this.patientFileNo === undefined || this.patientFileNo === '')) {
      this.setReloadedFilters(ClaimListFilterSelection.PATIENTFILENO);
    }
  }

  setReloadedFilters(key: string) {
    const data = {
      key: key
    };
    this.appliedFilters.push(data);
  }

  reloadInputFilters() {
    if (this.fdrname != null && this.fdrname !== '' && this.fdrname !== undefined) {
      this.setReloadedInputFilters('drName', this.fdrname);
    }
    if (this.fnationalid != null && this.fnationalid !== '' && this.fnationalid !== undefined) {
      this.setReloadedInputFilters('nationalId', this.fnationalid);
    }
    if (this.fclaimdate != null && this.fclaimdate !== '' && this.fclaimdate !== undefined) {
      const splitDate = this.fclaimdate.split('-');
      if (splitDate.length > 2) {
        const finaldate = splitDate[1] + '-' + splitDate[0] + '-' + splitDate[2];
        const dates = new Date(finaldate);
        this.claimList.claimDate = moment(dates);
      }
    }
    if (this.fclaimRefNo != null && this.fclaimRefNo !== '' && this.fclaimRefNo !== undefined &&
      (this.claimRefNo === null || this.claimRefNo === undefined || this.claimRefNo === '')) {
      this.setReloadedInputFilters('claimRefNO', this.fclaimRefNo);
    }
    if (this.fmemberId != null && this.fmemberId !== '' && this.fmemberId !== undefined &&
      (this.memberId === null || this.memberId === undefined || this.memberId === '')) {
      this.setReloadedInputFilters('memberID', this.fmemberId);
    }
    if (this.fpatientFileNo != null && this.fpatientFileNo !== '' && this.fpatientFileNo !== undefined &&
      (this.patientFileNo === null || this.patientFileNo === undefined || this.patientFileNo === '')) {
      this.setReloadedInputFilters('patientFileNO', this.fpatientFileNo);
    }
  }

  setReloadedInputFilters(name: string, value: string) {
    this.claimList[name] = value;
  }
  checkReloadedFilter() {
    this.reloadInputFilters();
  }
  getPBMValidation() {
    this.adminService.checkIfPBMValidationIsEnabled(this.commen.providerId, '101').subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        const body = event['body'];
        this.apiPBMValidationEnabled = body.value === '1' ? true : false;
        //  this.isPBMValidationVisible = this.apiPBMValidationEnabled && this.summaries[this.selectedCardKey].statuses[0]
        // === ClaimStatus.Accepted.toLowerCase() ? true : false;
        this.isPBMValidationVisible = this.apiPBMValidationEnabled
          && (this.summaries[this.selectedCardKey].statuses[0] === ClaimStatus.Accepted.toLowerCase()
            || this.summaries[this.selectedCardKey].statuses[0] === ClaimStatus.Downloadable.toLowerCase()) ? true : false;
      }
    }, err => {
      console.log(err);
    });

  }
  applyPBMValidation() {
    this.commen.loadingChanged.next(true);
    // const status = this.isAllCards ? null : this.summaries[this.selectedCardKey].statuses;
    // const status = this.isPBMValidationVisible ? [ClaimStatus.Accepted] : null;
    const status = this.isPBMValidationVisible ? this.summaries[this.selectedCardKey].statuses : null;
    this.claimService.PBMValidation(this.providerId, this.payerId, this.batchId, this.uploadId, null, this.fclaimRefNo, this.fpatientFileNo,
      this.invoiceNo, this.policyNo, status, this.fmemberId, this.selectedClaims, this.from, this.to, this.fdrname, this.fnationalid,
      this.fpatientFileNo).subscribe(event => {
        if (event instanceof HttpResponse) {
          this.commen.loadingChanged.next(false);
          if (event.body['response']) {
            this.dialogService.openMessageDialog(
              new MessageDialogData('',
                event.body['message'],
                true))
              .subscribe(afterColse => {
                location.reload();
              });
          } else {
            this.dialogService.openMessageDialog(
              new MessageDialogData('',
                event.body['message'],
                false))
              .subscribe(afterColse => {
                location.reload();
              });
          }
          this.commen.loadingChanged.next(false);
        }
      }, errorEvent => {
        if (errorEvent instanceof HttpErrorResponse) {
          if (errorEvent.status === 404)
            this.dialogService.openMessageDialog(new MessageDialogData('', errorEvent.error.message, true));
          else
            this.dialogService.openMessageDialog(new MessageDialogData('', errorEvent.message, true));
        }
        this.commen.loadingChanged.next(false);
      });
    // }
    // });
  }
  get statusSelected() {
    return ClaimStatus;
  }
}



export const SEARCH_TAB_RESULTS_KEY = 'search_tab_result';
