import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator } from '@angular/material';
import { ConfirmationAlertDialogComponent } from 'src/app/components/confirmation-alert-dialog/confirmation-alert-dialog.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { DatePipe, Location } from '@angular/common';
import { SharedServices } from 'src/app/services/shared.services';
import * as moment from 'moment';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { PaymentReconciliation } from 'src/app/models/payment-reconciliation';
import { NphiesPollManagementService } from 'src/app/services/nphiesPollManagement/nphies-poll-management.service';
import { RecentReconciliationComponent } from './recent-reconciliation/recent-reconciliation.component';
import { NphiesPayersSelectorComponent } from 'src/app/components/reusables/nphies-payers-selector/nphies-payers-selector.component';


@Component({
  selector: 'app-payment-reconciliation',
  templateUrl: './payment-reconciliation.component.html',
  styles: []
})
export class PaymentReconciliationComponent implements OnInit {

  @ViewChild('recentReconciliation', { static: false }) recentReconciliation: RecentReconciliationComponent;
  @ViewChild('tpaPayers', {static: false}) tpaPayers: NphiesPayersSelectorComponent;
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  paginatorPagesNumbers: number[] = [];
  paginatorPageSizeOptions = [10, 20, 50, 100];
  manualPage = null;
  page: number;
  pageSize: number;

  FormPaymentReconciliation: FormGroup = this.formBuilder.group({
    fromDate: [''],
    toDate: [''],
    issuerId: [''],
    destinationId: ['']
  });

  isSubmitted = false;
  payersList = [];
  paymentReconciliationModel: PaginatedResult<PaymentReconciliation>;
  paymentReconciliations = [];
  searchModel: any;

  constructor(
    private dialog: MatDialog,
    public sharedServices: SharedServices,
    private formBuilder: FormBuilder,
    private location: Location,
    private datePipe: DatePipe,
    private routeActive: ActivatedRoute,
    private dialogService: DialogService,
    private providerNphiesSearchService: ProviderNphiesSearchService,
    private nphiesPollManagementService: NphiesPollManagementService,
    private beneficiaryService: ProvidersBeneficiariesService,
  ) { }

  ngOnInit() {
    const today = new Date();
    const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    this.FormPaymentReconciliation.controls.fromDate.setValue(this.datePipe.transform(oneMonthAgo, 'yyyy-MM-dd'));
    this.FormPaymentReconciliation.controls.toDate.setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));

    this.routeActive.queryParams.subscribe(params => {

      if (params.fromDate != null) {
        const d1 = moment(moment(params.fromDate, 'DD-MM-YYYY')).format('YYYY-MM-DD');
        this.FormPaymentReconciliation.controls.fromDate.patchValue(this.datePipe.transform(d1, 'yyyy-MM-dd'));
      }

      if (params.toDate != null) {
        const d2 = moment(moment(params.toDate, 'DD-MM-YYYY')).format('YYYY-MM-DD');
        this.FormPaymentReconciliation.controls.toDate.patchValue(this.datePipe.transform(d2, 'yyyy-MM-dd'));
      }

      if (params.issuerId != null) {
        // tslint:disable-next-line:radix
        this.FormPaymentReconciliation.controls.issuerId.patchValue(params.issuerId);
      }

      if (params.destinationId != null) {
        // tslint:disable-next-line:radix
        this.FormPaymentReconciliation.controls.destinationId.patchValue(params.destinationId);
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
    this.beneficiaryService.getPayers().subscribe(event => {
      if (event instanceof HttpResponse) {
        const body = event.body;
        if (body instanceof Array) {
          this.payersList = body;

          if (isFromUrl) {
            if (this.FormPaymentReconciliation.valid) {
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
    if (this.FormPaymentReconciliation.valid) {
      this.sharedServices.loadingChanged.next(true);
      const model: any = {};
      model.fromDate = this.datePipe.transform(this.FormPaymentReconciliation.controls.fromDate.value, 'yyyy-MM-dd');
      model.toDate = this.datePipe.transform(this.FormPaymentReconciliation.controls.toDate.value, 'yyyy-MM-dd');

      if (this.FormPaymentReconciliation.controls.issuerId.value) {
        model.issuerId = this.FormPaymentReconciliation.controls.issuerId.value;
      }

      if (this.FormPaymentReconciliation.controls.destinationId.value) {
        model.destinationId = this.FormPaymentReconciliation.controls.destinationId.value;
      }

      model.page = this.page;
      model.pageSize = this.pageSize;
      this.searchModel = model;
      this.editURL();

      this.providerNphiesSearchService.getPaymentReconciliation(this.sharedServices.providerId, model).subscribe((event: any) => {
        if (event instanceof HttpResponse) {
          const body = event.body;
          this.paymentReconciliationModel = new PaginatedResult(body, PaymentReconciliation);
          this.paymentReconciliations = this.paymentReconciliationModel.content;
          this.paymentReconciliations.forEach(x => {
            // tslint:disable-next-line:max-line-length
            x.issuerName = this.payersList.find(y => y.nphiesId === x.issuerNphiesId) ? this.payersList.filter(y => y.nphiesId === x.issuerNphiesId)[0].englistName : '-';
            x.tpaName= this.tpaPayers.findTPAName(x.destinationId);
          });
          // console.log(this.paymentReconciliations);
          const pages = Math.ceil((this.paymentReconciliationModel.totalElements / this.pageSize));
          this.paginatorPagesNumbers = Array(pages).fill(pages).map((x, i) => i);
          this.manualPage = this.paymentReconciliationModel.number;
          this.page = this.paymentReconciliationModel.number;
          this.pageSize = this.paymentReconciliationModel.size;
          this.sharedServices.loadingChanged.next(false);
        }
      }, err => {
        this.sharedServices.loadingChanged.next(false);
        console.log(err);
      });
    }
  }

  tabChange($event) {
    if ($event && $event.index === 1) {
      this.recentReconciliation.getRecentReconciliation();
    }
  }

  editURL() {
    let path = '/nphies/payment-reconciliation?';

    if (this.FormPaymentReconciliation.controls.fromDate.value) {
      path += `fromDate=${this.datePipe.transform(this.FormPaymentReconciliation.controls.fromDate.value, 'dd-MM-yyyy')}&`;
    }

    if (this.FormPaymentReconciliation.controls.toDate.value) {
      path += `toDate=${this.datePipe.transform(this.FormPaymentReconciliation.controls.toDate.value, 'dd-MM-yyyy')}&`;
    }

    if (this.FormPaymentReconciliation.controls.issuerId.value) {
      path += `issuerId=${this.FormPaymentReconciliation.controls.issuerId.value}&`;
    }

    if (this.FormPaymentReconciliation.controls.destinationId.value) {
      path += `destinationId=${this.FormPaymentReconciliation.controls.destinationId.value}&`;
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

  get paginatorLength() {
    if (this.paymentReconciliationModel != null) {
      return this.paymentReconciliationModel.totalElements;
    } else {
      return 0;
    }
  }

  openSendPaymentNoticeConfimationDialog(reconciliationId, paymentAmount) {
    // tslint:disable-next-line:max-line-length
    const subMsg = '<span class="semibold">Amount:</span> ' + paymentAmount + ' SR<br><span class="semibold">Payment Status:</span> ' + (paymentAmount < 0 ? 'Paid' : 'Cleared');
    const dialogRef = this.dialog.open(ConfirmationAlertDialogComponent, {
      panelClass: ['primary-dialog'],
      disableClose: true,
      autoFocus: false,
      data: {
        mainMessage: 'Payment Notice',
        subMessage: subMsg,
        mode: 'warning',
        yesButtonText: 'Send',
        noButtonText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sendPaymentNotice(reconciliationId);
      }
    });
  }

  sendPaymentNotice(reconciliationId) {
    const model: any = {};
    model.reconciliationId = reconciliationId;
    this.sharedServices.loadingChanged.next(true);
    this.nphiesPollManagementService.senPaymentNotice(this.sharedServices.providerId, model).subscribe(event => {
      if (event instanceof HttpResponse) {
        const body: any = event.body;
        if (body.status === 'OK') {
          const errors = [];

          if (body.disposition) {
            errors.push(body.disposition);
          }

          if (body.outcome.toLowerCase() === 'error') {
            if (body.errors && body.errors.length > 0) {
              body.errors.forEach(err => {
                errors.push(err);
              });
            }

            this.dialogService.showMessage(body.message, '', 'alert', true, 'OK', errors);
          } else {
            if (errors.length > 0) {
              this.dialogService.showMessage('Success', body.message, 'success', true, 'OK', errors);
            } else {
              this.dialogService.showMessage('Success', body.message, 'success', true, 'OK');
            }
            this.onSubmit();
          }
        }
        this.sharedServices.loadingChanged.next(false);
      }
    }, err => {
      this.sharedServices.loadingChanged.next(false);
    });
  }

  selectPayer(event) {
    if (event.value === '-1') {
      this.FormPaymentReconciliation.patchValue({
        issuerId: null,
        destinationId: null
      });
    } else {
      this.FormPaymentReconciliation.patchValue({
        issuerId: event.value.payerNphiesId,
        destinationId: event.value.organizationNphiesId !== '-1' ? event.value.organizationNphiesId : null
      });
    }

  }

  get NewRecentReconciliation() {
    return this.sharedServices.unReadRecentCount;
  }
}
