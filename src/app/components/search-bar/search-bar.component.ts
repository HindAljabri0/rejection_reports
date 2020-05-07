import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {FormControl, NgModel} from '@angular/forms';
import { Router, ActivatedRoute, ParamMap, RouterEvent, NavigationEnd } from '@angular/router';
import { SharedServices } from '../../services/shared.services';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})

export class SearchBarComponent implements OnInit {


  @ViewChild('fromDate', {static:false}) fromDate: ElementRef;
  dateFrom = new FormControl();
  dateTo = new FormControl();
  payer = new FormControl();
  constructor(private routeActive:ActivatedRoute, private router:Router, private commen:SharedServices) {
    
  }

  placeHolderClasses:string = '';
  searchFormClasses:string = '';

  dateFromClasses:string = '';
  dateToClasses:string = '';
  payerClasses:string = '';

  

  ngOnInit() {
    this.payer.setValue(0);
    this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.routeActive.queryParams.subscribe(value => {
        if(value.from!=null) {
          const str = value.from.split('-');
          const date = new Date(str[0]+'/'+str[1]+'/'+str[2]);
          this.dateFrom = new FormControl(date);
          this.expand();
        }
        if(value.to!=null){
          const str = value.to.split('-');
          const date = new Date(str[0]+'/'+str[1]+'/'+str[2]);
          this.dateTo = new FormControl(date);
        }
        if(value.payer!=null) this.payer.setValue(value.payer);
      });
    });
  }

  expand(){
    this.placeHolderClasses = 'hidden';
    this.searchFormClasses = 'visible';
    setTimeout(()=>{
      this.fromDate.nativeElement.focus();
    },0);
  }

  search(){
    this.dateFromClasses = '';
    this.dateToClasses = '';
    this.payerClasses = '';
    if(this.dateFrom.valid && this.dateTo.valid && (this.payer.valid && this.payer.value != 0)){
      let fromDate = new Date(this.dateFrom.value);
      let toDate = new Date(this.dateTo.value);
      if(fromDate.getTime() > toDate.getTime()){
        let tempDate = fromDate;
        fromDate = toDate;
        toDate = tempDate;
      }
      const from = fromDate.getFullYear() + '-' + (fromDate.getMonth()+1) + '-' + fromDate.getDate();
      const to = toDate.getFullYear() + '-' + (toDate.getMonth()+1) + '-' + toDate.getDate();
      this.router.navigate([this.commen.providerId,'claims'], {queryParams:{from:from, to:to, payer: this.payer.value}});
    } else if(!this.dateFrom.valid){
      this.dateFromClasses = 'error';
    } else if(!this.dateTo.valid){
      this.dateToClasses = 'error';
    } else if(!this.payer.valid || this.payer.value == 0){
      this.payerClasses = 'error';
    }
  }

  get expandedForClaimSearch(){
    return this.commen.searchIsOpen;
  }
}
