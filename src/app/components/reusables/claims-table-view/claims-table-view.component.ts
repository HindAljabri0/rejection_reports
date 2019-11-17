import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { SearchedClaim } from 'src/app/models/searchedClaim';
import { MatPaginator } from '@angular/material';

@Component({
  selector: 'app-claims-table-view',
  templateUrl: './claims-table-view.component.html',
  styleUrls: ['./claims-table-view.component.css']
})
export class ClaimsTableViewComponent implements OnInit {

  @Input() searchResult:PaginatedResult<SearchedClaim>;
  
  selectedClaims:string[] = new Array();
  selectedClaimsCountOfPage:number = 0;
  allCheckBoxIsIndeterminate:boolean;
  allCheckBoxIsChecked:boolean;

  paginatorPagesNumbers:number[];
  @ViewChild('paginator', {static:false}) paginator: MatPaginator;
  paginatorPageSizeOptions = [10,20, 50, 100];
  manualPage = null;

  submittionErrors:Map<string,string>;

  @Output() paginatorAction = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  get claims():SearchedClaim[]{
    return this.searchResult.content;
  }

  setAllCheckBoxIsIndeterminate(){
    if(this.claims != null)
      this.allCheckBoxIsIndeterminate = this.selectedClaimsCountOfPage != this.claims.length && this.selectedClaimsCountOfPage != 0;
    else this.allCheckBoxIsIndeterminate = false;
    this.setAllCheckBoxIsChecked();
  }
  setAllCheckBoxIsChecked(){
    if(this.claims != null)
      this.allCheckBoxIsChecked = this.selectedClaimsCountOfPage == this.claims.length;
    else this.allCheckBoxIsChecked = false;
  }
  selectClaim(claimId:string){
    if(!this.selectedClaims.includes(claimId)){
      this.selectedClaims.push(claimId);
      this.selectedClaimsCountOfPage++;
    } else {
      this.selectedClaims.splice(this.selectedClaims.indexOf(claimId), 1);
      this.selectedClaimsCountOfPage--;
    }
    this.setAllCheckBoxIsIndeterminate();
  }
  selectAllinPage(){
    if(this.selectedClaimsCountOfPage != this.claims.length)
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
  deSelectAll(){
    if(this.allCheckBoxIsIndeterminate){
      this.selectAllinPage();
      this.selectAllinPage();
    } else if(this.allCheckBoxIsChecked){
      this.selectAllinPage();
    }
  }

  
  updateManualPage(index) {
    this.manualPage = index;
    this.paginator.pageIndex = index;
    this.paginatorAction.emit({previousPageIndex: this.paginator.pageIndex, pageIndex: index, pageSize: this.paginator.pageSize, length: this.paginator.length})
  }

  get paginatorLength(){
    if(this.searchResult != null){
      return this.searchResult.totalElements;
    }
    else return 0;
  }

}
