import { SearchClaimsComponent } from 'src/app/pages/searchClaimsPage/search-claims.component';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { UploadService } from '../../../services/claimfileuploadservice/upload.service';
import { UploadSummary } from 'src/app/models/uploadSummary';
import { ClaimStatus } from 'src/app/models/claimStatus';
import { SharedServices } from 'src/app/services/shared.services';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatPaginator } from '@angular/material';
import { Router, RouterEvent, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { ClaimfileuploadComponent } from '../claimfileupload/claimfileupload.component';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { ClaimService } from 'src/app/services/claimService/claim.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { UploadSummaryDialogComponent } from './upload-summary-dialog/upload-summary-dialog.component';
import { ClaimSummaryError } from 'src/app/models/claimSummaryError';
import { AuthService } from 'src/app/services/authService/authService.service';

@Component({
  selector: 'app-claimsummary',
  templateUrl: './claimsummary.component.html',
  styles: []
})
export class ClaimsummaryComponent implements OnInit, OnDestroy {
  paginatedResult: PaginatedResult<ClaimSummaryError>;
  results: {};
  filename: ClaimfileuploadComponent;
  // providerId: string;
  // uploadId: any;


  paginatorPagesNumbers: number[];
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  paginatorPageSizeOptions = [10, 20, 50, 100];
  manualPage = null;

  routingObservable: Subscription;
  summaryObservable: Subscription;

  showClaims = false;
  detailCardTitle: string;
  detailAccentColor: string;
  selectedCardKey = 'All';

  // currentFileUpload: File;


  card0Title = this.commen.statusToName(ClaimStatus.ALL);
  card0ActionText = 'details';
  card0AccentColor = 'all-claim';
  private searchClaimsComponent: SearchClaimsComponent;

  /* checkfile() {
    const validExts = new Array('.xlsx', '.xls');
    let fileExt = this.currentFileUpload.name;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
  }*/

  card1Title = this.commen.statusToName(ClaimStatus.Accepted);
  card1ActionText = 'details';
  card1AccentColor = 'ready-submission';

  card2Title = this.commen.statusToName(ClaimStatus.NotAccepted);
  card2ActionText = 'details';
  card2AccentColor = 'rejected-waseel';

  card3Title = this.commen.statusToName(ClaimStatus.Not_Saved);
  card3ActionText = 'details';
  card3AccentColor = 'not-saved';

  card4Title = this.commen.statusToName(ClaimStatus.Downloadable);
  card4ActionText = 'details';
  card4AccentColor = 'ready-submission';

  cardCount = 0;

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
  isFirstTimeLoad: boolean;

  constructor(
    public location: Location,
    public uploadService: UploadService,
    public commen: SharedServices,
    private router: Router,
    private routeActive: ActivatedRoute,
    private dialogService: DialogService,
    private claimService: ClaimService,
    private authService: AuthService,
    private dialog: MatDialog) {

    this.routingObservable = this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.routeActive.queryParams.subscribe(value => {
        if (value.id != null && this.location.path().includes('summary')) {
          this.commen.loadingChanged.next(true);
          this.uploadService.getUploadedSummary(this.commen.providerId, value.id).subscribe(event => {
            if (event instanceof HttpResponse) {
              this.commen.loadingChanged.next(false);
              const summary: UploadSummary = JSON.parse(JSON.stringify(event.body));
              this.uploadService.summaryChange.next(summary);
              this.cardCount = (uploadService.summary.noOfUploadedClaims != 0) ? this.cardCount + 1 : this.cardCount;
              this.cardCount = (uploadService.summary.noOfAcceptedClaims != 0) ? this.cardCount + 1 : this.cardCount;
              this.cardCount = (uploadService.summary.noOfNotAcceptedClaims != 0) ? this.cardCount + 1 : this.cardCount;
              this.cardCount = (uploadService.summary.noOfNotUploadedClaims != 0) ? this.cardCount + 1 : this.cardCount;
              this.cardCount = (uploadService.summary.noOfDownloadableClaims != 0) ? this.cardCount + 1 : this.cardCount;
            }
            if (this.summary.uploadSummaryID != null && this.location.path().includes('summary')) {
              // this.location.go('/summary?id=' + this.summary.uploadSummaryID);
              this.getResults();
            } else if (this.location.path().includes('summary')) {
              // this.router.navigate(['/upload']);
              this.summary.uploadSummaryID = parseInt(value.id);
              this.getResults();
            }
          }, eventError => {
            this.commen.loadingChanged.next(false);
          });
        }
        // else if (this.location.path().includes('summary')) {
        //   this.router.navigate(['/upload']);
        // }

      });
    });

  }

  get summary(): UploadSummary {
    if (this.location.path().includes('summary')) {
      // this.uploadService.summary.ratioForAccepted = 20;
      // this.uploadService.summary.ratioForNotAccepted = 50;
      return this.uploadService.summary;
    } else {
      return new UploadSummary();
    }
  }
  get providerId() {
    return this.commen.providerId;
  }
  get uploadId() {
    return this.commen.uploadId;
  }

  get uploading() {
    return this.uploadService.uploading;
  }

  card0Action() {
    this.showClaims = true;
    this.detailCardTitle = this.card0Title;
    this.detailAccentColor = this.card0AccentColor;
    this.getUploadedClaimsDetails();
    this.selectedCardKey = 'All';
  }
  card1Action() {
    this.showClaims = true;
    this.detailCardTitle = this.card1Title;
    this.detailAccentColor = this.card1AccentColor;
    this.selectedCardKey = 'Accepted';
    this.getUploadedClaimsDetails(this.selectedCardKey);
  }
  card2Action() {
    this.showClaims = true;
    this.detailCardTitle = this.card2Title;
    this.detailAccentColor = this.card2AccentColor;
    this.selectedCardKey = 'NotAccepted';
    this.getUploadedClaimsDetails(this.selectedCardKey);
  }
  card3Action() {
    this.showClaims = true;
    this.detailCardTitle = this.card3Title;
    this.detailAccentColor = this.card3AccentColor;
    this.selectedCardKey = 'NotUploaded';
    this.getUploadedClaimsDetails(this.selectedCardKey);
  }
  card4Action() {
    this.showClaims = true;
    this.detailCardTitle = this.card4Title;
    this.detailAccentColor = this.card4AccentColor;
    this.selectedCardKey = 'Downloadable';
    this.getUploadedClaimsDetails(this.selectedCardKey);
  }

  ngOnInit() {
    this.isFirstTimeLoad = false;
    this.summaryObservable = this.uploadService.summaryChange.subscribe(value => {
      if (this.isFirstTimeLoad)
        this.router.navigate(['/summary']);
      else
        this.isFirstTimeLoad = true;
    });
    this.dialogService.onClaimDialogClose.subscribe(value => {
      if (value != null && value) {
        this.searchClaimsComponent.fetchData();
      }
    });
  }
  ngOnDestroy() {
    this.routingObservable.unsubscribe();
    if (this.summaryObservable != null) {
      this.summaryObservable.unsubscribe();
    }
  }

  getResults() {
    const value = this.summary;
    if (value.noOfUploadedClaims != 0) {
      this.card0Action();
    } else if (value.noOfAcceptedClaims != 0) {
      this.card1Action();
    } else if (value.noOfNotAcceptedClaims != 0) {
      this.card2Action();
    } else if (value.noOfNotUploadedClaims != 0) {
      this.card3Action();
    } else if (value.noOfDownloadableClaims != 0) {
      this.card4Action();
    }
  }

  getUploadedClaimsDetails(status?: string, page?: number, pageSize?: number) {
    // if (this.commen.loading) { return; }
    this.commen.loadingChanged.next(true);
    if (this.paginatedResult != null) {
      this.paginatedResult.content = [];
    }
    this.uploadService.getUploadedClaimsDetails(
      this.commen.providerId,
      this.uploadService.summary.uploadSummaryID,
      status,
      page,
      pageSize
    ).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.commen.loadingChanged.next(false);
        this.paginatedResult = new PaginatedResult(event.body, ClaimSummaryError);
        this.results = [];
        this.paginatorPagesNumbers = Array(this.paginatedResult.totalPages).fill(this.paginatedResult.totalPages).map((x, i) => i);
        this.manualPage = this.paginatedResult.number;
      }
    }, eventError => {
      this.commen.loadingChanged.next(false);
    });
  }

  updateManualPage(index) {
    this.manualPage = index;
    this.paginator.pageIndex = index;
    this.paginatorAction({
      previousPageIndex: this.paginator.pageIndex,
      pageIndex: index,
      pageSize: this.paginator.pageSize,
      length: this.paginator.length
    });
  }
  paginatorAction(event) {
    this.manualPage = event.pageIndex;
    this.getUploadedClaimsDetails(this.selectedCardKey, event.pageIndex, event.pageSize);
  }

  goToFirstPage() {
    this.paginatorAction({ pageIndex: 0, pageSize: 10 });
  }
  goToPrePage() {
    if (this.paginatedResult.number != 0) {
      this.paginatorAction({ pageIndex: this.paginatedResult.number - 1, pageSize: 10 });
    }
  }
  goToNextPage() {
    if (this.paginatedResult.number + 1 < this.paginatedResult.totalPages) {
      this.paginatorAction({ pageIndex: this.paginatedResult.number + 1, pageSize: 10 });
    }
  }
  goToLastPage() {
    this.paginatorAction({ pageIndex: this.paginatedResult.totalPages - 1, pageSize: 10 });
  }

  accentColor(status) {
    return this.commen.getCardAccentColor(status);
  }
  viewClaims() {
    this.router.navigate([this.providerId, 'claims'], { queryParams: { uploadId: this.summary.uploadSummaryID } });
  }


  // deleteClaimByUploadid(uploadSummaryID: number, refNumber: string) {
  //   this.dialogService.openMessageDialog(
  //     new MessageDialogData('Delete Upload?',
  //       `This will delete all related claims for the upload with reference: ${refNumber}. Are you sure you want to delete it?
  // This cannot be undone.`,
  //       false,
  //       true))
  //     .subscribe(result => {
  //       if (result === true) {
  //         this.commen.loadingChanged.next(true);
  //         this.claimService.deleteClaimByUploadid(this.providerId, uploadSummaryID).subscribe(event => {
  //           if (event instanceof HttpResponse) {
  //             this.commen.loadingChanged.next(false);

  //             this.dialogService.openMessageDialog(
  //               new MessageDialogData('',
  //                 `Upload with reference ${refNumber} was deleted successfully.`,
  //                 false))
  //               .subscribe(afterColse => {
  //                 this.uploadService.summaryChange.next(new UploadSummary());
  //                 this.router.navigate(['']);
  //               });
  //           }
  //         }, errorEvent => {
  //           if (errorEvent instanceof HttpErrorResponse) {
  //             this.commen.loadingChanged.next(false);
  //             this.dialogService.openMessageDialog(new MessageDialogData('', errorEvent.message, true));
  //           }
  //         });
  //       }
  //     });
  // }

  openUploadSummaryDialog(data: any) {
    this.commen.loadingChanged.next(true);
    this.uploadService.getClaimsErrorByFieldName(this.commen.providerId,
      this.uploadService.summary.uploadSummaryID,
      data.fieldName).subscribe(event => {
        if (event instanceof HttpResponse) {
          this.commen.loadingChanged.next(false);
          this.results = event.body;
          const dialogRef = this.dialog.open(UploadSummaryDialogComponent, {
            panelClass: ['primary-dialog', 'dialog-xl'],
            data: {
              themeColor: this.commen.getCardAccentColor(this.selectedCardKey),
              results: this.results,
              status: this.commen.statusToName(this.selectedCardKey),
              fieldName: data.fieldName
            }
          });
        }
      }, err => {
        if (err.status) {
          this.authService.logout();
        }
      }), eventError => {
        this.commen.loadingChanged.next(false);
      };

  }
}
