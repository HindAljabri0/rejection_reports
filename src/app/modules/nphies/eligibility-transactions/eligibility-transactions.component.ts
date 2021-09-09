import { Location, DatePipe } from '@angular/common';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatPaginator, MatDialogConfig } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { DownloadStatus } from 'src/app/models/downloadRequest';
import { DownloadService } from 'src/app/services/downloadService/download.service';
import { ReportsService } from 'src/app/services/reportsService/reports.service';
import { SharedServices } from 'src/app/services/shared.services';
import { ViewEligibilityDetailsComponent } from '../view-eligibility-details/view-eligibility-details.component';
import { BeneficiariesSearchResult } from 'src/app/models/nphies/beneficiaryFullTextSearchResult';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
// tslint:disable-next-line:max-line-length
import { ProvidersNphiesEligibilityService } from 'src/app/services/providersNphiesEligibilitiyService/providers-nphies-eligibility.service';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { EligibilityTransaction } from 'src/app/models/eligibility-transaction';

@Component({
  selector: 'app-eligibility-transactions',
  templateUrl: './eligibility-transactions.component.html',
  styles: []
})
export class EligibilityTransactionsComponent implements OnInit {

  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  paginatorPagesNumbers: number[];
  paginatorPageSizeOptions = [10, 20, 50, 100];
  manualPage = null;
  page: number;
  pageSize: number;

  beneficiariesSearchResult: BeneficiariesSearchResult[] = [];
  selectedBeneficiary: BeneficiariesSearchResult;

  payersList = [];
  FormEligibilityTransaction: FormGroup = this.formBuilder.group({
    fromDate: ['', Validators.required],
    toDate: ['', Validators.required],
    payerId: [''],
    eligibilityId: [''],
    beneficiaryId: [''],
    beneficiaryName: [''],
    status: ['']
  });

  isSubmitted = false;
  errorMessage: string;
  detailTopActionIcon = 'ic-download.svg';
  transactionModel: PaginatedResult<EligibilityTransaction>;
  transactions = [];
  minDate: any;

  constructor(
    public sharedServices: SharedServices,
    private formBuilder: FormBuilder,
    private location: Location,
    private datePipe: DatePipe,
    private routeActive: ActivatedRoute,
    private dialog: MatDialog,
    private beneficiaryService: ProvidersBeneficiariesService,
    private providersNphiesEligibilityService: ProvidersNphiesEligibilityService
  ) { }

  statusList = [
    { value: 'active', name: 'Active' },
    { value: 'cancelled', name: 'Cancelled' },
    { value: 'draft', name: 'Draft' },
    { value: 'entered-in-error', name: 'Entered in Error' },
  ];

  ngOnInit() {
    // this.payersList = this.sharedServices.getPayersList();
    // const model: any = {};
    // model.id = 'all';
    // model.value = 'All';

    // this.payersList.splice(0, 0, model);
    this.FormEligibilityTransaction.controls.fromDate.setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
    this.FormEligibilityTransaction.controls.toDate.setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));

    this.getPayerList();

    this.routeActive.queryParams.subscribe(params => {

      if (params.fromDate != null) {
        this.FormEligibilityTransaction.controls.fromDate.patchValue(this.datePipe.transform(params.fromDate, 'yyyy-MM-dd'));
      }

      if (params.toDate != null) {
        // const toDate = moment(params.toDate, 'YYYY-MM-DD').toDate();
        this.FormEligibilityTransaction.controls.toDate.patchValue(this.datePipe.transform(params.toDate, 'yyyy-MM-dd'));
      }

      if (params.payerId != null) {
        // tslint:disable-next-line:radix
        this.FormEligibilityTransaction.controls.payerId.patchValue(parseInt(params.payerId));
      }

      if (params.eligibilityId != null) {
        this.FormEligibilityTransaction.controls.eligibilityId.patchValue(params.eligibilityId);
      }

      if (params.beneficiaryId != null) {
        this.FormEligibilityTransaction.controls.beneficiaryId.patchValue(params.beneficiaryId);
      }

      if (params.beneficiaryName != null) {
        this.FormEligibilityTransaction.controls.beneficiaryName.patchValue(params.beneficiaryName);
      }

      if (params.status != null) {
        this.FormEligibilityTransaction.controls.status.patchValue(params.status);
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

      if (this.FormEligibilityTransaction.valid) {
        this.onSubmit();
      }
    });

  }

  searchBeneficiaries() {
    // tslint:disable-next-line:max-line-length
    this.beneficiaryService.beneficiaryFullTextSearch(this.sharedServices.providerId, this.FormEligibilityTransaction.controls.beneficiaryName.value).subscribe(event => {
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
    this.FormEligibilityTransaction.patchValue({
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
    if (this.FormEligibilityTransaction.valid) {
      this.sharedServices.loadingChanged.next(true);

      const model: any = {};
      model.fromDate = this.datePipe.transform(this.FormEligibilityTransaction.controls.fromDate.value, 'yyyy-MM-dd');
      model.toDate = this.datePipe.transform(this.FormEligibilityTransaction.controls.toDate.value, 'yyyy-MM-dd');

      if (this.FormEligibilityTransaction.controls.eligibilityId.value) {
        model.eligibilityId = this.FormEligibilityTransaction.controls.eligibilityId.value;
      }

      if (this.FormEligibilityTransaction.controls.payerId.value) {
        model.payerId = this.FormEligibilityTransaction.controls.payerId.value;
      }

      if (this.FormEligibilityTransaction.controls.beneficiaryId.value) {
        model.beneficiaryId = this.FormEligibilityTransaction.controls.beneficiaryId.value;
      }

      if (this.FormEligibilityTransaction.controls.status.value) {
        model.status = this.FormEligibilityTransaction.controls.status.value;
      }

      model.page = this.page;
      model.pageSize = this.pageSize;

      this.editURL(model.fromDate, model.toDate);
      this.providersNphiesEligibilityService.getEligibilityTransactions(this.sharedServices.providerId, model).subscribe((event: any) => {
        if (event instanceof HttpResponse) {
          const body = event.body;
          // this.transactions = body;
          this.transactionModel = new PaginatedResult(body, EligibilityTransaction);
          this.transactions = this.transactionModel.content;
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
    let path = '/nphies/eligibility-transactions?';

    if (this.FormEligibilityTransaction.controls.fromDate.value) {
      path += `fromDate=${ this.datePipe.transform(this.FormEligibilityTransaction.controls.fromDate.value, 'dd-MM-yyyy')}&`;
    }

    if (this.FormEligibilityTransaction.controls.toDate.value) {
      path += `toDate=${ this.datePipe.transform(this.FormEligibilityTransaction.controls.toDate.value, 'dd-MM-yyyy')}&`;
    }

    if (this.FormEligibilityTransaction.controls.payerId.value) {
      path += `payerId=${this.FormEligibilityTransaction.controls.payerId.value}&`;
    }

    if (this.FormEligibilityTransaction.controls.eligibilityId.value) {
      path += `eligibilityId=${this.FormEligibilityTransaction.controls.eligibilityId.value}&`;
    }

    if (this.FormEligibilityTransaction.controls.beneficiaryId.value) {
      path += `beneficiaryId=${this.FormEligibilityTransaction.controls.beneficiaryId.value}&`;
    }

    if (this.FormEligibilityTransaction.controls.beneficiaryName.value) {
      path += `beneficiaryName=${this.FormEligibilityTransaction.controls.beneficiaryName.value}&`;
    }

    if (this.FormEligibilityTransaction.controls.status.value) {
      path += `status=${this.FormEligibilityTransaction.controls.status.value}&`;
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

  dateValidation(event: any) {
    if (event !== null) {
      const startDate = moment(event).format('YYYY-MM-DD');
      const endDate = moment(this.FormEligibilityTransaction.value.toDate).format('YYYY-MM-DD');
      if (startDate > endDate) {
        this.FormEligibilityTransaction.controls['toDate'].patchValue('');
      }
    }
    this.minDate = new Date(event);

  }

  openDetailsDialog(transactionResponseId: number) {

      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = ['primary-dialog', 'full-screen-dialog'];
      dialogConfig.data = {
        // tslint:disable-next-line:max-line-length
        responseId: transactionResponseId,
        providerId: this.sharedServices.providerId
      };

      const dialogRef = this.dialog.open(ViewEligibilityDetailsComponent, dialogConfig);

      // dialogRef.afterClosed().subscribe(result => {
      //   if (result) {

      //   }
      // });
  }

}
