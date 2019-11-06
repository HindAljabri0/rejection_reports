import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommenServicesService {
  loading:boolean = false;
  loadingChanged:Subject<boolean> = new Subject<boolean>();

  searchIsOpen:boolean = false;
  searchIsOpenChange:Subject<boolean> = new Subject<boolean>();
  
  constructor() {
    this.loadingChanged.subscribe((value)=>{
      this.loading = value;
    });
    this.searchIsOpenChange.subscribe(value =>{
      this.searchIsOpen = value;
    });
  }

  
}
