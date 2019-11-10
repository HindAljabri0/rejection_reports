import { Component, OnInit, ViewChild, } from '@angular/core';
import {CommenServicesService} from '../commen-services.service';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SearchServiceService, ClaimResultContent, SearchStatusSummary, SearchResultPaginator } from './search-service.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ClaimStatus } from '../claimpage/claimfileuploadservice/upload.service';
import { MatPaginator } from '@angular/material';
import { ClaimSubmittionService } from '../claimSubmittionService/claim-submittion.service';
import { DialogData } from '../dialogs/message-dialog/message-dialog.component';

@Component({
  selector: 'app-search-claims',
  templateUrl: './search-claims.component.html',
  styleUrls: ['./search-claims.component.css']
})
export class SearchClaimsComponent implements OnInit {

  

  constructor(private submittionService:ClaimSubmittionService,private commen:CommenServicesService, private routeActive:ActivatedRoute, private router:Router, private searchService:SearchServiceService) {
  }
  placeholder = '-';
  cardsClickAble:boolean = true;
  extraCards = 3;
  extraNumbers:number[];

  detailCardTitle:string;
  detailAccentColor:string;
  detailActionText:string = null;

  providerId:string;
  from:string;
  to:string;
  payerId:string;
  
  summaries:SearchStatusSummary[];
  searchResult:SearchResultPaginator;
  claims:ClaimResultContent[];
  selectedClaims:string[] = new Array();
  selectedClaimsCount:number = 0;
  allCheckBoxIsIndeterminate:boolean;
  allCheckBoxIsChecked:boolean;

  paginatorPagesNumbers:number[];
  @ViewChild('paginator', {static:false}) paginator: MatPaginator;
  paginatorPageSizeOptions = [10,20, 50, 100];
  manualPage = null;


  selectedCardKey:number;

  errorMessage:string;

  submittionErrors:Map<string,string>;

  ngOnInit() {
    this.fetchData();
    this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.fetchData();
    });
    this.submittionErrors = new Map();
  }

  async fetchData(){
    this.commen.searchIsOpenChange.next(true);
    this.claims = new Array();
    this.summaries = new Array();
    this.commen.loadingChanged.next(true);
    this.selectedClaims = new Array();
    this.selectedClaimsCount = 0;
    this.routeActive.params.subscribe(value => {
      this.providerId = value.providerId;
    });
    this.routeActive.queryParams.subscribe(value => {
      this.from = value.from;
      this.to = value.to;
      this.payerId = value.payer;
    });
    if(this.payerId == null || this.from == null || this.to == null || this.payerId == '' || this.from == '' || this.to == ''){
      this.commen.loadingChanged.next(false);
      this.router.navigate(['']);
    }
    await this.getSummaryOfStatus('All');
    await this.getSummaryOfStatus(ClaimStatus.Accepted);
    await this.getSummaryOfStatus("NotAccepted");
    await this.getSummaryOfStatus('Batched');
    this.summaries.sort((a, b)=> b.totalClaims - a.totalClaims);
    if(this.summaries.length == 2) this.summaries[0] = this.summaries.pop();
    this.getResultsofStatus(0);
    if(!this.hasData && this.errorMessage == null) this.errorMessage = 'There is no claims for provider (' + this.providerId + ') from ' + this.from + ' to ' + this.to + ' associated with payer (' + this.payerId + ').';
  }

  async getSummaryOfStatus(status:string) {
    const event = await this.searchService.getSummaries(this.providerId, this.from, this.to, this.payerId, status).toPromise().catch(error =>{
      this.commen.loadingChanged.next(false);
      if(error instanceof HttpErrorResponse){
        this.errorMessage = error.error['message'];
      } 
      else this.errorMessage = 'Could not reach the server at the moment. Please try again later.';
    });
    if(event instanceof HttpResponse){
      if((event.status/100).toFixed()== "2"){
        const summary = new SearchStatusSummary(event.body);
        if(summary.totalClaims > 0)
          this.summaries.push(summary);
      } else if((event.status/100).toFixed()== "4"){
        this.errorMessage = 'Could not get the claims from the server.';
      } else if((event.status/100).toFixed()== "5"){
        this.errorMessage = 'Server could not handle the request. Please try again later.';
      } else {
        this.errorMessage = 'Somthing went wrong.';
      }
    }
    this.commen.loadingChanged.next(false);
  }

  getResultsofStatus(key:number, page?:number, pageSize?:number){
    if(this.summaries.length == 0) return;
    this.commen.loadingChanged.next(true);
    if(page==null && pageSize==null && this.paginator != null){
      this.paginator.pageIndex = 0;
      this.paginator.pageSize = 10;
      this.manualPage = null;
      this.paginator.showFirstLastButtons = true;
    }
    if(this.selectedCardKey!= null && key != this.selectedCardKey){
      this.selectedClaims = new Array();
      this.selectedClaimsCount = 0;
      this.setAllCheckBoxIsIndeterminate();
    }
    if(this.summaries[key].status == ClaimStatus.Accepted) this.detailActionText = 'Submit';
    else this.detailActionText = null;
    this.selectedCardKey = key;
    this.searchResult = null;
    this.claims = new Array();
    this.searchService.getResults(this.providerId, this.from, this.to, this.payerId, this.summaries[key].status, page, pageSize).subscribe((event)=>{
      if(event instanceof HttpResponse){
        if((event.status/100).toFixed()== "2"){
          this.searchResult = new SearchResultPaginator(event.body);
          this.claims = this.searchResult.content;
          this.selectedClaimsCount = 0;
          for(let claim of this.claims){
            if(this.selectedClaims.includes(claim.claimId)) this.selectedClaimsCount++;
          }
          this.setAllCheckBoxIsIndeterminate();
          this.detailAccentColor = this.commen.getCardAccentColor(this.summaries[key].status);
          this.detailCardTitle = this.summaries[key].status;
          const pages = Math.ceil((this.searchResult.totalElements/this.paginator.pageSize));
          this.paginatorPagesNumbers = Array(pages).fill(pages).map((x,i)=>i);
          this.manualPage = this.paginator.pageIndex;
        } else if((event.status/100).toFixed()== "4"){
          console.log("400");
        } else if((event.status/100).toFixed()== "5"){
          console.log("500");
        } else {
          console.log("000");
        }
      }
      this.commen.loadingChanged.next(false);
    }, error =>{
      this.commen.loadingChanged.next(false);
      console.log(error);
    });
  }

  submitSelectedClaims(){
    if(this.selectedClaims.length == 0){

      return;
    }
    this.commen.loadingChanged.next(true);
    this.submittionService.submitClaims(this.selectedClaims, this.providerId, this.payerId).subscribe((event)=>{
      if(event instanceof HttpResponse){
        if(event.body['queuedStatus'] == 'QUEUED'){
          this.commen.openDialog(new DialogData('Success', 'The selected claims were queued to be submitted.', false)).subscribe(result =>{
            this.fetchData();
          });
        }
        if(event['error'] != null){
          for(let error of event['error']['errors']){
            this.submittionErrors.set(error['claimID'], 'Code: ' + error['errorCode']+', Description: '+error['errorDescription']);
          }
        }
      }
      this.commen.loadingChanged.next(false);
      if(this.allCheckBoxIsIndeterminate){
        this.selectAll();
        this.selectAll();
      } else if(this.allCheckBoxIsChecked){
        this.selectAll();
      }
    }, errorEvent =>{
      if(errorEvent instanceof HttpErrorResponse){
        this.errorMessage = '';
        if(errorEvent.error['errors'] != null)
          for(let error of errorEvent.error['errors']){
            this.submittionErrors.set(error['claimID'], 'Code: ' + error['errorCode']+', Description: '+error['errorDescription']);
          }
      }
      if(this.allCheckBoxIsIndeterminate){
        this.selectAll();
        this.selectAll();
      } else if(this.allCheckBoxIsChecked){
        this.selectAll();
      }
      this.commen.loadingChanged.next(false);
      console.log(errorEvent);
    });
  }


  get hasData(){
    this.extraNumbers = new Array();
    this.extraCards = 6-this.summaries.length;
    if(this.extraCards < 0) this.extraCards = 0;
    for(let i = 0; i < this.extraCards; i++){
      this.extraNumbers.push(i);
    }
    return this.summaries.length > 0;
  }
  get loading(){
    return this.commen.loading;
  }

  
  
  get paginatorLength(){
    if(this.searchResult != null){
      return this.searchResult.totalElements;
    }
    else return 0;
  }
  

  paginatorAction(event){
    this.manualPage = event['pageIndex'];
    if(this.summaries[this.selectedCardKey] != null){
      this.getResultsofStatus(this.selectedCardKey, event['pageIndex'], event['pageSize']);
    }
  }
  updateManualPage(index) {
    this.manualPage = index;
    this.paginator.pageIndex = index;
    this.paginatorAction({previousPageIndex: this.paginator.pageIndex, pageIndex: index, pageSize: this.paginator.pageSize, length: this.paginator.length})
  }

  setAllCheckBoxIsIndeterminate(){
    if(this.claims != null)
      this.allCheckBoxIsIndeterminate = this.selectedClaimsCount != this.claims.length && this.selectedClaimsCount != 0;
    else this.allCheckBoxIsIndeterminate = false;
    this.setAllCheckBoxIsChecked();
  }
  setAllCheckBoxIsChecked(){
    if(this.claims != null)
      this.allCheckBoxIsChecked = this.selectedClaimsCount == this.claims.length;
    else this.allCheckBoxIsChecked = false;
  }
  selectClaim(claimId:string){
    if(!this.selectedClaims.includes(claimId)){
      this.selectedClaims.push(claimId);
      this.selectedClaimsCount++;
    } else {
      this.selectedClaims.splice(this.selectedClaims.indexOf(claimId), 1);
      this.selectedClaimsCount--;
    }
    this.setAllCheckBoxIsIndeterminate();
  }
  selectAll(){
    if(this.selectedClaimsCount != this.claims.length)
      for(let claim of this.claims){
        if(!this.selectedClaims.includes(claim.claimId))
          this.selectClaim(claim.claimId);
      }
    else{
      for(let claim of this.claims){
        this.selectClaim(claim.claimId);
      }
    }
  }

  get selectionCountText(){
    if(this.searchResult != null)
      return this.selectedClaims.length + ' of ' + this.searchResult.totalElements + ' are selected.';
    else return '0 of 0 are selected.';
  }


}

