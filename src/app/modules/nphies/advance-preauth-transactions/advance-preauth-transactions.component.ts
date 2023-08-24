import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatDialogConfig } from '@angular/material';
import { ViewPreauthorizationDetailsComponent } from '../view-preauthorization-details/view-preauthorization-details.component';
import { ProcessedTransactionsComponent } from '../preauthorization-transactions/processed-transactions/processed-transactions.component';
import { ReuseApprovalModalComponent } from '../preauthorization-transactions/reuse-approval-modal/reuse-approval-modal.component';
import { ConfirmationAlertDialogComponent } from 'src/app/components/confirmation-alert-dialog/confirmation-alert-dialog.component';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Location, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { SharedServices } from 'src/app/services/shared.services';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { ProviderNphiesApprovalService } from 'src/app/services/providerNphiesApprovalService/provider-nphies-approval.service';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';
import { PreAuthorizationTransaction } from 'src/app/models/pre-authorization-transaction';
import { HttpErrorResponse, HttpResponse, HttpEvent } from '@angular/common/http';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { BeneficiariesSearchResult } from 'src/app/models/nphies/beneficiaryFullTextSearchResult';
import { CancelReasonModalComponent } from '../preauthorization-transactions/cancel-reason-modal/cancel-reason-modal.component';
import { ApaCommunicationRequestsComponent } from './apa-communication-requests/apa-communication-requests.component';
@Component({
  selector: 'app-advance-preauth-transactions',
  templateUrl: './advance-preauth-transactions.component.html',
  styles: []
})
export class AdvancePreauthTransactionsComponent implements OnInit {

  page: number;
  pageSize: number;

  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  @ViewChild('processedTransactions', { static: false }) processedTransactions: ProcessedTransactionsComponent;
  @ViewChild('communicationRequests', { static: false }) communicationRequests: ApaCommunicationRequestsComponent;
  paginatorPagesNumbers: number[];
  paginatorPageSizeOptions = [10, 20, 50, 100];
  manualPage = null;
  communicationCount:number;
  communicationsRequestCount:number;
  payersList = [];
  isSubmitted = false;
  detailTopActionIcon = 'ic-download.svg';
  transactionModel: PaginatedResult<PreAuthorizationTransaction>;
  typeList = this.sharedDataService.claimTypeList;
  beneficiariesSearchResult: BeneficiariesSearchResult[] = [];
  selectedBeneficiary: BeneficiariesSearchResult;
  transactions = [];
  FormAdvancePreAuthTransaction: FormGroup = this.formBuilder.group({
    fromDate: [''],
    toDate: [''],
    payerId: [''],
    nphiesRequestId: [''],
    beneficiaryId: [''],
    beneficiaryName: [''],
    documentId: [''],
    status: [''],
    preAuthRefNo: [''],
    provClaimNo: [''],
    destinationId: [''],
    type: [''],
    ResponseBundleId: ['']
  });

  statusList = [
    { value: 'queued', name: 'Queued' },
    // { value: 'Processing Complete', name: 'Processing Complete' },
    { value: 'error', name: 'Error' },
    // { value: 'Partial Processing', name: 'Partial Processing' },
    { value: 'approved', name: 'Approved' },
    { value: 'rejected', name: 'Rejected' },
    { value: 'partial', name: 'Partially Approved' },
    { value: 'not-required', name: 'Not Required' },
    { value: 'pended', name: 'Pended' },
    { value: 'cancelled', name: 'Cancelled' }
  ];
  data: any;

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private routeActive: ActivatedRoute,
    public sharedServices: SharedServices,
    private beneficiaryService: ProvidersBeneficiariesService,
    private providerNphiesApprovalService: ProviderNphiesApprovalService,
    private sharedDataService: SharedDataService,
    private location: Location,
    private providerNphiesSearchService: ProviderNphiesSearchService,
    private dialog: MatDialog,
    private dialogService: DialogService) { }

  ngOnInit() {
    this.FormAdvancePreAuthTransaction.controls.fromDate.setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
    this.FormAdvancePreAuthTransaction.controls.toDate.setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
    this.routeActive.queryParams.subscribe(params => {



      if (params.fromDate != null) {
        const d1 = moment(moment(params.fromDate, 'DD-MM-YYYY')).format('YYYY-MM-DD');
        this.FormAdvancePreAuthTransaction.controls.fromDate.patchValue(this.datePipe.transform(d1, 'yyyy-MM-dd'));
      }

      if (params.toDate != null) {
        const d2 = moment(moment(params.toDate, 'DD-MM-YYYY')).format('YYYY-MM-DD');
        this.FormAdvancePreAuthTransaction.controls.toDate.patchValue(this.datePipe.transform(d2, 'yyyy-MM-dd'));
      }

      if (params.payerId != null) {
        // tslint:disable-next-line:radix
        this.FormAdvancePreAuthTransaction.controls.payerId.patchValue(params.payerId);
      }

      if (params.destinationId != null) {
        // tslint:disable-next-line:radix
        this.FormAdvancePreAuthTransaction.controls.destinationId.patchValue(params.destinationId);
      }

      if (params.nphiesRequestId != null) {
        // tslint:disable-next-line:radix
        this.FormAdvancePreAuthTransaction.controls.nphiesRequestId.patchValue(params.nphiesRequestId);
      }

      if (params.beneficiaryId != null) {
        // tslint:disable-next-line:radix
        this.FormAdvancePreAuthTransaction.controls.beneficiaryId.patchValue(parseInt(params.beneficiaryId));
      }

      if (params.documentId != null) {
        // tslint:disable-next-line:radix
        this.FormAdvancePreAuthTransaction.controls.documentId.patchValue(params.documentId);
      }

      if (params.beneficiaryName != null) {
        this.FormAdvancePreAuthTransaction.controls.beneficiaryName.patchValue(params.beneficiaryName);
      }

      if (params.status != null) {
        this.FormAdvancePreAuthTransaction.controls.status.patchValue(params.status);
      }

      if (params.type != null) {
        this.FormAdvancePreAuthTransaction.controls.type.patchValue(params.type);
      }

      if (params.preAuthRefNo != null) {
        // const preAuthValue = params.preAuthRefNo.split(',').map(x => {
        //   const model: any = {};
        //   model.display = x.trim();
        //   model.value = x.trim();
        //   return model;
        // });
        this.FormAdvancePreAuthTransaction.controls.preAuthRefNo.patchValue(params.preAuthRefNo);
      }
      if (params.provClaimNo != null) {
        this.FormAdvancePreAuthTransaction.controls.provClaimNo.patchValue(params.provClaimNo);
      }

           if (params.page != null) {
        this.page = Number.parseInt(params.page, 10);
      } else {
        this.page = 0;
      }

      if (params.pageSize != null) {
        this.pageSize = Number.parseInt(params.pageSize, 10);
      } else {
        this.pageSize = 10;
      }

      this.getPayerList(true);

    });
  }

  getPayerList(isFromUrl: boolean = false) {
    this.sharedServices.loadingChanged.next(true);
    this.beneficiaryService.getPayers().subscribe(event => {
      if (event instanceof HttpResponse) {
        const body = event.body;
        if (body instanceof Array) {
          this.payersList = body;
          if (isFromUrl) {
            if (this.FormAdvancePreAuthTransaction.valid) {
              this.onSubmit();
            }
          } else {
            this.sharedServices.loadingChanged.next(false);
          }
        }
      }
    }, errorEvent => {
      this.sharedServices.loadingChanged.next(false);
      if (errorEvent instanceof HttpErrorResponse) {

      }
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.FormAdvancePreAuthTransaction.valid) {
      this.sharedServices.loadingChanged.next(true);

      const model: any = {};
      model.fromDate = this.datePipe.transform(this.FormAdvancePreAuthTransaction.controls.fromDate.value, 'yyyy-MM-dd');
      model.toDate = this.datePipe.transform(this.FormAdvancePreAuthTransaction.controls.toDate.value, 'yyyy-MM-dd');

      if (this.FormAdvancePreAuthTransaction.controls.nphiesRequestId.value) {
        model.nphiesRequestId = this.FormAdvancePreAuthTransaction.controls.nphiesRequestId.value;
      }

      if (this.FormAdvancePreAuthTransaction.controls.payerId.value) {
        model.payerId = this.FormAdvancePreAuthTransaction.controls.payerId.value;
      }

      if (this.FormAdvancePreAuthTransaction.controls.destinationId.value) {
        model.destinationId = this.FormAdvancePreAuthTransaction.controls.destinationId.value;
      }

      // tslint:disable-next-line:max-line-length
      if (this.FormAdvancePreAuthTransaction.controls.beneficiaryName.value && this.FormAdvancePreAuthTransaction.controls.beneficiaryId.value && this.FormAdvancePreAuthTransaction.controls.documentId.value) {
        model.documentId =this.FormAdvancePreAuthTransaction.controls.documentId.value+"";
      }

      if (this.FormAdvancePreAuthTransaction.controls.status.value) {
        model.status = this.FormAdvancePreAuthTransaction.controls.status.value;
      }

      if (this.FormAdvancePreAuthTransaction.controls.preAuthRefNo.value) {
        model.preAuthRefNo = this.FormAdvancePreAuthTransaction.controls.preAuthRefNo.value;
        // model.preAuthRefNo = this.FormAdvancePreAuthTransaction.controls.preAuthRefNo.value.map(x => {
        //   return x.value;
        // });
      }

      if (this.FormAdvancePreAuthTransaction.controls.provClaimNo.value) {
        model.provClaimNo = this.FormAdvancePreAuthTransaction.controls.provClaimNo.value;
      }

      if (this.FormAdvancePreAuthTransaction.controls.type.value) {
        model.type = this.FormAdvancePreAuthTransaction.controls.type.value;
      }
      if (this.FormAdvancePreAuthTransaction.controls.ResponseBundleId.value) {
        model.responseBundleId = this.FormAdvancePreAuthTransaction.controls.ResponseBundleId.value;
      }


      model.page = this.page;
      model.pageSize = this.pageSize;

      this.editURL(model.fromDate, model.toDate);
      this.detailTopActionIcon = 'ic-download.svg';
      this.providerNphiesApprovalService.getAdvanceApprovalRequestTransactions(this.sharedServices.providerId, model).subscribe((event: any) => {
        if (event instanceof HttpResponse) {
          const body = event.body;
          // this.transactions = body;
          this.transactionModel = new PaginatedResult(body, PreAuthorizationTransaction);
          this.transactions = this.transactionModel.content;
          
          this.transactions.forEach(x => {
            // tslint:disable-next-line:max-line-length
            x.payerName = this.payersList.find(y => y.nphiesId === x.payerId) ? this.payersList.filter(y => y.nphiesId === x.payerId)[0].englistName : '';
            x.claimType = this.typeList.find(y => y.value === x.claimType) ? this.typeList.filter(y => y.value === x.claimType)[0].name : '';
          });
          if (this.paginator) {
            const pages = Math.ceil((this.transactionModel.totalElements / this.paginator.pageSize));
            this.paginatorPagesNumbers = Array(pages).fill(pages).map((x, i) => i);
            this.manualPage = this.transactionModel.number;
            this.paginator.pageIndex = this.transactionModel.number;
            this.paginator.pageSize = this.transactionModel.size;
          }
          this.sharedServices.loadingChanged.next(false);
        }
      }, err => {
        this.sharedServices.loadingChanged.next(false);
        console.log(err);
      });

    }
  }

  editURL(fromDate?: string, toDate?: string) {
    let path = '/nphies/advance-preauth-transactions?';

    if (this.FormAdvancePreAuthTransaction.controls.fromDate.value) {
      path += `fromDate=${this.datePipe.transform(this.FormAdvancePreAuthTransaction.controls.fromDate.value, 'dd-MM-yyyy')}&`;
    }

    if (this.FormAdvancePreAuthTransaction.controls.toDate.value) {
      path += `toDate=${this.datePipe.transform(this.FormAdvancePreAuthTransaction.controls.toDate.value, 'dd-MM-yyyy')}&`;
    }

    if (this.FormAdvancePreAuthTransaction.controls.payerId.value) {
      path += `payerId=${this.FormAdvancePreAuthTransaction.controls.payerId.value}&`;
    }

    if (this.FormAdvancePreAuthTransaction.controls.destinationId.value) {
      path += `destinationId=${this.FormAdvancePreAuthTransaction.controls.destinationId.value}&`;
    }

    if (this.FormAdvancePreAuthTransaction.controls.nphiesRequestId.value) {
      path += `nphiesRequestId=${this.FormAdvancePreAuthTransaction.controls.nphiesRequestId.value}&`;
    }

    // tslint:disable-next-line:max-line-length
    if (this.FormAdvancePreAuthTransaction.controls.beneficiaryName.value && this.FormAdvancePreAuthTransaction.controls.beneficiaryId.value && this.FormAdvancePreAuthTransaction.controls.documentId.value) {
      path += `beneficiaryId=${this.FormAdvancePreAuthTransaction.controls.beneficiaryId.value}&`;
      path += `beneficiaryName=${this.FormAdvancePreAuthTransaction.controls.beneficiaryName.value}&`;
      path += `documentId=${this.FormAdvancePreAuthTransaction.controls.documentId.value}&`;
    }

    if (this.FormAdvancePreAuthTransaction.controls.status.value) {
      path += `status=${this.FormAdvancePreAuthTransaction.controls.status.value}&`;
    }

    if (this.FormAdvancePreAuthTransaction.controls.preAuthRefNo.value) {
      path += `preAuthRefNo=${this.FormAdvancePreAuthTransaction.controls.preAuthRefNo.value}&`;
    }

    if (this.page > 0) {
      path += `page=${this.page}&`;
    }
    if (this.pageSize > 10) {
      path += `pageSize=${this.pageSize}`;
    }
    if (path.endsWith('?') || path.endsWith('&')) {
      path = path.substr(0, path.length - 1);
    }
    this.location.go(path);
  }

  selectPayer(event) {
    this.FormAdvancePreAuthTransaction.patchValue({
      payerId: event.value.payerNphiesId,
      destinationId: event.value.organizationNphiesId != '-1' ? event.value.organizationNphiesId : null
    });
  }

  searchBeneficiaries() {
    // tslint:disable-next-line:max-line-length
    if (this.FormAdvancePreAuthTransaction.controls.beneficiaryName.value.length > 3) {
      this.providerNphiesSearchService.beneficiaryFullTextSearch(this.sharedServices.providerId, this.FormAdvancePreAuthTransaction.controls.beneficiaryName.value).subscribe(event => {
        if (event instanceof HttpResponse) {
          const body = event.body;
          if (body instanceof Array) {
            this.beneficiariesSearchResult = body;
          }
        }
      }, errorEvent => {
        if (errorEvent instanceof HttpErrorResponse) {

        }
      });
    }
  }

  selectBeneficiary(beneficiary: BeneficiariesSearchResult) {
    this.selectedBeneficiary = beneficiary;
    this.FormAdvancePreAuthTransaction.patchValue({
      beneficiaryName: beneficiary.name + ' (' + beneficiary.documentId + ')',
      beneficiaryId: beneficiary.id,
      documentId: beneficiary.documentId +""
    });
  }
  openDetailsDialog(requestId, responseId) {
    this.getTransactionDetails(requestId, responseId, null, null, null);
  }

  getTransactionDetails(requestId, responseId, communicationId = null, notificationId, notificationStatus) {
    this.sharedServices.loadingChanged.next(true);

    let action: any;

    if (communicationId) {
      action = this.providerNphiesApprovalService.getTransactionDetailsFromCR(this.sharedServices.providerId, requestId, communicationId);
    } else {
      action = this.providerNphiesApprovalService.getTransactionDetails(this.sharedServices.providerId, requestId, responseId);
    }
    // tslint:disable-next-line:max-line-length
    action.subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          const body: any = event.body;
          // console.log("REsponse = " + JSON.stringify(body));
          if (communicationId) {
            body.communicationId = communicationId;
          }
          if (notificationId) {
            body.notificationId = notificationId;
          }
          if (notificationStatus) {
            body.notificationStatus = notificationStatus;
          }

          const dialogConfig = new MatDialogConfig();
          dialogConfig.panelClass = ['primary-dialog', 'full-screen-dialog','view-preauth-details'];
          dialogConfig.data = {
            // tslint:disable-next-line:max-line-length
            detailsModel: body
          };

          const dialogRef = this.dialog.open(ViewPreauthorizationDetailsComponent, dialogConfig);
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              if (result.openReUse) {
                this.OpenReuseApprovalModal(requestId, responseId);
              } else {
                if (!communicationId && notificationId) {
                  this.processedTransactions.getProcessedTransactions();
                } else if (communicationId && notificationId) {
                  this.communicationRequests.getCommunicationRequests();
                }
              }

            }
          }, error => { });
        }
        this.sharedServices.loadingChanged.next(false);
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          if (error.error && error.error.errors) {
            // tslint:disable-next-line:max-line-length
            this.showMessage('Error', (error.error && error.error.message) ? error.error.message : ((error.error && !error.error.message) ? error.error : (error.error ? error.error : error.message)), 'alert', true, 'OK', error.error.errors);
          } else {
            // tslint:disable-next-line:max-line-length
            this.showMessage('Error', (error.error && error.error.message) ? error.error.message : ((error.error && !error.error.message) ? error.error : (error.error ? error.error : error.message)), 'alert', true, 'OK');
          }
        } else if (error.status === 404) {
          this.showMessage('Error', error.error.message ? error.error.message : error.error.error, 'alert', true, 'OK');
        } else if (error.status === 500) {
          this.showMessage('Error', error.error.message, 'alert', true, 'OK');
        }
        this.sharedServices.loadingChanged.next(false);
      }
    });
  }

  readNotification() {
    if (this.data.notificationStatus === 'unread') {
      const notificationId: string = this.data.notificationId;
      if (this.data.communicationId) {
        this.sharedServices.unReadApaComunicationRequestCount = this.sharedServices.unReadApaComunicationRequestCount - 1;
      } else {
        this.sharedServices.unReadProcessedCount = this.sharedServices.unReadProcessedCount - 1;
      }
      if (notificationId) {
        this.sharedServices.markAsRead(notificationId, this.sharedServices.providerId);
      }
    }
  }
  showMessage(_mainMessage, _subMessage, _mode, _hideNoButton, _yesButtonText, _errors = null) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog'];
    dialogConfig.data = {
      // tslint:disable-next-line:max-line-length
      mainMessage: _mainMessage,
      subMessage: _subMessage,
      mode: _mode,
      hideNoButton: _hideNoButton,
      yesButtonText: _yesButtonText,
      errors: _errors
    };
    const dialogRef = this.dialog.open(ConfirmationAlertDialogComponent, dialogConfig);
  }
  openReasonModal(requestId: number, responseId: number, reqType: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog'];
    dialogConfig.data = {
      approvalRequestId: requestId,
      approvalResponseId: responseId,
      type: reqType,
      isApproval:true
    };

    const dialogRef = this.dialog.open(CancelReasonModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onSubmit();
      }
    });
  }
  OpenReuseApprovalModal(requestId: number, responseId: number) {
    this.sharedServices.loadingChanged.next(true);

    let action: any;
    action = this.providerNphiesApprovalService.getTransactionDetails(this.sharedServices.providerId, requestId, responseId);

    // tslint:disable-next-line:max-line-length
    action.subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          const body: any = event.body;

          const dialogConfig = new MatDialogConfig();
          dialogConfig.panelClass = ['primary-dialog', 'full-screen-dialog'];
          dialogConfig.data = {
            // tslint:disable-next-line:max-line-length
            claimReuseId: requestId,
            detailsModel: body
          };

          const dialogRef = this.dialog.open(ReuseApprovalModalComponent, dialogConfig);
          dialogRef.afterClosed().subscribe(result => {
            if (result && result.IsReuse) {
              this.onSubmit();
            }
          }, error => { });
        }
        this.sharedServices.loadingChanged.next(false);
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          if (error.error && error.error.errors) {
            // tslint:disable-next-line:max-line-length
            this.showMessage('Error', (error.error && error.error.message) ? error.error.message : ((error.error && !error.error.message) ? error.error : (error.error ? error.error : error.message)), 'alert', true, 'OK', error.error.errors);
          } else {
            // tslint:disable-next-line:max-line-length
            this.showMessage('Error', (error.error && error.error.message) ? error.error.message : ((error.error && !error.error.message) ? error.error : (error.error ? error.error : error.message)), 'alert', true, 'OK');
          }
        } else if (error.status === 404) {
          this.showMessage('Error', error.error.message ? error.error.message : error.error.error, 'alert', true, 'OK');
        } else if (error.status === 500) {
          this.showMessage('Error', error.error.message, 'alert', true, 'OK');
        }
        this.sharedServices.loadingChanged.next(false);
      }
    });
  }
  openDetailsDialogCR(event) {  
    this.getTransactionDetails(event.requestId, null, event.communicationId, event.notificationId, event.notificationStatus);
  }
  tabChange($event) {   
   if ($event && $event.index === 1) {
      this.communicationRequests.getCommunicationRequests();
    }
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
    this.onSubmit();
  }

  paginationChange(event) {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
  }
  get NewComunicationRequests() {
    return this.sharedServices.unReadApaComunicationRequestCount;
  }
  get paginatorLength() {
    if (this.transactionModel != null) {
      return this.transactionModel.totalElements;
    } else {
      return 0;
    }
  }

}
