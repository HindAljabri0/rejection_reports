import { AttachmentService } from './../../services/attachmentService/attachment.service';
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

@Component({
  selector: 'app-search-claims',
  templateUrl: './search-claims.component.html',
  styleUrls: ['./search-claims.component.css']
})
export class SearchClaimsComponent implements OnInit, AfterViewChecked, OnDestroy {
  file: File;

  constructor(public location: Location, public submittionService: ClaimSubmittionService,
    public commen: SharedServices, public routeActive: ActivatedRoute,
    public router: Router, public searchService: SearchService,
    private dialogService: DialogService,
    private claimService: ClaimService,
    private eligibilityService: EligibilityService,
    private notificationService: NotificationsService,
    private attachmentService: AttachmentService) {
  }
  ngOnDestroy(): void {
    this.notificationService.stopWatchingMessages('eligibility');
    this.routerSubscription.unsubscribe();
  }

  isViewChecked: boolean = false;

  progressChange: Subject<{ percentage: number }> = new Subject();


  placeholder = '-';
  cardsClickAble: boolean = true;
  extraCards = 3;
  extraNumbers: number[];

  detailCardTitle: string;
  detailTopActionText = "vertical_align_bottom";
  detailAccentColor: string;
  detailActionText: string = null;
  detailSubActionText: string = null;
  detailCheckBoxIndeterminate: boolean;
  detailCheckBoxChecked: boolean;

  providerId: string;
  from: string;
  to: string;
  payerId: string;
  batchId: string;
  uploadId: string;
  casetype: string;
  claimId: string;
  editMode: string;
  routerSubscription: Subscription;

  summaries: SearchStatusSummary[];
  currentSummariesPage: number = 1;
  searchResult: PaginatedResult<SearchedClaim>;
  claims: SearchedClaim[];
  uploadSummaries: UploadSummary[];
  selectedClaims: string[] = new Array();
  selectedClaimsCountOfPage: number = 0;
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

  waitingEligibilityCheck: boolean = false;
  eligibilityWaitingList: { result: string, waiting: boolean }[] = [];
  watchingEligibility: boolean = false;

  ngOnInit() {
    this.fetchData();
    this.routerSubscription = this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd && event.url.includes("/claims") && !event.url.includes("/add"))
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
      this.uploadId = value.uploadId
      this.queryStatus = value.status == null ? 0 : Number.parseInt(value.status);
      this.queryPage = value.page == null ? 0 : Number.parseInt(value.page) - 1;
      if (Number.isNaN(this.queryStatus) || this.queryStatus < 0) this.queryStatus = 0;
      if (Number.isNaN(this.queryPage) || this.queryPage < 0) this.queryPage = 0;
      this.casetype = value.casetype;
      this.claimId = value.claimId;
      this.editMode = value.editMode;
    }).unsubscribe();
    if ((this.payerId == null || this.from == null || this.to == null || this.payerId == '' || this.from == '' || this.to == '') && (this.batchId == null || this.batchId == '') && (this.uploadId == null || this.uploadId == '')) {
      this.commen.loadingChanged.next(false);
      this.router.navigate(['']);
    }
    for (status in ClaimStatus) {
      if (status == ClaimStatus.INVALID) continue;
      let statusCode;
      if (status == ClaimStatus.OUTSTANDING) {
        statusCode = await this.getSummaryOfStatus([status, 'PENDING', 'UNDER_PROCESS']);
      } else if (status == ClaimStatus.REJECTED) {
        statusCode = await this.getSummaryOfStatus([status, 'INVALID', 'DUPLICATE']);
      } else if (status == ClaimStatus.Accepted) {
        statusCode = await this.getSummaryOfStatus([status, 'Failed']);
      } else if (status == ClaimStatus.PAID) {
        statusCode = await this.getSummaryOfStatus([status, 'SETTLED'])
      } else
        statusCode = await this.getSummaryOfStatus([status]);
      if (statusCode != 200) {
        break;
      }
    }

    // this.summaries = this.mapRelatedStatus();


    // this.summaries.sort((a, b) => b.totalClaims - a.totalClaims);
    // if (this.summaries.length == 2) this.summaries[0] = this.summaries.pop();

    this.getResultsofStatus(this.queryStatus, this.queryPage);

    if (!this.hasData && this.errorMessage == null) this.errorMessage = 'Sorry, we could not find any result.';
  }


  async getSummaryOfStatus(statuses: string[]): Promise<number> {
    this.commen.loadingChanged.next(true);
    let event;
    if (this.batchId == null && this.uploadId == null) {
      event = await this.searchService.getSummaries(this.providerId, statuses, this.from, this.to, this.payerId, undefined, undefined, this.casetype).toPromise().catch(error => {
        this.commen.loadingChanged.next(false);
        if (error instanceof HttpErrorResponse) {
          if ((error.status / 100).toFixed() == "4") {
            this.errorMessage = error.message;
          } else if ((error.status / 100).toFixed() == "5") {
            this.errorMessage = 'Server could not handle the request. Please try again later.';
          } else {
            this.errorMessage = 'Somthing went wrong.';
          }
          return error.status;
        }
      });
    } else if (this.uploadId != null) {
      event = await this.searchService.getSummaries(this.providerId, statuses, undefined, undefined, undefined, undefined, this.uploadId).toPromise().catch(error => {
        this.commen.loadingChanged.next(false);
        if (error instanceof HttpErrorResponse) {
          if ((error.status / 100).toFixed() == "4") {
            this.errorMessage = 'Sorry, we could not find any result.';
          } else if ((error.status / 100).toFixed() == "5") {
            this.errorMessage = 'Server could not handle the request. Please try again later.';
          } else {
            this.errorMessage = 'Somthing went wrong.';
          }
          return error.status;
        }
      });
    } else {
      event = await this.searchService.getSummaries(this.providerId, statuses, undefined, undefined, undefined, this.batchId).toPromise().catch(error => {
        this.commen.loadingChanged.next(false);
        if (error instanceof HttpErrorResponse) {
          if ((error.status / 100).toFixed() == "4") {
            this.errorMessage = 'Sorry, we could not find any result.';
          } else if ((error.status / 100).toFixed() == "5") {
            this.errorMessage = 'Server could not handle the request. Please try again later.';
          } else {
            this.errorMessage = 'Somthing went wrong.';
          }
          return error.status;
        }
      });
    }
    if (event instanceof HttpResponse) {
      if ((event.status / 100).toFixed() == "2") {
        const summary = new SearchStatusSummary(event.body);
        if (summary.totalClaims > 0) {
          this.summaries.push(summary);
        }
      }
    }
    this.commen.loadingChanged.next(false);
    return event.status;
  }

  getResultsofStatus(key: number, page?: number, pageSize?: number) {
    if (this.summaries[key] == null) return;
    if (this.summaries.length == 0) return;
    this.commen.loadingChanged.next(true);
    this.detailTopActionText = "vertical_align_bottom";

    if (this.selectedCardKey != null && key != this.selectedCardKey) {
      this.selectedClaims = new Array();
      this.selectedClaimsCountOfPage = 0;
      this.setAllCheckBoxIsIndeterminate();
    }
    this.selectedCardKey = key;
    this.selectedPage = page;
    this.resetURL();


    if (this.summaries[key].statuses[0].toLowerCase() == ClaimStatus.Accepted.toLowerCase()) {
      this.detailActionText = 'Submit All';
      this.detailSubActionText = 'Submit Selection';
    } /*else if (this.summaries[key].status == ClaimStatus.Failed){
      this.detailActionText = 'Re-Submit All';
      this.detailSubActionText = 'Re-Submit Selection';
    }*/ else {
      this.detailActionText = null;
      this.detailSubActionText = null;
    }
    this.searchResult = null;
    this.claims = new Array();

    this.searchService.getResults(this.providerId, this.from, this.to, this.payerId, this.summaries[key].statuses, page, pageSize, this.batchId, this.uploadId, this.casetype).subscribe((event) => {
      if (event instanceof HttpResponse) {
        if ((event.status / 100).toFixed() == "2") {
          this.searchResult = new PaginatedResult(event.body, SearchedClaim);
          this.claims = this.searchResult.content;
          this.selectedClaimsCountOfPage = 0;
          for (let claim of this.claims) {
            if (this.selectedClaims.includes(claim.claimId)) this.selectedClaimsCountOfPage++;
          }
          if (this.payerId == null) this.payerId = this.claims[0].payerId;
          this.setAllCheckBoxIsIndeterminate();
          this.detailAccentColor = this.commen.getCardAccentColor(this.summaries[key].statuses[0]);
          this.detailCardTitle = this.commen.statusToName(this.summaries[key].statuses[0]);
          const pages = Math.ceil((this.searchResult.totalElements / this.searchResult.numberOfElements));
          this.paginatorPagesNumbers = Array(pages).fill(pages).map((x, i) => i);
          this.manualPage = this.searchResult.number;
        } else if ((event.status / 100).toFixed() == "4") {
          console.log("400");
        } else if ((event.status / 100).toFixed() == "5") {
          console.log("500");
        } else {
          console.log("000");
        }
      }
      this.commen.loadingChanged.next(false);
      if (this.claimId != null) {
        let index = this.claims.findIndex(claim => claim.claimId == this.claimId);
        if (index != -1) {
          this.showClaim(this.claims[index].status, this.claimId, (this.editMode != null && this.editMode == 'true'));
        }
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if ((error.status / 100).toFixed() == "4") {
          this.errorMessage = 'Access Denied.';
        } else if ((error.status / 100).toFixed() == "5") {
          this.errorMessage = 'Server could not handle the request. Please try again later.';
        } else {
          this.errorMessage = 'Somthing went wrong.';
        }
      }
      this.commen.loadingChanged.next(false);
    });
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
          this.dialogService.openMessageDialog(new MessageDialogData('Success', 'The selected claims were queued to be submitted.', false)).subscribe(result => {
            this.resetURL();
            this.fetchData();
          });
        }
        if (event['error'] != null) {
          for (let error of event['error']['errors']) {
            this.submittionErrors.set(error['claimID'], 'Code: ' + error['errorCode'] + ', Description: ' + error['errorDescription']);
          }
        }
        this.commen.loadingChanged.next(false);
      }
      this.deSelectAll();
    }, errorEvent => {
      this.commen.loadingChanged.next(false);
      if (errorEvent instanceof HttpErrorResponse) {
        if (errorEvent.status >= 500 || errorEvent.status == 0)
          this.dialogService.openMessageDialog(new MessageDialogData('', 'Could not reach the server. Please try again later.', true));
        if (errorEvent.error['errors'] != null)
          for (let error of errorEvent.error['errors']) {
            this.submittionErrors.set(error['claimID'], 'Code: ' + error['errorCode'] + ', Description: ' + error['errorDescription']);
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
    this.submittionService.submitAllClaims(this.providerId, this.from, this.to, this.payerId, this.uploadId).subscribe((event) => {
      if (event instanceof HttpResponse) {
        if (event.body['queuedStatus'] == 'QUEUED') {
          this.dialogService.openMessageDialog(new MessageDialogData('Success', 'The selected claims were queued to be submitted.', false)).subscribe(result => {
            this.resetURL();
            this.fetchData();
          });
        }
        this.commen.loadingChanged.next(false);
      }
    }, errorEvent => {
      this.commen.loadingChanged.next(false);
      if (errorEvent instanceof HttpErrorResponse) {
        if (errorEvent.status >= 500 || errorEvent.status == 0)
          this.dialogService.openMessageDialog(new MessageDialogData('', 'Could not reach the server. Please try again later.', true));
        if (errorEvent.error['message'] != null) {
          this.dialogService.openMessageDialog(new MessageDialogData('', errorEvent.error['message'], true));
        }
      }
    });
  }


  get hasData() {
    this.extraNumbers = new Array();
    this.extraCards = 6 - this.summaries.length;
    if (this.extraCards < 0) this.extraCards = 0;
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
    }
    else return 0;
  }


  paginatorAction(event) {
    this.manualPage = event['pageIndex'];
    if (this.summaries[this.selectedCardKey] != null) {
      this.getResultsofStatus(this.selectedCardKey, event['pageIndex'], event['pageSize']);
    }
  }
  updateManualPage(index) {
    this.manualPage = index;
    this.paginatorAction({ previousPageIndex: this.searchResult.number, pageIndex: index, pageSize: this.searchResult.numberOfElements, length: this.searchResult.size })
  }

  setAllCheckBoxIsIndeterminate() {
    if (this.claims != null)
      this.allCheckBoxIsIndeterminate = this.selectedClaimsCountOfPage != this.claims.length && this.selectedClaimsCountOfPage != 0;
    else this.allCheckBoxIsIndeterminate = false;
    this.setAllCheckBoxIsChecked();
  }
  setAllCheckBoxIsChecked() {
    if (this.claims != null)
      this.allCheckBoxIsChecked = this.selectedClaimsCountOfPage == this.claims.length;
    else this.allCheckBoxIsChecked = false;
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
    if (this.selectedClaimsCountOfPage != this.claims.length)
      for (let claim of this.claims) {
        if (!this.selectedClaims.includes(claim.claimId))
          this.selectClaim(claim.claimId);
      }
    else {
      for (let claim of this.claims) {
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
    if (this.searchResult != null)
      return this.selectedClaims.length + ' of ' + this.searchResult.totalElements + ' are selected.';
    else return '0 of 0 are selected.';
  }

  resetURL() {
    if (this.routerSubscription.closed) return;
    let claimInfo: string = "";
    if (this.claimId != null) {
      claimInfo = `&claimId=${this.claimId}`;
    }
    if (this.editMode != null) {
      claimInfo += `&editMode=${this.editMode}`;
    }
    if (this.from != null && this.to != null && this.payerId != null) {
      this.location.go(`/${this.providerId}/claims?from=${this.from}&to=${this.to}&payer=${this.payerId}`
        + (this.casetype != null ? `&casetype=${this.casetype}` : "") + claimInfo);
    } else if (this.batchId != null) {
      this.location.go(`/${this.providerId}/claims?batchId=${this.batchId}` + claimInfo);
    } else if (this.uploadId != null) {
      this.location.go(`/${this.providerId}/claims?uploadId=${this.uploadId}` + claimInfo);
    }
    if (this.selectedCardKey != 0) {
      this.location.go(this.location.path() + `&status=${this.selectedCardKey}`);
    }
    if (this.selectedPage != null && this.selectedPage > 0) {
      this.location.go(this.location.path() + `&page=${(this.selectedPage + 1)}`);
    }
  }


  showClaim(claimStatus: string, claimId: string, edit?: boolean) {
    window.open(`${location.protocol}//${location.host}/${location.pathname.split('/')[1]}/claims/${claimId}` + (edit != null ? `?edit=${edit}` : ''));
    return;
    if (this.commen.loading) return;
    this.claimId = claimId;
    this.editMode = edit != null ? `${edit}` : null;
    this.resetURL();
    this.commen.loadingChanged.next(true);
    this.attachmentService.getMaxAttachmentAllowed(this.providerId).subscribe(
      event => {
        if (event instanceof HttpResponse) {
          let maxNumber = event.body;
          this.commen.loadingChanged.next(false);
          this.dialogService.getClaimAndViewIt(this.providerId, this.payerId, claimStatus, claimId, maxNumber, edit);
        }
      }
    )

  }

  reloadClaim(claim: ViewedClaim) {
    let flag = false;
    let index = this.claims.findIndex(oldClaim => oldClaim.claimId == `${claim.claimid}`);
    const oldStatus = this.claims[index].status;
    if (oldStatus != claim.status) {
      let summaries = this.summaries;

      let oldSummaryIndex = summaries.findIndex(summary => summary.statuses.includes(this.claims[index].status.toLowerCase()));
      summaries[oldSummaryIndex] = {
        totalClaims: this.summaries[oldSummaryIndex].totalClaims - 1,
        totalNetAmount: this.summaries[oldSummaryIndex].totalNetAmount - claim.net,
        totalVatNetAmount: this.summaries[oldSummaryIndex].totalVatNetAmount - claim.netvatamount,
        statuses: this.summaries[oldSummaryIndex].statuses,
        uploadName: this.summaries[oldSummaryIndex].uploadName
      }
      this.claims[index].status = claim.status;
      let newSummaryIndex = summaries.findIndex(summary => summary.statuses.includes(claim.status.toLowerCase()));
      if (newSummaryIndex != -1) {
        summaries[newSummaryIndex] = {
          totalClaims: this.summaries[newSummaryIndex].totalClaims + 1,
          totalNetAmount: this.summaries[newSummaryIndex].totalNetAmount + claim.net,
          totalVatNetAmount: this.summaries[newSummaryIndex].totalVatNetAmount + claim.netvatamount,
          statuses: this.summaries[newSummaryIndex].statuses,
          uploadName: this.summaries[newSummaryIndex].uploadName
        }
        window.setTimeout(() => this.summaries = summaries, 1000);
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
        this.claims[index].numOfPriceListErrors = claim.errors.filter(error => error.code == 'SERVCOD-VERFIY' || error.code == 'SERVCOD-RESTRICT').length;
        this.claims[index].numOfAttachments = claim.attachments.length;
        this.claims[index].eligibilitycheck = null;
      }
    }
  }

  checkClaim(id: string) {
    this.eligibilityWaitingList[id] = { result: '', waiting: true };
    this.handleEligibilityCheckRequest(this.eligibilityService.checkEligibility(this.providerId, this.payerId, [Number.parseInt(id)]));
  }

  checkSelectedClaims() {
    this.selectedClaims.forEach(claimid => this.eligibilityWaitingList[claimid] = { result: '', waiting: true });
    this.waitingEligibilityCheck = true;
    this.handleEligibilityCheckRequest(this.eligibilityService.checkEligibility(this.providerId, this.payerId, this.selectedClaims.map(id => Number.parseInt(id))));
  }

  checkAllClaims() {
    this.waitingEligibilityCheck = true;
    this.handleEligibilityCheckRequest(this.eligibilityService.checkEligibilityByDateOrUploadId(this.providerId, this.payerId, this.from, this.to, this.uploadId));
  }

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
        } else if ((errorEvent.status / 100).toFixed() == "5") {
          this.dialogService.openMessageDialog(new MessageDialogData('', "Could not reach the server at the moment. Please try again leter.", true));
        }
      }
    })
  }
  watchEligibilityChanges() {
    if (this.watchingEligibility) return;

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
    this.dialogService.openMessageDialog(new MessageDialogData('Delete Claim?', `This will delete claim with reference: ${refNumber}. Are you sure you want to delete it? This cannot be undone.`, false, true))
      .subscribe(result => {
        if (result === true) {
          this.commen.loadingChanged.next(true);
          this.claimService.deleteClaim(this.providerId, claimId).subscribe(event => {
            if (event instanceof HttpResponse) {
              this.commen.loadingChanged.next(false);
              this.dialogService.openMessageDialog(new MessageDialogData('', `Claim with reference ${refNumber} was deleted successfully.`, false))
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
    if (this.detailTopActionText == "check_circle") return;
    this.commen.loadingChanged.next(true);
    let event;
    event = await this.searchService.downloadSummaries(this.providerId, this.summaries[this.selectedCardKey].statuses, this.from, this.to, this.payerId, this.batchId, this.uploadId).toPromise().catch(error => {
      if (error instanceof HttpErrorResponse) {
        this.dialogService.openMessageDialog(new MessageDialogData("", "Could not reach the server at the moment. Please try again later.", true));
      }
      this.commen.loadingChanged.next(false);
    });

    if (event instanceof HttpResponse) {
      if (navigator.msSaveBlob) { // IE 10+
        var exportedFilenmae = this.detailCardTitle + '_' + this.from + '_' + this.to + '.csv';
        var blob = new Blob([event.body as BlobPart], { type: 'text/csv;charset=utf-8;' });
        navigator.msSaveBlob(blob, exportedFilenmae);
      } else {
        var a = document.createElement("a");
        a.href = 'data:attachment/csv;charset=ISO-8859-1,' + encodeURI(event.body + "");
        a.target = '_blank';
        if (this.from != null) {
          a.download = this.detailCardTitle + '_' + this.from + '_' + this.to + '.csv';
        } else if (this.batchId != null) {
          a.download = this.detailCardTitle + '_Batch_' + this.batchId + '.csv';
        } else {
          a.download = this.detailCardTitle + '_ClaimsIn_' + this.summaries[0].uploadName + '.csv';
        }

        a.click();
        this.detailTopActionText = "check_circle";
        this.commen.loadingChanged.next(false);
      }
    }
  }


  doAction() {
    if (this.detailActionText.includes("Submit")) {
      this.submitAllAcceptedClaims();
    }
  }
  doSubAction() {
    if (this.detailActionText.includes("Submit")) {
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
    return status == ClaimStatus.INVALID || status == ClaimStatus.REJECTED || status == ClaimStatus.PARTIALLY_PAID || status == ClaimStatus.PARTIALLY_APPROVED;
  }

  accentColor(status) {
    return this.commen.getCardAccentColor(status);
  }

  goToFirstPage() {
    this.paginatorAction({ pageIndex: 0, pageSize: 10 });
  }
  goToPrePage() {
    if (this.searchResult.number != 0)
      this.paginatorAction({ pageIndex: this.searchResult.number - 1, pageSize: 10 });
  }
  goToNextPage() {
    if (this.searchResult.number + 1 < this.searchResult.totalPages)
      this.paginatorAction({ pageIndex: this.searchResult.number + 1, pageSize: 10 });
  }
  goToLastPage() {
    this.paginatorAction({ pageIndex: this.searchResult.totalPages - 1, pageSize: 10 });
  }

  nextSummary() {
    if (this.currentSummariesPage + 1 < this.summaries.length)
      this.currentSummariesPage++;
  }
  previousSummary() {
    if (this.currentSummariesPage - 1 > 0)
      this.currentSummariesPage--;
  }

  isEligibleState(status: string) {
    if (status == null) return false;
    return status.toLowerCase() == 'eligible';
  }
}
