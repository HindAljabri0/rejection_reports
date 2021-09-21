import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator } from '@angular/material';
import { ViewPreauthorizationDetailsComponent } from '../view-preauthorization-details/view-preauthorization-details.component';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BeneficiariesSearchResult } from 'src/app/models/nphies/beneficiaryFullTextSearchResult';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { ActivatedRoute } from '@angular/router';
import { Location, DatePipe } from '@angular/common';
import { SharedServices } from 'src/app/services/shared.services';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import * as moment from 'moment';
import { ProviderNphiesApprovalService } from 'src/app/services/providerNphiesApprovalService/provider-nphies-approval.service';
import { PreAuthorizationTransaction } from 'src/app/models/pre-authorization-transaction';

@Component({
  selector: 'app-preauthorization-transactions',
  templateUrl: './preauthorization-transactions.component.html',
  styles: []
})
export class PreauthorizationTransactionsComponent implements OnInit {

  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  paginatorPagesNumbers: number[];
  paginatorPageSizeOptions = [10, 20, 50, 100];
  manualPage = null;
  page: number;
  pageSize: number;

  beneficiariesSearchResult: BeneficiariesSearchResult[] = [];
  selectedBeneficiary: BeneficiariesSearchResult;

  FormPreAuthTransaction: FormGroup = this.formBuilder.group({
    fromDate: [''],
    toDate: [''],
    payerId: [''],
    preAuthorizationRequestId: [''],
    beneficiaryId: [''],
    beneficiaryName: [''],
    status: ['']
  });

  payersList = [];

  isSubmitted = false;
  errorMessage: string;
  transactionModel: PaginatedResult<PreAuthorizationTransaction>;
  transactions = [];

  statusList = [
    { value: 'queued', name: 'Queued' },
    { value: 'complete', name: 'Processing Complete' },
    { value: 'error', name: 'Error' },
    { value: 'partial', name: 'Partial Processing' },
  ];

  constructor(
    public sharedServices: SharedServices,
    private formBuilder: FormBuilder,
    private location: Location,
    private datePipe: DatePipe,
    private routeActive: ActivatedRoute,
    private dialog: MatDialog,
    private beneficiaryService: ProvidersBeneficiariesService,
    private providerNphiesApprovalService: ProviderNphiesApprovalService
  ) { }

  ngOnInit() {

    this.FormPreAuthTransaction.controls.fromDate.setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
    this.FormPreAuthTransaction.controls.toDate.setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));

    this.getPayerList();

    this.routeActive.queryParams.subscribe(params => {

      if (params.fromDate != null) {
        const d1 = moment(moment(params.fromDate, 'DD-MM-YYYY')).format('YYYY-MM-DD');
        this.FormPreAuthTransaction.controls.fromDate.patchValue(this.datePipe.transform(d1, 'yyyy-MM-dd'));
      }

      if (params.toDate != null) {
        const d2 = moment(moment(params.toDate, 'DD-MM-YYYY')).format('YYYY-MM-DD');
        this.FormPreAuthTransaction.controls.toDate.patchValue(this.datePipe.transform(d2, 'yyyy-MM-dd'));
      }

      if (params.payerId != null) {
        // tslint:disable-next-line:radix
        this.FormPreAuthTransaction.controls.payerId.patchValue(parseInt(params.payerId));
      }

      if (params.preAuthorizationRequestId != null) {
        // tslint:disable-next-line:radix
        this.FormPreAuthTransaction.controls.preAuthorizationRequestId.patchValue(parseInt(params.preAuthorizationRequestId));
      }

      if (params.beneficiaryId != null) {
        // tslint:disable-next-line:radix
        this.FormPreAuthTransaction.controls.beneficiaryId.patchValue(parseInt(params.beneficiaryId));
      }

      if (params.beneficiaryName != null) {
        this.FormPreAuthTransaction.controls.beneficiaryName.patchValue(params.beneficiaryName);
      }

      if (params.status != null) {
        this.FormPreAuthTransaction.controls.status.patchValue(params.status);
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

      if (this.FormPreAuthTransaction.valid) {
        this.onSubmit();
      }
    });
  }

  searchBeneficiaries() {
    // tslint:disable-next-line:max-line-length
    this.beneficiaryService.beneficiaryFullTextSearch(this.sharedServices.providerId, this.FormPreAuthTransaction.controls.beneficiaryName.value).subscribe(event => {
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

  selectBeneficiary(beneficiary: BeneficiariesSearchResult) {
    this.selectedBeneficiary = beneficiary;
    this.FormPreAuthTransaction.patchValue({
      beneficiaryName: beneficiary.name + ' (' + beneficiary.documentId + ')',
      beneficiaryId: beneficiary.id
    });
  }

  getPayerList() {
    this.beneficiaryService.getPayers().subscribe(event => {
      if (event instanceof HttpResponse) {
        const body = event.body;
        if (body instanceof Array) {
          this.payersList = body;
        }
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {

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
    this.onSubmit();
  }

  paginationChange(event) {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  get paginatorLength() {
    if (this.transactionModel != null) {
      return this.transactionModel.totalElements;
    } else {
      return 0;
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.FormPreAuthTransaction.valid) {
      this.sharedServices.loadingChanged.next(true);

      const model: any = {};
      model.fromDate = this.datePipe.transform(this.FormPreAuthTransaction.controls.fromDate.value, 'yyyy-MM-dd');
      model.toDate = this.datePipe.transform(this.FormPreAuthTransaction.controls.toDate.value, 'yyyy-MM-dd');

      if (this.FormPreAuthTransaction.controls.preAuthorizationRequestId.value) {
        model.preAuthorizationRequestId = parseInt(this.FormPreAuthTransaction.controls.preAuthorizationRequestId.value);
      }

      if (this.FormPreAuthTransaction.controls.payerId.value) {
        model.payerId = parseInt(this.FormPreAuthTransaction.controls.payerId.value);
      }

      if (this.FormPreAuthTransaction.controls.beneficiaryName.value && this.FormPreAuthTransaction.controls.beneficiaryId.value) {
        model.beneficiaryId = parseInt(this.FormPreAuthTransaction.controls.beneficiaryId.value);
      }

      if (this.FormPreAuthTransaction.controls.status.value) {
        model.status = this.FormPreAuthTransaction.controls.status.value;
      }

      model.page = this.page;
      model.pageSize = this.pageSize;

      this.editURL(model.fromDate, model.toDate);
      this.providerNphiesApprovalService.getApprovalRequestTransactions(this.sharedServices.providerId, model).subscribe((event: any) => {
        if (event instanceof HttpResponse) {
          const body = event.body;
          // this.transactions = body;
          this.transactionModel = new PaginatedResult(body, PreAuthorizationTransaction);
          this.transactions = this.transactionModel.content;
          this.transactions.forEach(x => {
            // tslint:disable-next-line:max-line-length
            x.payerName = this.payersList.find(y => y.nphiesId === x.payerId) ? this.payersList.filter(y => y.nphiesId === x.payerId)[0].englistName : '';
          });
          console.log(this.transactions);
          const pages = Math.ceil((this.transactionModel.totalElements / this.paginator.pageSize));
          this.paginatorPagesNumbers = Array(pages).fill(pages).map((x, i) => i);
          this.manualPage = this.transactionModel.number;
          this.paginator.pageIndex = this.transactionModel.number;
          this.paginator.pageSize = this.transactionModel.numberOfElements;
          this.sharedServices.loadingChanged.next(false);
        }
      }, err => {
        this.sharedServices.loadingChanged.next(false);
        console.log(err);
      });

    }
  }

  editURL(fromDate?: string, toDate?: string) {
    let path = '/nphies/preauthorization-transactions?';

    if (this.FormPreAuthTransaction.controls.fromDate.value) {
      path += `fromDate=${this.datePipe.transform(this.FormPreAuthTransaction.controls.fromDate.value, 'dd-MM-yyyy')}&`;
    }

    if (this.FormPreAuthTransaction.controls.toDate.value) {
      path += `toDate=${this.datePipe.transform(this.FormPreAuthTransaction.controls.toDate.value, 'dd-MM-yyyy')}&`;
    }

    if (this.FormPreAuthTransaction.controls.payerId.value) {
      path += `payerId=${this.FormPreAuthTransaction.controls.payerId.value}&`;
    }

    if (this.FormPreAuthTransaction.controls.preAuthorizationRequestId.value) {
      path += `preAuthorizationRequestId=${this.FormPreAuthTransaction.controls.preAuthorizationRequestId.value}&`;
    }

    if (this.FormPreAuthTransaction.controls.beneficiaryName.value && this.FormPreAuthTransaction.controls.beneficiaryId.value) {
      path += `beneficiaryId=${this.FormPreAuthTransaction.controls.beneficiaryId.value}&`;
      path += `beneficiaryName=${this.FormPreAuthTransaction.controls.beneficiaryName.value}&`;
    }

    if (this.FormPreAuthTransaction.controls.status.value) {
      path += `status=${this.FormPreAuthTransaction.controls.status.value}&`;
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

  openDetailsDialog() {
    const dialogRef = this.dialog.open(ViewPreauthorizationDetailsComponent,
      {
        panelClass: ['primary-dialog', 'full-screen-dialog']
      });
  }

}
