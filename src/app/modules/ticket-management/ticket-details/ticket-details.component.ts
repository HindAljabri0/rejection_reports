import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EclaimsTicketManagementService } from 'src/app/services/eclaimsTicketManagementService/eclaims-ticket-management.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styles: []
})
export class TicketDetailsComponent implements OnInit {

  ticketId: string;
  ticket: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private sharedServices: SharedServices,
    private eclaimsTicketManagementService: EclaimsTicketManagementService
  ) { }

  ngOnInit() {
    this.ticketId = this.activatedRoute.snapshot.paramMap.get('ticketId');
    this.getTicketDetails(this.ticketId);
  }

  getTicketDetails(ticketId: string) {
    this.eclaimsTicketManagementService.fetchEclaimsTicketDetails(this.sharedServices.providerId, ticketId).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body != null && event.body instanceof Array)
          this.ticket = event.body;
      }
    });
  }

  isNull(value: string) {
    return value == null ? '_' : value;
  }
}
