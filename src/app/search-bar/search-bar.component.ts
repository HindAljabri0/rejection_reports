import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  dateFrom = new FormControl();
  dateTo = new FormControl();
  payer = new FormControl();
  constructor(private router:Router) {
    
  }

  ngOnInit() {
  }

  search(){
    let providerId = '00';
    if(this.dateFrom.valid && this.dateTo.valid && this.payer.valid){
      const from = this.dateFrom.value.getFullYear() + '-' + (this.dateFrom.value.getMonth()+1) + '-' + this.dateFrom.value.getDate();
      const to = this.dateTo.value.getFullYear() + '-' + (this.dateTo.value.getMonth()+1) + '-' + this.dateTo.value.getDate();
      this.router.navigate([providerId,'claims'], {queryParams:{from:from, to:to, payer: this.payer.value}});
    }
  }
}
