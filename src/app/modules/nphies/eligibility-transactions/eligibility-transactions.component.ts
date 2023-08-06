import { Location, DatePipe } from '@angular/common';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatPaginator, MatDialogConfig } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { SharedServices } from 'src/app/services/shared.services';
import { ViewEligibilityDetailsComponent } from '../view-eligibility-details/view-eligibility-details.component';
import { BeneficiariesSearchResult } from 'src/app/models/nphies/beneficiaryFullTextSearchResult';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
// tslint:disable-next-line:max-line-length
import { ProvidersNphiesEligibilityService } from 'src/app/services/providersNphiesEligibilitiyService/providers-nphies-eligibility.service';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { EligibilityTransaction } from 'src/app/models/eligibility-transaction';
import * as moment from 'moment';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { DownloadService } from 'src/app/services/downloadService/download.service';
import { DownloadStatus } from 'src/app/models/downloadRequest';
import { NphiesDownloadApprovalEligibilityService } from 'src/app/services/nphies_download_approval_eligibility/nphies-download-approval-eligibility.service';

@Component({
  selector: 'app-eligibility-transactions',
  templateUrl: './eligibility-transactions.component.html',
  styles: []
})
export class EligibilityTransactionsComponent implements OnInit {

  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  paginatorPagesNumbers: number[] = [];
  paginatorPageSizeOptions = [10, 20, 50, 100];
  manualPage = null;
  page: number;
  pageSize: number;

  beneficiariesSearchResult: BeneficiariesSearchResult[] = [];
  selectedBeneficiary: BeneficiariesSearchResult;
  eligibilitySearchModel:EligibilitySearchModel={};
  payersList = [];
  FormEligibilityTransaction: FormGroup = this.formBuilder.group({
    fromDate: ['', Validators.required],
    toDate: ['', Validators.required],
    payerId: [''],
    eligibilityId: [''],
    beneficiaryId: [''],
    documentId: [''],
    beneficiaryName: [''],
    status: [''],
    destinationId: ['']
  });

  isSubmitted = false;
  errorMessage: string;
  detailTopActionIcon = 'ic-download.svg';
  transactionModel: PaginatedResult<EligibilityTransaction>;
  transactions = [];

  constructor(
    public sharedServices: SharedServices,
    private formBuilder: FormBuilder,
    private location: Location,
    private downloadService: DownloadService,
    private datePipe: DatePipe,
    private nphiesDownloadApprovalEligibilityService:NphiesDownloadApprovalEligibilityService,
    private routeActive: ActivatedRoute,
    private dialog: MatDialog,
    private beneficiaryService: ProvidersBeneficiariesService,
    private providerNphiesSearchService: ProviderNphiesSearchService,
    private providersNphiesEligibilityService: ProvidersNphiesEligibilityService
  ) { }

  statusList = [
    { value: 'Processing Complete', name: 'Processing Complete' },
    { value: 'error', name: 'Error' }
  ];

  ngOnInit() {

    this.FormEligibilityTransaction.controls.fromDate.setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
    this.FormEligibilityTransaction.controls.toDate.setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));

    this.getPayerList();

    this.routeActive.queryParams.subscribe(params => {

      if (params.fromDate != null) {
        const d1 = moment(moment(params.fromDate, 'DD-MM-YYYY')).format('YYYY-MM-DD');
        this.FormEligibilityTransaction.controls.fromDate.patchValue(this.datePipe.transform(d1, 'yyyy-MM-dd'));
      }

      if (params.toDate != null) {
        const d2 = moment(moment(params.toDate, 'DD-MM-YYYY')).format('YYYY-MM-DD');
        this.FormEligibilityTransaction.controls.toDate.patchValue(this.datePipe.transform(d2, 'yyyy-MM-dd'));
      }

      if (params.payerId != null) {
        // tslint:disable-next-line:radix
        this.FormEligibilityTransaction.controls.payerId.patchValue(params.payerId);
      }

      if (params.destinationId != null) {
        // tslint:disable-next-line:radix
        this.FormEligibilityTransaction.controls.destinationId.patchValue(params.destinationId);
      }


      if (params.eligibilityId != null) {
        // tslint:disable-next-line:radix
        this.FormEligibilityTransaction.controls.eligibilityId.patchValue(parseInt(params.eligibilityId));
      }

      if (params.beneficiaryId != null) {
        // tslint:disable-next-line:radix
        this.FormEligibilityTransaction.controls.beneficiaryId.patchValue(parseInt(params.beneficiaryId));
      }

      if (params.documentId != null) {
        // tslint:disable-next-line:radix
        this.FormEligibilityTransaction.controls.documentId.patchValue(parseInt(params.documentId));
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
    if (this.FormEligibilityTransaction.controls.beneficiaryName.value.length > 3) {
      this.providerNphiesSearchService.beneficiaryFullTextSearch(this.sharedServices.providerId, this.FormEligibilityTransaction.controls.beneficiaryName.value).subscribe(event => {
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
    this.FormEligibilityTransaction.patchValue({
      beneficiaryName: beneficiary.name + ' (' + beneficiary.documentId + ')',
      beneficiaryId: beneficiary.id,
      documentId: beneficiary.documentId
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
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.paginationChange(event);
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
        model.eligibilityId = parseInt(this.FormEligibilityTransaction.controls.eligibilityId.value, 10);
      }

      if (this.FormEligibilityTransaction.controls.payerId.value) {
        model.payerId = this.FormEligibilityTransaction.controls.payerId.value;
      }

      if (this.FormEligibilityTransaction.controls.destinationId.value) {
        model.destinationId = this.FormEligibilityTransaction.controls.destinationId.value;
      }

      // tslint:disable-next-line:max-line-length
      if (this.FormEligibilityTransaction.controls.beneficiaryName.value && this.FormEligibilityTransaction.controls.beneficiaryId.value && this.FormEligibilityTransaction.controls.documentId.value) {
        //model.documentId = parseInt(this.FormEligibilityTransaction.controls.documentId.value, 10);
        model.documentId = this.FormEligibilityTransaction.controls.documentId.value;
      }

      if (this.FormEligibilityTransaction.controls.status.value) {
        model.status = this.FormEligibilityTransaction.controls.status.value;
      }

      model.page = this.page;
      model.pageSize = this.pageSize;

      this.editURL(model.fromDate, model.toDate);
      this.detailTopActionIcon = 'ic-download.svg';
      this.providersNphiesEligibilityService.getEligibilityTransactions(this.sharedServices.providerId, model).subscribe((event: any) => {
        if (event instanceof HttpResponse) {
          const body = event.body;
          // this.transactions = body;
          this.transactionModel = new PaginatedResult(body, EligibilityTransaction);
          this.transactions = this.transactionModel.content;
          this.transactions.forEach(x => {
            // tslint:disable-next-line:max-line-length
            x.payerName = this.payersList.find(y => y.nphiesId === x.payer) ? this.payersList.filter(y => y.nphiesId === x.payer)[0].englistName : '';
          });
          // console.log(this.transactions);
          const pages = Math.ceil((this.transactionModel.totalElements / this.pageSize));
          this.paginatorPagesNumbers = Array(pages).fill(pages).map((x, i) => i);
          this.manualPage = this.transactionModel.number;
          this.page = this.transactionModel.number;
          this.pageSize = this.transactionModel.size;
          this.sharedServices.loadingChanged.next(false);
        }
      }, err => {
        this.sharedServices.loadingChanged.next(false);
        console.log(err);
      });

    }
  }

  async downloadSheetFormat() {
    if (this.detailTopActionIcon === 'ic-check-circle.svg') { return; }
    this.eligibilitySearchModel={};
    let event;
  
    this.eligibilitySearchModel.providerId=this.sharedServices.providerId;
    this.eligibilitySearchModel.fromDate = this.datePipe.transform(this.FormEligibilityTransaction.controls.fromDate.value, 'yyyy-MM-dd');
    this.eligibilitySearchModel.toDate = this.datePipe.transform(this.FormEligibilityTransaction.controls.toDate.value, 'yyyy-MM-dd');

    if (this.FormEligibilityTransaction.controls.eligibilityId.value) {
      this.eligibilitySearchModel.eligibilityId = this.FormEligibilityTransaction.controls.eligibilityId.value;
    }

    if (this.FormEligibilityTransaction.controls.payerId.value) {
      this.eligibilitySearchModel.payerId = this.FormEligibilityTransaction.controls.payerId.value;
    }

    
    // tslint:disable-next-line:max-line-length
    if (this.FormEligibilityTransaction.controls.beneficiaryName.value && this.FormEligibilityTransaction.controls.beneficiaryId.value && this.FormEligibilityTransaction.controls.documentId.value) {
      //model.documentId = parseInt(this.FormEligibilityTransaction.controls.documentId.value, 10);
      this.eligibilitySearchModel.documentId = this.FormEligibilityTransaction.controls.documentId.value;
    }

    if (this.FormEligibilityTransaction.controls.status.value) {
      this.eligibilitySearchModel.status = this.FormEligibilityTransaction.controls.status.value;
    }


    event = this.nphiesDownloadApprovalEligibilityService.downloadEligibilityExcelsheet( this.eligibilitySearchModel);
    if (event != null) {
      this.downloadService.startGeneratingDownloadFile(event)
        .subscribe(status => {
          if (status !== DownloadStatus.ERROR) {
            this.detailTopActionIcon = 'ic-check-circle.svg';
          } else {
            this.detailTopActionIcon = 'ic-download.svg';
          }
        });
    }
  }

  editURL(fromDate?: string, toDate?: string) {
    let path = '/nphies/eligibility-transactions?';

    if (this.FormEligibilityTransaction.controls.fromDate.value) {
      path += `fromDate=${this.datePipe.transform(this.FormEligibilityTransaction.controls.fromDate.value, 'dd-MM-yyyy')}&`;
    }

    if (this.FormEligibilityTransaction.controls.toDate.value) {
      path += `toDate=${this.datePipe.transform(this.FormEligibilityTransaction.controls.toDate.value, 'dd-MM-yyyy')}&`;
    }

    if (this.FormEligibilityTransaction.controls.payerId.value) {
      path += `payerId=${this.FormEligibilityTransaction.controls.payerId.value}&`;
    }

    if (this.FormEligibilityTransaction.controls.destinationId.value) {
      path += `destinationId=${this.FormEligibilityTransaction.controls.destinationId.value}&`;
    }

    if (this.FormEligibilityTransaction.controls.eligibilityId.value) {
      path += `eligibilityId=${this.FormEligibilityTransaction.controls.eligibilityId.value}&`;
    }

    // tslint:disable-next-line:max-line-length
    if (this.FormEligibilityTransaction.controls.beneficiaryName.value && this.FormEligibilityTransaction.controls.beneficiaryId.value && this.FormEligibilityTransaction.controls.documentId.value) {
      path += `beneficiaryId=${this.FormEligibilityTransaction.controls.beneficiaryId.value}&`;
      path += `beneficiaryName=${this.FormEligibilityTransaction.controls.beneficiaryName.value}&`;
      path += `documentId=${this.FormEligibilityTransaction.controls.documentId.value}&`;
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

  openDetailsDialog(transactionResponseId: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog', 'full-screen-dialog'];
    dialogConfig.data = {
      // tslint:disable-next-line:max-line-length
      responseId: transactionResponseId,
      providerId: this.sharedServices.providerId
    };
    dialogConfig.autoFocus = false;

    const dialogRef = this.dialog.open(ViewEligibilityDetailsComponent, dialogConfig);

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {

    //   }
    // });
  }

  selectPayer(event) {
    this.FormEligibilityTransaction.patchValue({
      payerId: event.value.payerNphiesId,
      destinationId: event.value.organizationNphiesId != '-1' ? event.value.organizationNphiesId : null
    });
  }

}
