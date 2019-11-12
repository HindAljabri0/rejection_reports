import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { MatDialog } from '@angular/material';
import { MessageDialogComponent, DialogData } from './dialogs/message-dialog/message-dialog.component';
import { ClaimStatus } from './claimpage/claimfileuploadservice/upload.service';

@Injectable({
  providedIn: 'root'
})
export class CommenServicesService {
  loading:boolean = false;
  loadingChanged:Subject<boolean> = new Subject<boolean>();

  searchIsOpen:boolean = false;
  searchIsOpenChange:Subject<boolean> = new Subject<boolean>();
  
  constructor(public dialog:MatDialog) {
    this.loadingChanged.subscribe((value)=>{
      this.loading = value;
    });
    this.searchIsOpenChange.subscribe(value =>{
      this.searchIsOpen = value;
    });
  }

  openDialog(dialogData:DialogData):Observable<any>{
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '35%',
      height: '17%',
      panelClass: dialogData.isError? 'dialogError':'dialogSuccess',
      data: dialogData,
    });
    return dialogRef.afterClosed();
  }

  getCardAccentColor(status:string){
    switch(status){
      case ClaimStatus.Accepted:
        return '#21B744';
      case ClaimStatus.Not_Accepted:
        return '#EB2A75';
      case 'All':
        return '#3060AA'
      case '-':
        return '#bebebe';
      case 'Batched':
        return '#21b590';
      case 'INVALID':
        return '#E988AD';
      case 'Failed':
        return '#bf1958';
      default:
        return '#E3A820';
    }
  }

  
}
