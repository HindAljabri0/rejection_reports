import { SearchClaimsComponent } from 'src/app/pages/searchClaimsPage/search-claims.component';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { UploadService } from '../../../services/claimfileuploadservice/upload.service';
import { UploadSummary } from 'src/app/models/uploadSummary';
import { ClaimStatus } from 'src/app/models/claimStatus';
import { CommenServicesService } from 'src/app/services/commen-services.service';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { ClaimInfo } from 'src/app/models/claimInfo';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { MatPaginator } from '@angular/material';
import { Router, RouterEvent, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { ClaimfileuploadComponent } from '../claimfileupload/claimfileupload.component';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { ClaimService } from 'src/app/services/claimService/claim.service';



@Component({
  selector: 'app-claimsummary',
  templateUrl: './claimsummary.component.html',
  styleUrls: ['./claimsummary.component.css']
})
export class ClaimsummaryComponent implements OnInit, OnDestroy {

  paginatedResult: PaginatedResult<ClaimInfo>;
  results: any[];
  filename: ClaimfileuploadComponent;
  // providerId: string;
  // uploadId: any;


  paginatorPagesNumbers: number[];
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  paginatorPageSizeOptions = [10, 20, 50, 100];
  manualPage = null;

  routingObservable: Subscription;
  summaryObservable: Subscription;

  showClaims: boolean = false;
  detailCardTitle: string;
  detailAccentColor: string;
  selectedCardKey: string;

  // currentFileUpload: File;


  card0Title = this.commen.statusToName(ClaimStatus.ALL);
  card0ActionText = 'details';
  card0AccentColor = "#3060AA";
  private searchClaimsComponent : SearchClaimsComponent;

  card0Action() {
    this.showClaims = true;
    this.detailCardTitle = this.card0Title;
    this.detailAccentColor = this.card0AccentColor;
    this.getUploadedClaimsDetails();
    this.selectedCardKey = null;
  }

  /* checkfile() {
    const validExts = new Array('.xlsx', '.xls');
    let fileExt = this.currentFileUpload.name;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
  }*/

  card1Title = this.commen.statusToName(ClaimStatus.Accepted);
  card1ActionText = 'details';
  card1AccentColor = "#21B744";
  card1Action() {
    this.showClaims = true;
    this.detailCardTitle = this.card1Title;
    this.detailAccentColor = this.card1AccentColor;
    this.selectedCardKey = 'Accepted';
    this.getUploadedClaimsDetails(this.selectedCardKey);
  }

  card2Title = this.commen.statusToName(ClaimStatus.NotAccepted);
  card2ActionText = 'details';
  card2AccentColor = "#EB2A75"
  card2Action() {
    this.showClaims = true;
    this.detailCardTitle = this.card2Title;
    this.detailAccentColor = this.card2AccentColor;
    this.selectedCardKey = 'NotAccepted';
    this.getUploadedClaimsDetails(this.selectedCardKey);
  }

  card3Title = this.commen.statusToName(ClaimStatus.Not_Saved);
  card3ActionText = 'details';
  card3AccentColor = "#E3A820";
  card3Action() {
    this.showClaims = true;
    this.detailCardTitle = this.card3Title;
    this.detailAccentColor = this.card3AccentColor;
    this.selectedCardKey = 'NotUploaded';
    this.getUploadedClaimsDetails(this.selectedCardKey);
  }



  constructor(public location: Location, public uploadService: UploadService, public commen: CommenServicesService, private router: Router,
    private routeActive: ActivatedRoute, private dialogService: DialogService, private claimService: ClaimService) {
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
            }
          }, eventError => {
            this.commen.loadingChanged.next(false);
          });
        } else if (this.summary.uploadSummaryID != null && this.location.path().includes('summary')) {
          this.location.go('/summary?id=' + this.summary.uploadSummaryID);
          this.getResults();
        } else if (this.location.path().includes('summary')) {
          this.router.navigate(['/upload']);
        }
      });
    });
  }

  ngOnInit() {
    this.summaryObservable = this.uploadService.summaryChange.subscribe(value => {
      this.router.navigate(['/summary']);
    });
    this.dialogService.onClaimDialogClose.subscribe(value => {
      if (value != null && value) {
        this.searchClaimsComponent.fetchData();
      }
    })
  }
  ngOnDestroy() {
    this.routingObservable.unsubscribe();
    if (this.summaryObservable != null)
      this.summaryObservable.unsubscribe();
  }

  getResults() {
    let value = this.summary;
    if (value.noOfUploadedClaims != 0) {
      this.card0Action();
    } else if (value.noOfAcceptedClaims != 0) {
      this.card1Action();
    } else if (value.noOfNotAcceptedClaims != 0) {
      this.card2Action();
    } else if (value.noOfNotUploadedClaims != 0) {
      this.card3Action();
    }
  }

  get summary(): UploadSummary {
    if (this.location.path().includes("summary"))
      return this.uploadService.summary;
    else
      return new UploadSummary();
  }

  getUploadedClaimsDetails(status?: string, page?: number, pageSize?: number) {
    if (this.commen.loading) return;
    this.commen.loadingChanged.next(true);
    if (this.paginatedResult != null)
      this.paginatedResult.content = [];
    this.uploadService.getUploadedClaimsDetails(this.commen.providerId, this.uploadService.summary.uploadSummaryID, status, page, pageSize).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.commen.loadingChanged.next(false);
        this.paginatedResult = new PaginatedResult(event.body, ClaimInfo);
        this.results = [];
        this.paginatedResult.content.forEach(result => {
          if (result.uploadSubStatus == ClaimStatus.Accepted) {
            let col: any = {};
            col.description = '-';
            col.fieldName = '-';
            col.fileRowNumber = result.fileRowNumber || '';
            col.provclaimno = result.provclaimno || '';
            col.uploadStatus = result.uploadStatus || '';
            col.uploadSubStatus = result.uploadSubStatus || '';
            this.results.push(col);
          } else {
            result.claimErrors.forEach(error => {
              let col: any = {};
              col.code = error.code || '';
              col.description = error.errorDescription || '';
              col.fieldName = error.fieldName || '';
              col.fileRowNumber = result.fileRowNumber || '';
              col.provclaimno = result.provclaimno || '';
              col.uploadStatus = result.uploadStatus || '';
              col.uploadSubStatus = result.uploadSubStatus || '';
              this.results.push(col);
            });
          }
        });
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
    this.paginatorAction({ previousPageIndex: this.paginator.pageIndex, pageIndex: index, pageSize: this.paginator.pageSize, length: this.paginator.length })
  }
  paginatorAction(event) {
    this.manualPage = event['pageIndex'];
    this.getUploadedClaimsDetails(this.selectedCardKey, event['pageIndex'], event['pageSize']);
  }

  goToFirstPage() {
    this.paginatorAction({ pageIndex: 0, pageSize: 10 });
  }
  goToPrePage() {
    if (this.paginatedResult.number != 0)
      this.paginatorAction({ pageIndex: this.paginatedResult.number - 1, pageSize: 10 });
  }
  goToNextPage() {
    if (this.paginatedResult.number + 1 < this.paginatedResult.totalPages)
      this.paginatorAction({ pageIndex: this.paginatedResult.number + 1, pageSize: 10 });
  }
  goToLastPage() {
    this.paginatorAction({ pageIndex: this.paginatedResult.totalPages - 1, pageSize: 10 });
  }

  accentColor(status) {
    return this.commen.getCardAccentColor(status);
  }
  get providerId(){
    return this.commen.providerId;
  }
  get uploadId(){
    return this.commen.uploadId;
  }
  viewClaims() {
    this.router.navigate([this.providerId, 'claims'], { queryParams: { uploadId: this.summary.uploadSummaryID } })
  }


  deleteClaimByUploadid(uploadSummaryID: number, refNumber:string){
    this.dialogService.openMessageDialog(new MessageDialogData('Delete Upload?', `This will delete all related claims for the upload with reference: ${refNumber}. Are you sure you want to delete it? This cannot be undone.`, false, true))
    .subscribe(result => {
      if(result === true){
        this.commen.loadingChanged.next(true);
        this.uploadService.deleteClaimByUploadid(this.providerId, uploadSummaryID).subscribe(event =>{
          if(event instanceof HttpResponse){
            this.commen.loadingChanged.next(false);

            this.dialogService.openMessageDialog(new MessageDialogData('', `Upload with reference ${refNumber} was deleted successfully.`, false))
            .subscribe(afterColse => this.searchClaimsComponent.fetchData());
          }
        }, errorEvent => {
          if(errorEvent instanceof HttpErrorResponse){
            this.commen.loadingChanged.next(false);
            this.dialogService.openMessageDialog(new MessageDialogData('', errorEvent.message, true));
          }
        });
      }
    });
  }

  get uploading(){
    return this.uploadService.uploading;
  }
}
