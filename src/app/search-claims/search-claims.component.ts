import { Component, OnInit } from '@angular/core';
import {CommenServicesService} from '../commen-services.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-search-claims',
  templateUrl: './search-claims.component.html',
  styleUrls: ['./search-claims.component.css']
})
export class SearchClaimsComponent implements OnInit {

  constructor(private commen:CommenServicesService, private routeActive:ActivatedRoute, private router:Router) { }
  providerId:string;
  from:string;
  to:string;
  payerId:string;
  ngOnInit() {
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
  }

}
