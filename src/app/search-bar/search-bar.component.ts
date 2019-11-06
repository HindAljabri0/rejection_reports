import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl, NgModel} from '@angular/forms';
import { Router, ActivatedRoute, ParamMap, RouterEvent, NavigationEnd } from '@angular/router';
import { CommenServicesService } from '../commen-services.service';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})

export class SearchBarComponent implements OnInit {


  dateFrom = new FormControl();
  dateTo = new FormControl();
  payer = new FormControl();
  constructor(private routeActive:ActivatedRoute, private router:Router, private commen:CommenServicesService) {
    
  }

  ngOnInit() {
    this.payer.setValue(0);
    this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.routeActive.queryParams.subscribe(value => {
        if(value.from!=null) {
          const str = value.from.split('-');
          const date = new Date(str[1]+'/'+str[0]+'/'+str[2]);
          this.dateFrom = new FormControl(date);
        }
        if(value.to!=null){
          const str = value.to.split('-');
          const date = new Date(str[1]+'/'+str[0]+'/'+str[2]);
          this.dateTo = new FormControl(date);
        }
        if(value.payer!=null) this.payer.setValue(value.payer);
      });
    });
  }

  expand(){
    this.commen.searchIsOpenChange.next(true);
  }

  search(){
    let providerId = '104';
    if(this.dateFrom.valid && this.dateTo.valid && this.payer.valid){
      const from = this.dateFrom.value.getDate() + '-' + (this.dateFrom.value.getMonth()+1) + '-' + this.dateFrom.value.getFullYear();
      const to = this.dateTo.value.getDate() + '-' + (this.dateTo.value.getMonth()+1) + '-' + this.dateTo.value.getFullYear();
      
      this.router.navigate([providerId,'claims'], {queryParams:{from:from, to:to, payer: this.payer.value}});
    }
  }

  get expandedForClaimSearch(){
    return this.commen.searchIsOpen;
  }
}
