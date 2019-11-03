import { Component, OnInit } from '@angular/core';
import {CommenServicesService} from '../commen-services.service';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { switchMap, filter } from 'rxjs/operators';
import { SearchServiceService, ClaimResultData } from './search-service.service';
import { HttpResponse } from '@angular/common/http';
import { ClaimStatus } from '../claimpage/claimfileuploadservice/upload.service';

@Component({
  selector: 'app-search-claims',
  templateUrl: './search-claims.component.html',
  styleUrls: ['./search-claims.component.css']
})
export class SearchClaimsComponent implements OnInit {

  constructor(private commen:CommenServicesService, private routeActive:ActivatedRoute, private router:Router, private searchService:SearchServiceService) {
  }

  cardsClickAble:boolean = true;

  detailCardTitle:string;
  detailAccentColor:string;

  providerId:string;
  from:string;
  to:string;
  payerId:string;
  
  claims:ClaimResultData[];
  summaries:Map<string, Summary> 
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
    this.summaries = new Map();
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
    this.searchService.getresults(this.providerId, this.from, this.to, this.payerId, 'all').subscribe((event)=>{
      if(event instanceof HttpResponse){
        if(event.status == 200){
          if(event.body instanceof Array){
            event.body.forEach(claim => {
              let newClaim = new ClaimResultData(claim)
              this.claims.push(newClaim);
              if(!this.summaries.has(newClaim.status)) this.summaries.set(newClaim.status, new Summary());
              this.summaries.get(newClaim.status).totalClaims++;
              this.summaries.get(newClaim.status).totalNetAmount += newClaim.netAmount;
              this.summaries.get(newClaim.status).totalVatNetAmount += newClaim.netVatAmount;
            });
          }
        }
      }
      console.log(this.claims);
      console.log(this.summaries);
      this.commen.loadingChanged.next(false);
    });
  }

  getCardAccentColor(status:string){
    switch(status){
      case ClaimStatus.Saved:
        return '#21B744';
      case ClaimStatus.Saved_With_Errors:
        return '#EB2A75';
      default:
        return '#E3A820';
    }
  }

  cardAction(status:string){
    this.detailAccentColor = this.getCardAccentColor(status);
    this.detailCardTitle = status;
  }

}

export class Summary {
  totalClaims:number = 0;
  totalNetAmount:number = 0;
  totalVatNetAmount:number = 0;
}