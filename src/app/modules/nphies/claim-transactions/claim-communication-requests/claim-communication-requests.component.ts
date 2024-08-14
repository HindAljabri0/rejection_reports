import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { MatPaginator, MatDialogRef, MatDialog } from '@angular/material';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { CommunicationRequest } from 'src/app/models/communication-request';
import { SharedServices } from 'src/app/services/shared.services';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { SearchPageQueryParams } from 'src/app/models/searchPageQueryParams';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateClaimNphiesComponent } from '../../create-claim-nphies/create-claim-nphies.component';
import { ClaimTransactionService } from '../claim-transaction.service';

@Component({
  selector: 'app-claim-communication-requests',
  templateUrl: './claim-communication-requests.component.html',
  styleUrls: ['./claim-communication-requests.component.css']
})
export class ClaimCommunicationRequestsComponent implements OnInit {

  @Input() payersList: any;
  @Output() openDetailsDialogEvent = new EventEmitter<any>();

  @ViewChild('paginator', { static: false }) paginator: MatPaginator;

  paginatorPagesNumbers: number[];
  paginatorPageSizeOptions = [10, 20, 50, 100];
  manualPage = null;
  page: number;
  pageSize: number = 10;

  communicationRequestModel: PaginatedResult<CommunicationRequest>;
  communicationRequests = [];

  params: SearchPageQueryParams = new SearchPageQueryParams();
  claimDialogRef: MatDialogRef<any, any>;

  constructor(
    public dialog: MatDialog,
    public router: Router,
    public routeActive: ActivatedRoute,
    private sharedServices: SharedServices,
    private dialogService: DialogService,
    private claimTransactionService: ClaimTransactionService,
  ) { }

  ngOnInit() {
  }


  getCommunicationRequests() {
    this.sharedServices.loadingChanged.next(true);
    // tslint:disable-next-line:max-line-length
    this.claimTransactionService.getCommunicationRequests(this.sharedServices.providerId, this.page, this.pageSize).subscribe((event: any) => {
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
          this.dialogService.showMessage('Error', error.error.message, 'alert', true, 'OK', error.error.errors);
        } else if (error.status === 404) {
          this.dialogService.showMessage('Error', error.error.message ? error.error.message : error.error.error, 'alert', true, 'OK');
        } else if (error.status === 500) {
          this.dialogService.showMessage('Error', error.error.message, 'alert', true, 'OK');
        }
        this.sharedServices.loadingChanged.next(false);
      }
    });
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

  showClaim(claimId: string, uploadId: string, claimResponseId: string, notificationId: string, notificationStatus: string) {
    if (this.communicationRequests.filter(x => x.notificationId === notificationId)[0]) {
      this.communicationRequests.filter(x => x.notificationId === notificationId)[0].notificationStatus = 'read';
    }

    this.readNotification(notificationStatus, notificationId);

    this.params.claimId = claimId;
    this.params.uploadId = uploadId;
    this.params.claimResponseId = claimResponseId;
    this.resetURL(true);
    this.claimDialogRef = this.dialog.open(CreateClaimNphiesComponent, {
      panelClass: ['primary-dialog', 'full-screen-dialog'],
      autoFocus: false, data: { openCommunicationTab: true }
    });

    this.claimDialogRef.afterClosed().subscribe(result => {
      this.claimDialogRef = null;
      this.params.claimId = null;
      this.params.editMode = null;
      this.resetURL();
    });
  }

  readNotification(notificationStatus: string, notificationId: string) {
    if (notificationStatus === 'unread') {
      this.sharedServices.unReadClaimComunicationRequestCount = this.sharedServices.unReadClaimComunicationRequestCount - 1;
      if (notificationId) {
        this.sharedServices.markAsRead(notificationId, this.sharedServices.providerId);
      }
    }
  }

  readAllNotification() {
    this.communicationRequests.forEach(x => x.notificationStatus = 'read');
    this.sharedServices.unReadClaimComunicationRequestCount = 0;
    this.sharedServices.markAllAsRead(this.sharedServices.providerId, "claim-communication-request-notification");
  }

  resetURL(openCommunicationTab = false) {
    if (openCommunicationTab) {
      this.router.navigate([], {
        relativeTo: this.routeActive,
        queryParams: { ...this.params, editMode: null, size: null },
        fragment: 'CommunicationRequest'
      });
    } else {
      this.router.navigate([], {
        relativeTo: this.routeActive,
        queryParams: { ...this.params, editMode: null, size: null }
      });
    }
  }

  get paginatorLength() {
    if (this.communicationRequestModel != null) {
      return this.communicationRequestModel.totalElements;
    } else {
      return 0;
    }
  }

}
