import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateTicketComponent } from './create-ticket/create-ticket.component';
import { TicketDetailsComponent } from './ticket-details/ticket-details.component';
import { TicketsComponent } from './tickets/tickets.component';

const routes: Routes = [
  { path: '', redirectTo: 'tickets' },
  { path: 'tickets', component: TicketsComponent },
  { path: 'create', component: CreateTicketComponent },
  { path: 'tickets/details/:ticketId', component: TicketDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketManagementRoutingModule { }
