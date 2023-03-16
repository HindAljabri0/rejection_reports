import { Component, OnInit } from '@angular/core';
import { EclaimsTicketManagementService } from 'src/app/services/eclaimsTicketManagementService/eclaims-ticket-management.service';
import { TicketSummaryResponse } from 'src/app/models/nphies/TicketSummaryResponse';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { PageEvent } from '@angular/material';
import { SharedServices } from 'src/app/services/shared.services';
import { FormControl } from '@angular/forms';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styles: []
})
export class TicketsComponent implements OnInit {

  ticketsSummary: TicketSummaryResponse[];
  queryString: string = '';
  status: string = '';
  ticketList: any;
  searchControl: FormControl = new FormControl();
  length = 100;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 50, 100];
  showFirstLastButtons = true;

  constructor(
    private sharedServices: SharedServices,
    private eclaimsTicketManagementService: EclaimsTicketManagementService,
    private dialogService: DialogService
  ) { }

  handlePageEvent(event: PageEvent) {
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    localStorage.setItem('pagesize', event.pageSize + '');
    this.fetchEclaimsTicket(this.queryString, this.status);
  }

  ngOnInit() {
    this.fetchEclaimsTicket(this.queryString, this.status);
  }

  fetchEclaimsTicket(queryString: string, status: string) {
    this.sharedServices.loadingChanged.next(true);
    this.eclaimsTicketManagementService.fetchEclaimsTicketSummary(this.sharedServices.providerId, queryString, status, this.pageIndex, this.pageSize).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body != null && event.body instanceof Array)
        this.ticketsSummary = [];
        this.ticketsSummary = event.body["content"] as TicketSummaryResponse[];
        this.length = event.body["totalElements"];
        console.log(this.ticketsSummary);
        this.sharedServices.loadingChanged.next(false);
      }
    }, error => {
      this.ticketsSummary = [];
      if (error instanceof HttpErrorResponse) {
        if (error.status >= 500 || error.status == 0) {
          if (error.error['message'] != null) {
            //this.dialogService.openMessageDialog(new MessageDialogData('', error.error['message'], true));
          } else {
            //this.dialogService.openMessageDialog(new MessageDialogData('', 'Could not reach the server. Please try again later.', true));
          }
        } else if (error.status === 400 || error.status === 404) {
          //this.dialogService.openMessageDialog(new MessageDialogData('', error.error['message'], true));
          // for (const error of error.error['errors']) {
          //   this.submittionErrors.set(error['claimID'], 'Code: ' + error['errorCode'] + ', Description: ' + error['errorDescription']);
          // }
        }
        if (error.error['message'] != null) {
          //this.dialogService.openMessageDialog(new MessageDialogData('', error.error['message'], true));
        }
      }
      this.sharedServices.loadingChanged.next(false);
    });
  }

  selectStatus(e) {
    this.status = e.value;
  }

  searchTicketBased() {
    this.fetchEclaimsTicket(this.queryString, this.status);
  }

  searchByQuery() {
    if (this.searchControl.value != null)
      this.queryString = this.searchControl.value;
    this.fetchEclaimsTicket(this.queryString, this.status);
  }

  clearStatusFilter() {
    this.status = '';
    this.fetchEclaimsTicket(this.queryString, this.status);
  }

  checkReloadedFilter() {
    this.reloadInputFilters();
  }

  reloadInputFilters() {
    if (this.status != null && this.status !== '' && this.status !== undefined) {
      this.setReloadedInputFilters('status', this.status);
    }
  }

  setReloadedInputFilters(name: string, value: string) {
    this.ticketList[name] = value;
  }
}
