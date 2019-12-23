import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { UploadService } from '../../../services/claimfileuploadservice/upload.service';
import { UploadSummary } from 'src/app/models/uploadSummary';
import { ClaimStatus } from 'src/app/models/claimStatus';
import { CommenServicesService } from 'src/app/services/commen-services.service';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { ClaimInfo } from 'src/app/models/claimInfo';
import { HttpResponse } from '@angular/common/http';
import { MatPaginator } from '@angular/material';
import { Router, RouterEvent, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-claimsummary',
  templateUrl: './claimsummary.component.html',
  styleUrls: ['./claimsummary.component.css']
})
export class ClaimsummaryComponent implements OnInit, OnDestroy {

  paginatedResult:PaginatedResult<ClaimInfo>;

  paginatorPagesNumbers:number[];
  @ViewChild('paginator', {static:false}) paginator: MatPaginator;
  paginatorPageSizeOptions = [10,20, 50, 100];
  manualPage = null;

  routingObservable:Subscription;
  summaryObservable:Subscription;

  showClaims:boolean = false;
  detailCardTitle: string;
  detailAccentColor:string;
  selectedCardKey:string;

  card0Title = this.commen.statusToName(ClaimStatus.ALL);
  card0ActionText = 'details';
  card0AccentColor = "#3060AA";
  card0Action() {
    this.showClaims = true;
    this.detailCardTitle = this.card0Title;
    this.detailAccentColor = this.card0AccentColor;
    this.getUploadedClaimsDetails();
    this.selectedCardKey = null;
  }

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



  constructor(public location: Location, public uploadService: UploadService, public commen:CommenServicesService, private router:Router, private routeActive:ActivatedRoute) {
    this.routingObservable = this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.routeActive.queryParams.subscribe(value => {
        if(value.id!=null && this.location.path().includes('summary')) {
          this.commen.loadingChanged.next(true);
          this.uploadService.getUploadedSummary(value.id).subscribe(event => {
            if(event instanceof HttpResponse){
              this.commen.loadingChanged.next(false);
              const summary:UploadSummary = JSON.parse(JSON.stringify(event.body));
              this.uploadService.summaryChange.next(summary);
            }
          }, eventError => {
            this.commen.loadingChanged.next(false);
          });
        } else if(this.summary.uploadSummaryID != null && this.location.path().includes('summary')){
          this.location.go('/summary?id='+this.summary.uploadSummaryID);
          this.getResults();
        } else if(this.location.path().includes('summary')){
          this.location.go('/upload');
        }
      });
    });
  }

  ngOnInit() {
    this.summaryObservable =this.uploadService.summaryChange.subscribe(value =>{
      this.router.navigate(['/summary']);
    });
  }
  ngOnDestroy(){
    this.routingObservable.unsubscribe();
    this.summaryObservable.unsubscribe();
  }

  getResults(){
    let value = this.summary;
    if(value.noOfUploadedClaims != 0){
      this.card0Action();
    } else if(value.noOfAcceptedClaims != 0){
      this.card1Action();
    } else if(value.noOfNotAcceptedClaims != 0){
      this.card2Action();
    } else if(value.noOfNotUploadedClaims != 0){
      this.card3Action();
    }
  }

  get summary(): UploadSummary {
    if(this.location.path().includes("summary"))
      return this.uploadService.summary;
    else
      return new UploadSummary();
  }

  getUploadedClaimsDetails(status?:string, page?:number, pageSize?:number){
    if(this.commen.loading) return;
    this.commen.loadingChanged.next(true);
    if(this.paginatedResult != null)
      this.paginatedResult.content = [];
    this.uploadService.getUploadedClaimsDetails(this.uploadService.summary.uploadSummaryID, status, page, pageSize).subscribe(event => {
      if(event instanceof HttpResponse){
        this.commen.loadingChanged.next(false);
        this.paginatedResult = new PaginatedResult(event.body, ClaimInfo);
        this.paginatorPagesNumbers = Array(this.paginatedResult.totalPages).fill(this.paginatedResult.totalPages).map((x,i)=>i);
        this.manualPage = this.paginatedResult.number;
      }
    }, eventError => {
      this.commen.loadingChanged.next(false);
    });
  }

  updateManualPage(index) {
    this.manualPage = index;
    this.paginator.pageIndex = index;
    this.paginatorAction({previousPageIndex: this.paginator.pageIndex, pageIndex: index, pageSize: this.paginator.pageSize, length: this.paginator.length})
  }
  paginatorAction(event){
    this.manualPage = event['pageIndex'];
    this.getUploadedClaimsDetails(this.selectedCardKey, event['pageIndex'], event['pageSize']);
  }

}
