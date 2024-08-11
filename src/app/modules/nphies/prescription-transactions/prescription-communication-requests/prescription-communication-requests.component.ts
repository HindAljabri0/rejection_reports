import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { CommunicationRequest } from 'src/app/models/communication-request';
import { MatPaginator } from '@angular/material';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { SharedServices } from 'src/app/services/shared.services';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';

@Component({
  selector: 'app-prescription-communication-requests',
  templateUrl: './prescription-communication-requests.component.html',
  styles: []
})
export class PrescriptionCommunicationRequestsComponent implements OnInit {

  @Input() payersList: any;
  @Output() openDetailsDialogEvent = new EventEmitter<any>();

  @ViewChild('paginator', { static: false }) paginator: MatPaginator;

  paginatorPagesNumbers: number[];
  paginatorPageSizeOptions = [10, 20, 50, 100];
  manualPage = null;
  page: number;
  pageSize: number;

  communicationRequestModel: PaginatedResult<CommunicationRequest>;
  communicationRequests = [];

  constructor(
    private sharedServices: SharedServices,
    private dialogService: DialogService,
    private providerNphiesSearchService: ProviderNphiesSearchService,
  ) { }

  ngOnInit() {
  }

  getCommunicationRequests() {
    this.sharedServices.loadingChanged.next(true);
    // tslint:disable-next-line:max-line-length
    this.providerNphiesSearchService.getPrescriptionCommunicationRequests(this.sharedServices.providerId).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          const body: any = event.body;
          this.communicationRequestModel = new PaginatedResult(body, CommunicationRequest);
          this.communicationRequests = this.communicationRequestModel.content;
          this.communicationRequests.forEach(x => {
            // tslint:disable-next-line:max-line-length
            x.payerName = this.payersList.find(y => y.nphiesId === x.payerNphiesId) ? this.payersList.filter(y => y.nphiesId === x.payerNphiesId)[0].englistName : '';
          });
          if (this.paginator) {
            const pages = Math.ceil((this.communicationRequestModel.totalElements / this.paginator.pageSize));
            this.paginatorPagesNumbers = Array(pages).fill(pages).map((x, i) => i);
            this.manualPage = this.communicationRequestModel.number;
            this.paginator.pageIndex = this.communicationRequestModel.number;
            this.paginator.pageSize = this.communicationRequestModel.size;
          }
        }
        this.sharedServices.loadingChanged.next(false);
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          this.dialogService.showMessage('Error', error.error, 'alert', true, 'OK', error.error.errors);
        } else if (error.status === 404) {
          this.dialogService.showMessage('Error', error.error, 'alert', true, 'OK');
        } else if (error.status === 500) {
          this.dialogService.showMessage('Error', error.error.message, 'alert', true, 'OK');
        }
        this.sharedServices.loadingChanged.next(false);
      }
    });
  }

  readAllNotification() {
    this.communicationRequests.forEach(x=>x.notificationStatus = 'read');
    this.sharedServices.unReadPrescriberCommunicationRequestTotalCount = 0;
    this.sharedServices.markAllAsRead(this.sharedServices.providerId, "prescriber-communication-request-notification");
  }

  updateManualPage(index) {
    this.manualPage = index;
    this.paginator.pageIndex = index;
    this.paginatorAction({
      previousPageIndex: this.paginator.pageIndex,
      pageIndex: index,
      pageSize: this.paginator.pageSize,
      length: this.paginator.length
    });
  }

  paginatorAction(event) {
    this.manualPage = event.pageIndex;
    this.paginationChange(event);
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getCommunicationRequests();
  }

  paginationChange(event) {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  openDetailsDialog(requestId, communicationId, notificationId, notificationStatus) {
    if (this.communicationRequests.filter(x => x.notificationId === notificationId)[0]) {
      this.communicationRequests.filter(x => x.notificationId === notificationId)[0].notificationStatus = 'read';
    }
    this.openDetailsDialogEvent.emit({ 'requestId': requestId, 'communicationId': communicationId, 'notificationId': notificationId, 'notificationStatus': notificationStatus });
  }

  get paginatorLength() {
    if (this.communicationRequestModel != null) {
      return this.communicationRequestModel.totalElements;
    } else {
      return 0;
    }
  }
}
