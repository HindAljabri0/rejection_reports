import { log } from 'util';
import { Location } from '@angular/common';
import { HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';
import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ClaimListModel } from 'src/app/claim-module-components/models/claim-list.model';
import { ClaimError } from 'src/app/models/claimError';
import { ClaimListFilterSelection } from 'src/app/models/claimListSearch';
import { ClaimStatus } from 'src/app/models/claimStatus';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { SearchedClaim } from 'src/app/models/searchedClaim';
import { SearchStatusSummary } from 'src/app/models/searchStatusSummary';
import { UploadSummary } from 'src/app/models/uploadSummary';
import { ViewedClaim } from 'src/app/models/viewedClaim';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { cancelClaim } from 'src/app/claim-module-components/store/claim.actions';
import { changePageTitle } from 'src/app/store/mainStore.actions';
import { ClaimCriteriaModel } from 'src/app/models/ClaimCriteriaModel';
import { SearchPageQueryParams } from 'src/app/models/searchPageQueryParams';
import { NPHIES_SEARCH_TAB_RESULTS_KEY, NPHIES_CURRENT_INDEX_KEY, SharedServices, NPHIES_CURRENT_SEARCH_PARAMS_KEY } from 'src/app/services/shared.services';
import { setSearchCriteria, storeClaims } from 'src/app/pages/searchClaimsPage/store/search.actions';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { CreateClaimNphiesComponent } from '../create-claim-nphies/create-claim-nphies.component';
import { ProviderNphiesApprovalService } from 'src/app/services/providerNphiesApprovalService/provider-nphies-approval.service';
import { CancelReasonModalComponent } from '../preauthorization-transactions/cancel-reason-modal/cancel-reason-modal.component';
import { ClaimSearchCriteriaModel } from 'src/app/models/nphies/claimSearchCriteriaModel';
import { nlLocale } from 'ngx-bootstrap/chronos';
import { couldStartTrivia } from 'typescript';
import { DownloadService } from 'src/app/services/downloadService/download.service';
import { DownloadStatus } from 'src/app/models/downloadRequest';

@Component({
  selector: 'app-nphies-search-claims',
  templateUrl: './nphies-search-claims.component.html',
  styles: []
})
export class NphiesSearchClaimsComponent implements OnInit, AfterViewChecked, OnDestroy {


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
        items: 2,
        slideBy: 2
      },
      768: {
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
  claimSearchCriteriaModel: ClaimSearchCriteriaModel = {};


  isManagingAttachments = false;

  isViewChecked = false;

  progressChange: Subject<{ percentage: number }> = new Subject();


  placeholder = '-';
  cardsClickAble = true;
  extraCards = 3;
  extraNumbers: number[];

  detailCardTitle: string;
  detailTopActionIcon = 'ic-download.svg';

  params: SearchPageQueryParams = new SearchPageQueryParams();

  providerId: string;

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
  PageclaimIds: string[];
  paginatorPagesNumbers: number[];
  manualPage = null;


  selectedCardKey: number;

  errorMessage: string;

  submittionErrors: Map<string, string>;

  waitingEligibilityCheck = false;
  waitingApprovalCheck = false;
  eligibilityWaitingList: { result: string, waiting: boolean }[] = [];
  approvalWaitingList: { result: string, waiting: boolean }[] = [];
  watchingEligibility = false;
  watchingApproval = false;
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
  pageSizeOptions = [10, 50, 100, 500, 1000];
  showFirstLastButtons = true;
  allFilters: any = [
    { key: 'CLAIMDATE', value: 'claimDate' },
    { key: 'CLAIMREFNO', value: 'claimRefNO' },
    { key: 'DR_NAME', value: 'drName' },
    { key: 'MEMBERID', value: 'memberID' },
    { key: 'NATIONALID', value: 'nationalId' },
    { key: 'PATIENTFILENO', value: 'patientFileNO' },
    { key: 'CLAIMNET', value: 'netAmount' },
    { key: 'BATCHNUM', value: 'batchNo' },
  ];
  appliedFilters: any = [];

  isPBMValidationVisible = false;
  apiPBMValidationEnabled: any;
  claimList: ClaimListModel = new ClaimListModel();

  claimDialogRef: MatDialogRef<any, any>;

  constructor(
    public dialog: MatDialog,
    public location: Location,
    public commen: SharedServices,
    public routeActive: ActivatedRoute,
    public router: Router,
    private dialogService: DialogService,
    private store: Store,
    private downloadService: DownloadService,
    private adminService: AdminService,
    private providerNphiesSearchService: ProviderNphiesSearchService,
    private providerNphiesApprovalService: ProviderNphiesApprovalService) { }

  ngOnDestroy(): void {

    localStorage.removeItem(NPHIES_SEARCH_TAB_RESULTS_KEY);
    localStorage.removeItem(NPHIES_CURRENT_SEARCH_PARAMS_KEY);
    this.routerSubscription.unsubscribe();
  }

  ngOnInit() {

    this.pageSize = localStorage.getItem('pagesize') != null ? Number.parseInt(localStorage.getItem('pagesize'), 10) : 10;
    this.fetchData();
    this.routerSubscription = this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd && event.url.includes('/claims') && !event.url.includes('/add')
        && event.url.includes('#reload'))
    ).subscribe((event) => {
      const reloadFragment = event.url.split('#')[1]
      if (reloadFragment.includes('..')) {
        const statuses = reloadFragment.split('..');
        statuses[0] = 'all';
        this.loadStatues(statuses);
      } else {
        this.fetchData();
      }
    });
    this.dialogService.onClaimDialogClose.subscribe(value => {
      if (value != null) {
        this.reloadClaim(value);
      }

      this.params.claimId = null;
      this.params.editMode = null;
      this.resetURL();
    });
    this.submittionErrors = new Map();
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
      this.providerId = this.commen.providerId;
    }).unsubscribe();
    this.routeActive.queryParams.subscribe(value => {
      this.params = SearchPageQueryParams.fromParams(value);
      this.store.dispatch(setSearchCriteria({
        batchId: this.params.batchId,
        fromDate: this.params.from,
        memberId: this.params.memberId,
        invoiceNo: this.params.invoiceNo,
        patientFileNo: this.params.patientFileNo,
        policyNo: this.params.policyNo,
        payerId: this.params.payerId,
        organizationId: this.params.organizationId,
        provClaimNum: this.params.claimRefNo,
        toDate: this.params.to,
        uploadId: this.params.uploadId,
        nationalId: this.params.nationalId,
        statuses: ['All']
      }));
    }).unsubscribe();
    if (this.params.hasNoQueryParams()) {
      this.commen.loadingChanged.next(false);
      this.router.navigate(['']);
    }
    this.showValidationTab = false;
    const statusCode = await this.getSummaryOfStatus([ClaimStatus.ALL]);
    if (statusCode == 200 && this.summaries[0] != null && this.summaries[0].statuses != null && this.summaries[0].totalClaims > 0) {
      const statuses = this.summaries[0].statuses;
      statuses.sort((s1, s2) => {
        if (this.isReadyForSubmissionStatus(s1) || s1 == 'NotAccepted' || s1 == 'Batched' || this.isUnderProcessingStatus(s1)) {
          return -1;
        } else if (this.isReadyForSubmissionStatus(s2) || s2 == 'NotAccepted' || s2 == 'Batched' || this.isUnderProcessingStatus(s2)) {
          return 1;
        }
        return 0;
      });
      await this.loadStatues(statuses.filter(status => status != null && status.toUpperCase() != 'ALL'));
    }

    // this.getResultsOfStatus(this.params.status, this.params.page);

    if (!this.hasData && this.errorMessage == null) { this.errorMessage = 'Sorry, we could not find any result.'; }
  }

  async loadStatues(statuses: string[]) {
    if (this.summaries != null && this.summaries.length > 1) {
      if (statuses.includes('all')) {
        this.summaries.splice(0, 1);
      }
      this.summaries = this.summaries.filter(summary => !summary.statuses.some(status => statuses.includes(status)));
    }
    let underProcessingIsDone = false;
    let rejectedByPayerIsDone = false;
    let readyForSubmissionIsDone = false;
    let paidIsDone = false;
    let failedDone = false
    let invalidIsDone = false;
    let isAllDone = false;
    for (let status of statuses) {
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
          await this.getSummaryOfStatus([ClaimStatus.Accepted]);
        }
        readyForSubmissionIsDone = true;
      } else if (this.isFailedStatus(status)) {
        if (!failedDone) {
          await this.getSummaryOfStatus(['Failed']);
        }
        failedDone = true;

      }
      else if (this.isPaidStatus(status)) {
        if (!paidIsDone) {
          await this.getSummaryOfStatus([ClaimStatus.PAID, 'SETTLED']);
        }
        paidIsDone = true;
      } else if (this.isInvalidStatus(status)) {
        if (!invalidIsDone) {
          await this.getSummaryOfStatus([ClaimStatus.INVALID, 'RETURNED']);
        }
        invalidIsDone = true;
      } else if (this.isAllStatus(status)) {
        if (!isAllDone) {
          this.getSummaryOfStatus([status]);
        }
        isAllDone = true;
      } else {
        await this.getSummaryOfStatus([status]);
      }
    }
    this.summaries.sort((a, b) => b.statuses.length - a.statuses.length);
    if (this.params.status != null)
      this.getResultsOfStatus(this.params.status, this.params.page);
    else
      this.getResultsOfStatus(this.selectedCardKey, this.params.page);

    // if (!this.hasData && this.errorMessage == null) { this.errorMessage = 'Sorry, we could not find any result.'; }
  }

  async getSummaryOfStatus(statuses: string[]): Promise<number> {
    this.commen.loadingChanged.next(true);
    let event;

    this.claimSearchCriteriaModel.uploadId = this.params.uploadId;

    this.claimSearchCriteriaModel.statuses = statuses;

    this.claimSearchCriteriaModel.page = this.pageIndex;

    this.claimSearchCriteriaModel.pageSize = this.pageSize;

    this.claimSearchCriteriaModel.payerIds = this.params.payerId;

    this.claimSearchCriteriaModel.batchId = this.params.batchId;

    this.claimSearchCriteriaModel.claimDate = this.params.filter_claimDate;

    this.claimSearchCriteriaModel.provderClaimReferenceNumber = this.params.claimRefNo;

    this.claimSearchCriteriaModel.claimIds = this.params.claimId;

    this.claimSearchCriteriaModel.patientFileNo = this.params.patientFileNo;

    this.claimSearchCriteriaModel.memberId = this.params.filter_memberId || this.params.memberId;

    this.claimSearchCriteriaModel.documentId = this.params.nationalId;

    this.claimSearchCriteriaModel.invoiceNo = this.params.invoiceNo;
    this.claimSearchCriteriaModel.providerId = this.commen.providerId;
    this.claimSearchCriteriaModel.claimDate = this.params.from;
    this.claimSearchCriteriaModel.toDate = this.params.to;

    this.claimSearchCriteriaModel.organizationId = this.params.organizationId;

    event = await this.providerNphiesSearchService.getClaimSummary(this.claimSearchCriteriaModel

    ).toPromise().catch(error => {
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
        // debugger;
        const summary: SearchStatusSummary = new SearchStatusSummary(event.body);
        console.log("Summary =" + JSON.stringify(summary));
        if (summary.totalClaims > 0) {
          if (statuses.includes('all') || statuses.includes('All') || statuses.includes('ALL')) {
            summary.statuses.push('all');
            summary.statuses.push('All');
            summary.statuses.push('ALL');
          } else {
            summary.statuses = statuses;
          }
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
    // alert(this.selectedCardKey);
    // alert(this.summaries[this.selectedCardKey].statuses[0].toLowerCase());
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

    this.getClaimTransactions(key, page);

    const status = this.routeActive.snapshot.queryParamMap.get('status');
    this.status = status === null ? this.status : status;
    this.getPBMValidation();
  }

  getClaimTransactions(key?: number, page?: number) {
    this.claimSearchCriteriaModel.providerId = this.commen.providerId;
    console.log("getClaimTransactions" + this.commen.providerId);
    this.claimSearchCriteriaModel.uploadId = this.params.uploadId;
    this.claimSearchCriteriaModel.statuses = key != 0 ? this.summaries[key].statuses.filter(status => status != 'all') : null;
    this.claimSearchCriteriaModel.page = this.pageIndex;
    this.claimSearchCriteriaModel.pageSize = this.pageSize;
    this.claimSearchCriteriaModel.payerIds = this.params.payerId;
    this.claimSearchCriteriaModel.batchId = this.params.batchId;
    this.claimSearchCriteriaModel.claimDate = this.params.filter_claimDate;
    this.claimSearchCriteriaModel.provderClaimReferenceNumber = this.params.claimRefNo;
    this.claimSearchCriteriaModel.claimIds = this.params.claimId;
    this.claimSearchCriteriaModel.patientFileNo = this.params.patientFileNo;
    this.claimSearchCriteriaModel.memberId = this.params.filter_memberId || this.params.memberId;

    this.claimSearchCriteriaModel.documentId = this.params.nationalId;
    this.claimSearchCriteriaModel.invoiceNo = this.params.invoiceNo;

    this.claimSearchCriteriaModel.claimDate = this.params.from;
    this.claimSearchCriteriaModel.toDate = this.params.to;

    this.claimSearchCriteriaModel.organizationId = this.params.organizationId;

    this.providerNphiesSearchService.getClaimResults(this.claimSearchCriteriaModel
    ).subscribe((event) => {

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

            this.setAllCheckBoxIsIndeterminate();
            this.detailCardTitle = this.commen.statusToName(this.summaries[key].statuses[0]);
            const pages = Math.ceil((this.searchResult.totalElements / this.searchResult.numberOfElements));
            this.paginatorPagesNumbers = Array(pages).fill(pages).map((x, i) => i);
            this.manualPage = this.searchResult.number;

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
        if (this.params.claimId != null && this.claimDialogRef == null) {
          const index = this.claims.findIndex(claim => claim.claimId == this.params.claimId);
          if (index != -1) {
            this.showClaim(this.claims[index].status, this.params.claimId, this.params.claimResponseId, (this.params.editMode != null && this.params.editMode == 'true'));
            this.params.claimId = null;
            this.params.editMode = null;
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
  }

  storeSearchResultsForClaimViewPagination() {
    if (this.claims != null && this.claims.length > 0) {
      this.PageclaimIds = this.claims.map(claim => claim.claimId);
      localStorage.setItem(NPHIES_SEARCH_TAB_RESULTS_KEY, this.PageclaimIds.join(','));

    } else {
      localStorage.removeItem(NPHIES_SEARCH_TAB_RESULTS_KEY);
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
    this.providerNphiesApprovalService.submitClaims(this.providerId, this.selectedClaims, null).subscribe((event) => {
      if (event instanceof HttpResponse) {
        if (event.body['status'] == 'Queued') {
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
    const payerIds: string[] = [];
    if (this.params.payerId) {
      payerIds.push(this.params.payerId);
    }
    this.commen.loadingChanged.next(true);
    this.providerNphiesApprovalService.submitClaims(this.providerId, this.selectedClaims,
      this.params.uploadId, this.params.claimRefNo, this.params.to,
      payerIds, this.params.batchId, this.params.memberId, this.params.invoiceNo,
      this.params.patientFileNo, this.params.from, this.params.nationalId, this.params.organizationId
    ).subscribe((event) => {
      if (event instanceof HttpResponse) {
        if (event.body['status'] == 'Queued') {
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
    this.params.status = this.selectedCardKey > 0 ? this.selectedCardKey : null;
    this.params.page = this.pageIndex > 0 ? this.pageIndex : null;
    this.router.navigate([], {
      relativeTo: this.routeActive,
      queryParams: { ...this.params, editMode: null, reSubmitMode: null, size: null },
      fragment: this.params.editMode == 'true' ? 'edit' : null,
    });
  }


  showClaim(claimStatus: string, claimId: string, claimResponseId: string, edit: boolean = false, ReSubmit: boolean = false) {
    this.params.claimId = claimId;
    this.params.claimResponseId = claimResponseId;
    if (edit) {
      this.params.editMode = `${edit}`;
    } else if (ReSubmit) {
      this.params.reSubmitMode = `${ReSubmit}`;
    } else {
      this.params.editMode = null;
    }
    this.resetURL();

    localStorage.setItem(NPHIES_CURRENT_SEARCH_PARAMS_KEY, JSON.stringify(this.params));
    this.store.dispatch(cancelClaim());

    this.claimDialogRef = this.dialog.open(CreateClaimNphiesComponent, {
      panelClass: ['primary-dialog', 'full-screen-dialog'],
      autoFocus: false, data: { claimId }
    });
    this.claimDialogRef.afterClosed().subscribe(result => {
      this.claimDialogRef = null;
      this.params.claimId = null;
      this.params.editMode = null;
      this.store.dispatch(cancelClaim());
      this.store.dispatch(changePageTitle({ title: 'Waseel E-Claims' }));
      this.resetURL();
      setTimeout(() => {
        this.fetchData();
      }, 500);
      // location.reload();
    });
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
        totalPatientShare: this.summaries[oldSummaryIndex].totalPatientShare - claim.totalPatientShare,
        totalPayerShare: this.summaries[oldSummaryIndex].totalPayerShare - claim.totalPayerShare,
        totalVatNetAmount: this.summaries[oldSummaryIndex].totalVatNetAmount - claim.netvatamount,
        totalTax: this.summaries[oldSummaryIndex].totalTax - claim.totalTax,
        statuses: this.summaries[oldSummaryIndex].statuses,
        uploadName: this.summaries[oldSummaryIndex].uploadName,
        uploadDate: this.summaries[oldSummaryIndex].uploadDate,
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
          totalPatientShare: this.summaries[oldSummaryIndex].totalPatientShare + claim.totalPatientShare,
          totalPayerShare: this.summaries[oldSummaryIndex].totalPayerShare + claim.totalPayerShare,
          totalVatNetAmount: this.summaries[newSummaryIndex].totalVatNetAmount + claim.netvatamount,
          totalTax: this.summaries[oldSummaryIndex].totalTax + claim.totalTax,
          statuses: this.summaries[newSummaryIndex].statuses,
          uploadName: this.summaries[newSummaryIndex].uploadName,
          uploadDate: this.summaries[newSummaryIndex].uploadDate,
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











  claimIsWaitingEligibility(claimId: string) {
    return this.eligibilityWaitingList[claimId] != null && this.eligibilityWaitingList[claimId].waiting;
  }

  claimIsWaitingApproval(claimId: string) {
    return this.approvalWaitingList[claimId] != null && this.approvalWaitingList[claimId].waiting;
  }
  get isWaitingForEligibility() {
    return this.waitingEligibilityCheck;
  }
  get isWaitingForApproval() {
    return this.waitingApprovalCheck;
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

  isApprovalState(status: string) {
    if (status == null) { return false; }
    return status.toLowerCase() == 'approved';
  }
  isPartialApprovalState(status: string) {
    if (status == null) { return false; }
    return status.toLowerCase() == 'partially_approved' || status.toLowerCase() == 'limit_approved'
      || status.toLowerCase() == 'conditionally_approved';
  }
  isRejectedState(status: string) {
    if (status == null) { return false; }
    return status.toLowerCase() == 'rejected' || status.toLowerCase() == 'invalid';
  }

  get showEligibilityButton() {
    return this.summaries[this.selectedCardKey] != null && (this.summaries[this.selectedCardKey].statuses.includes('accepted') ||
      this.summaries[this.selectedCardKey].statuses.includes('all'));
  }
  get showApprovalButton() {
    return this.summaries[this.selectedCardKey] != null && (this.summaries[this.selectedCardKey].statuses.includes('accepted') ||
      this.summaries[this.selectedCardKey].statuses.includes('all'));
  }

  isUnderProcessingStatus(status: string) {
    status = status ? status.toUpperCase() : status;
    return status == ClaimStatus.OUTSTANDING.toUpperCase() ||
      status == 'PENDING' || status == 'UNDER_PROCESS';
  }

  isRejectedByPayerStatus(status: string) {
    status = status ? status.toUpperCase() : status;
    return status == ClaimStatus.REJECTED.toUpperCase() ||
      status == 'DUPLICATE';
  }

  isReadyForSubmissionStatus(status: string) {
    status = status ? status.toUpperCase() : status;
    return status == ClaimStatus.Accepted.toUpperCase();
  }

  isFailedStatus(status: string) {
    status = status ? status.toUpperCase() : status;
    return status == 'FAILED';
  }

  isPaidStatus(status: string) {
    status = status ? status.toUpperCase() : status;
    return status == ClaimStatus.PAID.toUpperCase() ||
      status == 'SETTLED';
  }
  isInvalidStatus(status: string) {
    status = status ? status.toUpperCase() : status;
    return status == ClaimStatus.INVALID.toUpperCase() || status == 'RETURNED';
  }

  isAllStatus(status: string) {
    status = status ? status.toUpperCase() : status;
    return status == 'ALL';
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
        this.params.filter_memberId = this.claimList.memberID;
        break;
      case ClaimListFilterSelection.PATIENTFILENO:
        this.params.filter_patientFileNo = this.claimList.patientFileNO;
        break;
      case ClaimListFilterSelection.DR_NAME:
        this.params.filter_drName = this.claimList.drName;
        break;
      case ClaimListFilterSelection.NATIONALID:
        this.params.filter_nationalId = this.claimList.nationalId;
        break;
      case ClaimListFilterSelection.CLAIMDATE:
        const dates: any = this.claimList.claimDate;
        this.params.filter_claimDate = dates.format('DD-MM-yyyy');
        break;
      case ClaimListFilterSelection.CLAIMREFNO:
        this.params.filter_claimRefNo = this.claimList.claimRefNO;
        break;
      case ClaimListFilterSelection.CLAIMNET:
        this.params.filter_netAmount = this.claimList.netAmount;
        break;
      case ClaimListFilterSelection.BATCHNUM:
        this.params.filter_batchNum = this.claimList.batchNo;
        break;
    }


    this.appliedFilters.push(data);
    this.pageIndex = 0;
    this.getResultsOfStatus(this.selectedCardKey, this.pageIndex);
  }


  setParamsValueSummary(key: string) {
    this.params.filter_memberId = key === ClaimListFilterSelection.MEMBERID ? this.claimList.memberID : this.params.memberId;
    this.params.filter_patientFileNo = key === ClaimListFilterSelection.PATIENTFILENO ? this.claimList.patientFileNO : this.params.patientFileNo;
    this.params.filter_claimRefNo = key === ClaimListFilterSelection.CLAIMREFNO ? this.claimList.claimRefNO : this.params.claimRefNo;
    this.params.filter_drName = ClaimListFilterSelection.DR_NAME ? this.claimList.drName : this.params.filter_drName;
    this.params.filter_nationalId = ClaimListFilterSelection.NATIONALID ? this.claimList.nationalId : this.params.filter_nationalId;
    const dates = this.claimList.claimDate !== undefined && this.claimList.claimDate !== null &&
      this.claimList.claimDate !== '' ? this.claimList.claimDate.format('DD-MM-yyyy') : '';
    this.params.filter_claimDate = ClaimListFilterSelection.CLAIMDATE ? dates : this.params.filter_claimDate;
    this.params.filter_netAmount = ClaimListFilterSelection.CLAIMNET ? this.claimList.netAmount : this.params.filter_netAmount;
    this.params.filter_batchNum = ClaimListFilterSelection.BATCHNUM ? this.claimList.batchNo : this.params.filter_batchNum;
    console.log(this.setParamsValueSummary.toString);
  }

  clearFilters(name: string, key = false) {
    if (this.appliedFilters.length > 0) {
      if (!key) {
        const findKey = this.allFilters.find(subele => subele.value === name);
        this.claimList[findKey.value] = '';
        switch (findKey.key) {
          case ClaimListFilterSelection.MEMBERID:
            this.params.filter_memberId = this.claimList.memberID;
            break;
          case ClaimListFilterSelection.PATIENTFILENO:
            this.params.filter_patientFileNo = this.claimList.patientFileNO;
            break;
          case ClaimListFilterSelection.DR_NAME:
            this.params.filter_drName = this.claimList.drName;
            break;
          case ClaimListFilterSelection.NATIONALID:
            this.params.filter_nationalId = this.claimList.nationalId;
            break;
          case ClaimListFilterSelection.CLAIMDATE:
            const dates = this.claimList.claimDate !== undefined && this.claimList.claimDate !== null &&
              this.claimList.claimDate !== '' &&
              typeof this.claimList.claimDate !== 'string' ? this.claimList.claimDate.format('DD-MM-yyyy') : '';
            this.params.filter_claimDate = ClaimListFilterSelection.CLAIMDATE ? dates : this.params.filter_claimDate;
            break;
          case ClaimListFilterSelection.CLAIMREFNO:
            this.params.filter_claimRefNo = this.claimList.claimRefNO;
            break;
          case ClaimListFilterSelection.CLAIMNET:
            this.params.filter_netAmount = this.claimList.netAmount;
            break;
          case ClaimListFilterSelection.BATCHNUM:
            this.params.filter_batchNum = this.claimList.batchNo;
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
    if (this.params.filter_drName != null && this.params.filter_drName !== '' && this.params.filter_drName !== undefined) {
      this.setReloadedFilters(ClaimListFilterSelection.DR_NAME);
    }
    if (this.params.filter_nationalId != null && this.params.filter_nationalId !== '' && this.params.filter_nationalId !== undefined) {
      this.setReloadedFilters(ClaimListFilterSelection.NATIONALID);
    }
    if (this.params.filter_claimDate != null && this.params.filter_claimDate !== '' && this.params.filter_claimDate !== undefined &&
      typeof this.claimList.claimDate !== 'string') {
      this.setReloadedFilters(ClaimListFilterSelection.CLAIMDATE);
    }
    if (this.params.filter_claimRefNo != null && this.params.filter_claimRefNo !== '' && this.params.filter_claimRefNo !== undefined &&
      (this.params.claimRefNo === null || this.params.claimRefNo === undefined || this.params.claimRefNo === '')) {
      this.setReloadedFilters(ClaimListFilterSelection.CLAIMREFNO);
    }
    if (this.params.filter_memberId != null && this.params.filter_memberId !== '' && this.params.filter_memberId !== undefined &&
      (this.params.memberId === null || this.params.memberId === undefined || this.params.memberId === '')) {
      this.setReloadedFilters(ClaimListFilterSelection.MEMBERID);
    }
    if (this.params.filter_patientFileNo != null && this.params.filter_patientFileNo !== '' && this.params.filter_patientFileNo !== undefined &&
      (this.params.patientFileNo === null || this.params.patientFileNo === undefined || this.params.patientFileNo === '')) {
      this.setReloadedFilters(ClaimListFilterSelection.PATIENTFILENO);
    }
    if (this.params.filter_netAmount != null && this.params.filter_netAmount !== '' && this.params.filter_netAmount !== undefined) {
      this.setReloadedFilters(ClaimListFilterSelection.CLAIMNET);
    }
    if (this.params.filter_batchNum != null && this.params.filter_batchNum !== '' && this.params.filter_batchNum !== undefined) {
      this.setReloadedFilters(ClaimListFilterSelection.BATCHNUM);
    }
  }

  setReloadedFilters(key: string) {
    const data = {
      key
    };
    this.appliedFilters.push(data);
  }

  reloadInputFilters() {
    if (this.params.filter_drName != null && this.params.filter_drName !== '' && this.params.filter_drName !== undefined) {
      this.setReloadedInputFilters('drName', this.params.filter_drName);
    }
    if (this.params.filter_nationalId != null && this.params.filter_nationalId !== '' && this.params.filter_nationalId !== undefined) {
      this.setReloadedInputFilters('nationalId', this.params.filter_nationalId);
    }
    if (this.params.filter_claimDate != null && this.params.filter_claimDate !== '' && this.params.filter_claimDate !== undefined) {
      const splitDate = this.params.filter_claimDate.split('-');
      if (splitDate.length > 2) {
        const finaldate = splitDate[1] + '-' + splitDate[0] + '-' + splitDate[2];
        const dates = new Date(finaldate);
        this.claimList.claimDate = moment(dates);
      }
    }
    if (this.params.filter_claimRefNo != null && this.params.filter_claimRefNo !== '' && this.params.filter_claimRefNo !== undefined &&
      (this.params.claimRefNo === null || this.params.claimRefNo === undefined || this.params.claimRefNo === '')) {
      this.setReloadedInputFilters('claimRefNO', this.params.filter_claimRefNo);
    }
    if (this.params.filter_memberId != null && this.params.filter_memberId !== '' && this.params.filter_memberId !== undefined &&
      (this.params.memberId === null || this.params.memberId === undefined || this.params.memberId === '')) {
      this.setReloadedInputFilters('memberID', this.params.filter_memberId);
    }
    if (this.params.filter_patientFileNo != null && this.params.filter_patientFileNo !== '' && this.params.filter_patientFileNo !== undefined &&
      (this.params.patientFileNo === null || this.params.patientFileNo === undefined || this.params.patientFileNo === '')) {
      this.setReloadedInputFilters('patientFileNO', this.params.filter_patientFileNo);
    }
    if (this.params.filter_netAmount != null && this.params.filter_netAmount !== '' && this.params.filter_netAmount !== undefined) {
      this.setReloadedInputFilters('netAmount', this.params.filter_netAmount);
    }
    if (this.params.filter_batchNum != null && this.params.filter_batchNum !== '' && this.params.filter_batchNum !== undefined) {
      this.setReloadedInputFilters('batchNo', this.params.filter_batchNum);
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

  get statusSelected() {
    return ClaimStatus;
  }

  getClaimQueryParams(withoutPagination: boolean): ClaimCriteriaModel {
    let criteria = this.params.toClaimCriteria(this.summaries[this.selectedCardKey].statuses);
    if (withoutPagination) {
      criteria.page = null;
      criteria.size = null;
    }
    return criteria;
  }

  isReadyForSubmission() {
    const cardKey: any = this.selectedCardKey;
    return parseInt(cardKey) !== 0 && this.summaries[this.selectedCardKey].statuses[0].toLowerCase() === this.statusSelected.Accepted.toLowerCase() ? true : false;
  }






  //     ).toPromise().catch(error => {
  //       this.commen.loadingChanged.next(false);
  //       if (error instanceof HttpErrorResponse) {
  //         if ((error.status / 100).toFixed() == '4') {
  //           this.errorMessage = error.message;
  //         } else if ((error.status / 100).toFixed() == '5') {
  //           this.errorMessage = 'Server could not handle the request. Please try again later.';
  //         } else {
  //           this.errorMessage = 'Somthing went wrong.';
  //         }
  //         return error.status;
  //       }
  //     });
  //   if (event instanceof HttpResponse) {
  //     if ((event.status / 100).toFixed() == '2') {
  //       const summary: SearchStatusSummary = new SearchStatusSummary(event.body);
  //       if (summary.totalClaims > 0) {
  //         if (statuses.includes('all') || statuses.includes('All') || statuses.includes('ALL')) {
  //           summary.statuses.push('all');
  //           summary.statuses.push('All');
  //           summary.statuses.push('ALL');
  //         }
  //         this.summaries.push(summary);
  //       }
  //     }
  //   }
  //   this.commen.loadingChanged.next(false);
  //   return event.status;
  // }
  // }


  checkStatus(responseId: number) {
    this.commen.loadingChanged.next(true);
    const model: any = {};
    model.approvalResponseId = responseId;
    this.providerNphiesApprovalService.statusCheck(this.commen.providerId, model).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          const body: any = event.body;
          if (body.errors && body.errors.length > 0) {
            const errors: any[] = [];
            body.errors.forEach(err => {
              err.coding.forEach(codex => {
                errors.push(codex.code + ' : ' + codex.display);
              });
            });
            this.dialogService.showMessage(body.message, '', 'alert', true, 'OK', errors);
          } else if (body.statusCheckStatus && body.statusCheckStatus.toString().toLowerCase().trim() === 'failed') {
            this.dialogService.showMessage(body.message, '', 'alert', true, 'OK');
          }
          this.getClaimTransactions(this.params.status, this.params.page);
        }
      }
    }, error => {
      this.commen.loadingChanged.next(false);
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', error.error.errors);
        } else if (error.status === 404) {
          const errors: any[] = [];
          if (error.error.errors) {
            error.error.errors.forEach(x => {
              errors.push(x);
            });
            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', errors);
          } else {
            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK');
          }
        } else if (error.status === 500) {
          this.dialogService.showMessage(error.error.message ? error.error.message : error.error.error, '', 'alert', true, 'OK');
        } else if (error.status === 503) {
          const errors: any[] = [];
          if (error.error.errors) {
            error.error.errors.forEach(x => {
              errors.push(x);
            });
            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', errors);
          } else {
            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK');
          }
        }
      }
    });
  }

  openReasonModal(requestId: number, responseId: number, reqType: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog'];
    dialogConfig.data = {
      approvalRequestId: requestId,
      approvalResponseId: responseId,
      type: reqType
    };

    const dialogRef = this.dialog.open(CancelReasonModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        location.reload();
        // this.getClaimTransactions(this.params.status, this.params.page);
      }
    });
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
          this.providerNphiesApprovalService.deleteClaimById(this.providerId, claimId).subscribe(event => {
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
  showColumns(selectedCardKey: number, status: string) {
    if (selectedCardKey == 0) {
      return false;
    }
    status = status.trim().toLowerCase();
    // tslint:disable-next-line:max-line-length
    const inValidStatus = ['accepted', 'cancelled', 'failed', 'notaccepted', 'batched', 'error', 'rejected', 'invalid', 'approved', 'partial', 'notsaved', 'failednphies'];
    if (inValidStatus.indexOf(status) >= 0) {
      return false;
    } else {
      return true;
    }
  }

  claimIsEditable(status: string) {
    return ['accepted', 'notaccepted', 'error', 'cancelled', 'invalid', 'failed'].includes(status.trim().toLowerCase());
  }
  claimIsDeletable(status: string) {
    return ['accepted', 'notaccepted', 'error', 'cancelled', 'invalid'].includes(status.trim().toLowerCase());
  }
  /*claimIsCancelled(status: string) {
    return ['cancelled'].includes(status.trim().toLowerCase());
  }*/

  get showCancelAll() {
    return ['pended', 'approved', 'partial'].includes(this.summaries[this.selectedCardKey].statuses[0].toLowerCase());
  }

  get showInquireAll() {
    // tslint:disable-next-line:max-line-length
    return ['queued', 'pended', 'approved', 'partial', 'rejected', 'failednphies', 'invalid'].includes(this.summaries[this.selectedCardKey].statuses[0].toLowerCase());
  }

  get showDeleteAll() {
    // tslint:disable-next-line:max-line-length
    return ['accepted', 'notaccepted', 'error', 'cancelled', 'invalid'].includes(this.summaries[this.selectedCardKey].statuses[0].toLowerCase());
  }

  get showDownloadBtn() {
    // tslint:disable-next-line:max-line-length
    return ['notaccepted', 'rejected', 'partial', 'invalid'].includes(this.summaries[this.selectedCardKey].statuses[0].toLowerCase());
  }

  openReasonModalMultiClaims() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog'];

    if (this.selectedClaims.length === 0) {
      const payerIds: string[] = [];
      if (this.params.payerId) {
        payerIds.push(this.params.payerId);
      }

      const model: any = {};
      model.providerId = this.providerId;
      model.selectedClaims = this.selectedClaims;
      model.uploadId = this.params.uploadId;
      model.claimRefNo = this.params.claimRefNo;
      model.to = this.params.to;
      model.payerIds = payerIds;
      model.batchId = this.params.batchId;
      model.memberId = this.params.memberId;
      model.invoiceNo = this.params.invoiceNo;
      model.patientFileNo = this.params.patientFileNo;
      model.from = this.params.from;
      model.nationalId = this.params.nationalId;
      model.statuses = [];
      model.statuses.push(this.summaries[this.selectedCardKey].statuses[0].toLowerCase());
      model.organizationId = this.params.organizationId;

      dialogConfig.data = {
        cancelData: model,
        cancelType: 'all',
        type: 'cancel'
      };

      const dialogRef = this.dialog.open(CancelReasonModalComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.Success) {
          if (result.Errors && result.Errors.length > 0) {
            // tslint:disable-next-line:max-line-length
            this.dialogService.showMessageObservable(result.Message, '', 'alert', true, 'OK', result.Errors, true).subscribe(res => {
              this.resetURL();
              this.fetchData();
            });
          } else {
            this.dialogService.openMessageDialog(
              new MessageDialogData('Success', result.Message, false)
            ).subscribe(res => {
              this.resetURL();
              this.fetchData();
            });
          }
        } else if ((result && !result.Success && result.Error)) {
          this.handleCancelErrors(result.Error);
        }
      });

    } else {
      const model: any = {};
      model.providerId = this.providerId;
      model.selectedClaims = this.selectedClaims;

      dialogConfig.data = {
        cancelData: model,
        cancelType: 'selected',
        type: 'cancel'
      };

      const dialogRef = this.dialog.open(CancelReasonModalComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.Success) {
          this.deSelectAll();
          if (result.Errors && result.Errors.length > 0) {
            // tslint:disable-next-line:max-line-length
            this.dialogService.showMessageObservable(result.Message, '', 'alert', true, 'OK', result.Errors, true).subscribe(res => {
              this.resetURL();
              this.fetchData();
            });
          } else {
            this.dialogService.openMessageDialog(
              new MessageDialogData('Success', result.Message, false)
            ).subscribe(res => {
              this.resetURL();
              this.fetchData();
            });
          }

        } else if ((result && !result.Success && result.Error)) {
          this.handleCancelErrors(result.Error);
        }
      });
    }
  }

  handleCancelErrors(error) {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 400) {
        this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', error.error.errors);
      } else if (error.status === 404) {
        this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK');
      } else if (error.status === 500) {
        this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK');
      } else if (error.status === 503) {
        const errors: any[] = [];
        if (error.error.errors) {
          error.error.errors.forEach(x => {
            errors.push(x);
          });
          this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', errors);
        } else {
          this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK');
        }
      }
    }
  }

  deleteClaimByCriteria() {
    // tslint:disable-next-line:max-line-length
    this.dialogService.openMessageDialog(
      new MessageDialogData('Delete Claims?',
        // tslint:disable-next-line:max-line-length
        `This will delete all claims according to your selection criteria. Are you sure you want to delete it? This cannot be undone.`,
        false,
        true))
      .subscribe(result => {
        if (result === true) {
          this.commen.loadingChanged.next(true);
          const status = this.isAllCards ? null : this.summaries[this.selectedCardKey].statuses;
          const payerIds: string[] = [];
          if (this.params.payerId) {
            payerIds.push(this.params.payerId);
          }
          this.providerNphiesApprovalService.deleteClaimByCriteria(this.providerId, this.params.organizationId,
            this.params.uploadId, this.params.batchId, null, this.params.filter_claimRefNo,
            this.params.filter_patientFileNo, this.params.invoiceNo, this.params.policyNo, status,
            this.params.filter_memberId, this.selectedClaims, this.params.from, this.params.to, payerIds,
            this.params.filter_drName, this.params.filter_nationalId, this.params.filter_claimDate,
            this.params.filter_netAmount, this.params.filter_batchNum).subscribe(event => {
              if (event instanceof HttpResponse) {
                this.commen.loadingChanged.next(false);
                const status = event.body['status'];
                if (status === 'Deleted') {
                  this.dialogService.openMessageDialog(
                    new MessageDialogData('',
                      `Your claims deleted successfully.`,
                      false))
                    .subscribe(afterColse => {
                      const uploadId = this.params.uploadId;

                      if (this.selectedClaims.length == this.summaries[0].totalClaims) {
                        this.router.navigate(['/nphies/uploads']);
                      } else {
                        this.router.navigate([this.commen.providerId, 'claims', 'nphies-search-claim'], {
                          queryParams: { uploadId }
                        }).then(() => {
                          window.location.reload();
                        });
                        /*this.selectedCardKey=0;
                        this.resetURL();
                        location.reload();*/
                      }
                    });
                } else if (status === 'AlreadySumitted') {
                  this.dialogService.openMessageDialog(
                    // tslint:disable-next-line:max-line-length
                    new MessageDialogData('', `Your claims deleted successfully. Some claims have not deleted because they are already submitted.`,
                      false))
                    .subscribe(afterColse => {
                      this.router.navigate(['/nphies/uploads']);
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

  inquireClaimByCriteria() {

    const payerIds: string[] = [];
    if (this.params.payerId) {
      payerIds.push(this.params.payerId);
    }

    const model: any = {};
    model.providerId = this.providerId;
    model.selectedClaims = this.selectedClaims;
    model.uploadId = this.params.uploadId;
    model.claimRefNo = this.params.claimRefNo;
    model.to = this.params.to;
    model.payerIds = payerIds;
    model.batchId = this.params.batchId;
    model.memberId = this.params.memberId;
    model.invoiceNo = this.params.invoiceNo;
    model.patientFileNo = this.params.patientFileNo;
    model.from = this.params.from;
    model.nationalId = this.params.nationalId;
    model.statuses = [];
    model.statuses.push(this.summaries[this.selectedCardKey].statuses[0].toLowerCase());

    this.commen.loadingChanged.next(true);

    let action: any;
    if (this.selectedClaims.length === 0) {
      action = this.providerNphiesApprovalService.inquireClaims(model.providerId, model.selectedClaims,
        model.uploadId, model.claimRefNo, model.to,
        model.payerIds, model.batchId, model.memberId, model.invoiceNo,
        model.patientFileNo, model.from, model.nationalId, model.statuses, this.params.organizationId);
    } else {
      action = this.providerNphiesApprovalService.inquireClaims(model.providerId, model.selectedClaims);
    }

    action.subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        if (event.status === 202) {
          const body: any = event.body;
          this.dialogService.openMessageDialog(
            new MessageDialogData('Success', body.message, false)
          ).subscribe(res => {
            this.resetURL();
            this.fetchData();
          });
        }
        this.commen.loadingChanged.next(false);
      }
    }, error => {
      this.commen.loadingChanged.next(false);
    });
  }

  async downloadSheetFormat() {
    if (this.detailTopActionIcon === 'ic-check-circle.svg') { return; }
    let event;
    event = this.providerNphiesSearchService.downloadMultiSheetSummaries(this.claimSearchCriteriaModel);
    if (event != null) {
      this.downloadService.startGeneratingDownloadFile(event)
        .subscribe(status => {
          if (status !== DownloadStatus.ERROR) {
            this.detailTopActionIcon = 'ic-check-circle.svg';
          } else {
            this.detailTopActionIcon = 'ic-download.svg';
          }
        });
    }

  }
}
