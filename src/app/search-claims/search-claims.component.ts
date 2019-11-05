import { Component, OnInit, ViewChild, } from '@angular/core';
import {CommenServicesService} from '../commen-services.service';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { switchMap, filter } from 'rxjs/operators';
import { SearchServiceService, ClaimResultContent, SearchStatusSummary, SearchResultPaginator } from './search-service.service';
import { HttpResponse } from '@angular/common/http';
import { ClaimStatus } from '../claimpage/claimfileuploadservice/upload.service';
import { MatPaginator } from '@angular/material';

@Component({
  selector: 'app-search-claims',
  templateUrl: './search-claims.component.html',
  styleUrls: ['./search-claims.component.css']
})
export class SearchClaimsComponent implements OnInit {

  constructor(private commen:CommenServicesService, private routeActive:ActivatedRoute, private router:Router, private searchService:SearchServiceService) {
  }
  placeholder = '-';
  cardsClickAble:boolean = true;
  extraCards = 3;
  extraNumbers:number[];

  detailCardTitle:string;
  detailAccentColor:string;

  providerId:string;
  from:string;
  to:string;
  payerId:string;
  
  claims:ClaimResultContent[];
  searchResult:SearchResultPaginator;
  summaries:SearchStatusSummary[];
  ngOnInit() {
    this.fetchData();
    this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.fetchData();
    });
  }

  fetchData(){
    this.claims = new Array();
    this.summaries = new Array();
    this.commen.loadingChanged.next(true);
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
    this.getSummaryOfStatus('All');
    this.getSummaryOfStatus('Accepted');
    this.getSummaryOfStatus('NotAccepted');
    this.getSummaryOfStatus('Batched');
  }

  getCardAccentColor(status:string){
    switch(status){
      case ClaimStatus.Saved:
        return '#21B744';
      case ClaimStatus.Saved_With_Errors:
        return '#EB2A75';
      case 'All':
        return '#3060AA'
      case '-':
        return '#bebebe';
      default:
        return '#E3A820';
    }
  }

  getSummaryOfStatus(status:string){
    this.searchService.getSummaries(this.providerId, this.from, this.to, this.payerId, status).subscribe((event)=>{
      if(event instanceof HttpResponse){
        if((event.status/100).toFixed()== "2"){
          const summary = new SearchStatusSummary(event.body);
          if(summary.totalClaims > 0)
            this.summaries.push(summary);
          this.summaries.sort((a, b)=> b.totalClaims - a.totalClaims);
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

  getResultsofStatus(key:number, page?:number, pageSize?:number){
    this.commen.loadingChanged.next(true);
    if(page==null && pageSize==null){
      this.paginator.pageIndex = 0;
      this.paginator.pageSize = 10;
    }
    this.selectedCardKey = key;
    this.searchResult = null;
    this.claims = new Array();
    this.searchService.getResults(this.providerId, this.from, this.to, this.payerId, this.summaries[key].status, page, pageSize).subscribe((event)=>{
      if(event instanceof HttpResponse){
        if((event.status/100).toFixed()== "2"){
          this.searchResult = new SearchResultPaginator(event.body);
          this.claims = this.searchResult.content;
          this.detailAccentColor = this.getCardAccentColor(this.summaries[key].status);
          this.detailCardTitle = this.summaries[key].status;
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

  @ViewChild('paginator', {static:false}) paginator: MatPaginator;
  selectedCardKey:number;

  manualPage = null;
  numbers:number[];
  get paginatorLength(){
    if(this.searchResult != null){
      let pages = Math.ceil((this.searchResult.totalElements/this.paginator.pageSize));
      this.numbers = Array(pages).fill(pages).map((x,i)=>i);
      return this.searchResult.totalElements;
    }
    else return 0;
  }
  paginatorPageSizeOptions = [10,20, 50, 100];

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

}

