import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SharedServices } from 'src/app/services/shared.services';
import { Location, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatPaginator } from '@angular/material';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { ProviderNphiesApprovalService } from 'src/app/services/providerNphiesApprovalService/provider-nphies-approval.service';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import * as moment from 'moment';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BeneficiariesSearchResult } from 'src/app/models/nphies/beneficiaryFullTextSearchResult';
import { ApprovalToClaimTransaction } from 'src/app/models/approval-to-claim-transaction';

@Component({
  selector: 'app-convert-pre-auth-to-claim',
  templateUrl: './convert-pre-auth-to-claim.component.html',
  styles: []
})
export class ConvertPreAuthToClaimComponent implements OnInit {

  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  paginatorPagesNumbers: number[];
  paginatorPageSizeOptions = [10, 20, 50, 100];
  manualPage = null;
  page: number;
  pageSize: number;

  FormPreAuthTransaction: FormGroup = this.formBuilder.group({
    fromDate: [''],
    toDate: [''],
    payerId: [''],
    nphiesRequestId: [''],
    beneficiaryId: [''],
    beneficiaryName: [''],
    documentId: [''],
    status: [''],
    preAuthRefNo: [''],
    destinationId: ['']
  });

  payersList = [];

  isSubmitted = false;
  transactionModel: PaginatedResult<ApprovalToClaimTransaction>;
  transactions = [];

  beneficiariesSearchResult: BeneficiariesSearchResult[] = [];
  selectedBeneficiary: BeneficiariesSearchResult;

  currentOpenRow = -1;
  advanceSearchEnable = false;
  statusList = [
    { value: 'approved', name: 'Approved' },
    { value: 'pended', name: 'Pended' }
  ];

  selectedApprovals: string[] = new Array();
  selectedApprovalsCountOfPage = 0;
  allCheckBoxIsIndeterminate: boolean;
  allCheckBoxIsChecked: boolean;

  constructor(
    public sharedServices: SharedServices,
    private formBuilder: FormBuilder,
    private location: Location,
    private datePipe: DatePipe,
    private routeActive: ActivatedRoute,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private beneficiaryService: ProvidersBeneficiariesService,
    private providerNphiesSearchService: ProviderNphiesSearchService,
    private providerNphiesApprovalService: ProviderNphiesApprovalService
  ) { }

  ngOnInit() {

    const today = new Date();
    const oneMonthAgo = new Date(today. getFullYear(), today. getMonth() - 1, today. getDate());
    this.FormPreAuthTransaction.controls.fromDate.setValue(this.datePipe.transform(oneMonthAgo, 'yyyy-MM-dd'));
    this.FormPreAuthTransaction.controls.toDate.setValue(this.datePipe.transform(today, 'yyyy-MM-dd'));

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
        this.FormPreAuthTransaction.controls.payerId.patchValue(params.payerId);
      }

      if (params.destinationId != null) {
        // tslint:disable-next-line:radix
        this.FormPreAuthTransaction.controls.destinationId.patchValue(params.destinationId);
      }

      if (params.nphiesRequestId != null) {
        // tslint:disable-next-line:radix
        this.FormPreAuthTransaction.controls.nphiesRequestId.patchValue(params.nphiesRequestId);
      }

      if (params.beneficiaryId != null) {
        // tslint:disable-next-line:radix
        this.FormPreAuthTransaction.controls.beneficiaryId.patchValue(parseInt(params.beneficiaryId));
      }

      if (params.documentId != null) {
        // tslint:disable-next-line:radix
        this.FormPreAuthTransaction.controls.documentId.patchValue(params.documentId);
      }

      if (params.beneficiaryName != null) {
        this.FormPreAuthTransaction.controls.beneficiaryName.patchValue(params.beneficiaryName);
      }

      if (params.status != null) {
        this.FormPreAuthTransaction.controls.status.patchValue(params.status);
      }

      if (params.preAuthRefNo != null) {
        this.FormPreAuthTransaction.controls.preAuthRefNo.patchValue(params.preAuthRefNo);
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

  searchBeneficiaries() {
    if (this.FormPreAuthTransaction.controls.beneficiaryName.value.length > 2) {
      // tslint:disable-next-line:max-line-length
      this.providerNphiesSearchService.beneficiaryFullTextSearch(this.sharedServices.providerId, this.FormPreAuthTransaction.controls.beneficiaryName.value).subscribe(event => {
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

  selectPayer(event) {
    this.FormPreAuthTransaction.patchValue({
      payerId: event.value.payerNphiesId,
      destinationId: event.value.organizationNphiesId != '-1' ? event.value.organizationNphiesId : null
    });
  }

  selectBeneficiary(beneficiary: BeneficiariesSearchResult) {
    this.selectedBeneficiary = beneficiary;
    this.FormPreAuthTransaction.patchValue({
      beneficiaryName: beneficiary.name + ' (' + beneficiary.documentId + ')',
      beneficiaryId: beneficiary.id,
      documentId: beneficiary.documentId
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
            if (this.FormPreAuthTransaction.valid) {
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

      if (this.FormPreAuthTransaction.controls.nphiesRequestId.value) {
        model.nphiesRequestId = this.FormPreAuthTransaction.controls.nphiesRequestId.value;
      }

      if (this.FormPreAuthTransaction.controls.payerId.value) {
        model.payerId = this.FormPreAuthTransaction.controls.payerId.value;
      }

      if (this.FormPreAuthTransaction.controls.destinationId.value) {
        model.destinationId = this.FormPreAuthTransaction.controls.destinationId.value;
      }

      // tslint:disable-next-line:max-line-length
      if (this.FormPreAuthTransaction.controls.beneficiaryName.value && this.FormPreAuthTransaction.controls.beneficiaryId.value && this.FormPreAuthTransaction.controls.documentId.value) {
        model.documentId = this.FormPreAuthTransaction.controls.documentId.value;
      }

      if (this.FormPreAuthTransaction.controls.status.value) {
        model.status = this.FormPreAuthTransaction.controls.status.value;
      }

      if (this.FormPreAuthTransaction.controls.preAuthRefNo.value) {
        model.preAuthRefNo = this.FormPreAuthTransaction.controls.preAuthRefNo.value;
        // model.preAuthRefNo = this.FormPreAuthTransaction.controls.preAuthRefNo.value.map(x => {
        //   return x.value;
        // });
      }


      model.page = this.page;
      model.pageSize = this.pageSize;

      this.editURL(model.fromDate, model.toDate);
      this.providerNphiesSearchService.getApprovalToClaimConvertCriteria(this.sharedServices.providerId, model).subscribe((event: any) => {
        if (event instanceof HttpResponse) {
          const body = event.body;
          // this.transactions = body;
          this.transactionModel = new PaginatedResult(body, ApprovalToClaimTransaction);
          this.transactions = this.transactionModel.content;
          this.transactions.forEach(x => {
            // tslint:disable-next-line:max-line-length
            x.payerName = this.payersList.find(y => y.nphiesId === x.payerId) ? this.payersList.filter(y => y.nphiesId === x.payerId)[0].englistName : '';
          });

          this.transactions.forEach(x => {
            x.episodeId = '';
            if (x.items && x.items.length > 0) {
              x.items.forEach(y => {
                y.invoceNo = '';
              });
            }
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
    let path = '/nphies/convert-pre-auth-to-claim?';

    if (this.FormPreAuthTransaction.controls.fromDate.value) {
      path += `fromDate=${this.datePipe.transform(this.FormPreAuthTransaction.controls.fromDate.value, 'dd-MM-yyyy')}&`;
    }

    if (this.FormPreAuthTransaction.controls.toDate.value) {
      path += `toDate=${this.datePipe.transform(this.FormPreAuthTransaction.controls.toDate.value, 'dd-MM-yyyy')}&`;
    }

    if (this.FormPreAuthTransaction.controls.payerId.value) {
      path += `payerId=${this.FormPreAuthTransaction.controls.payerId.value}&`;
    }

    if (this.FormPreAuthTransaction.controls.destinationId.value) {
      path += `destinationId=${this.FormPreAuthTransaction.controls.destinationId.value}&`;
    }

    if (this.FormPreAuthTransaction.controls.nphiesRequestId.value) {
      path += `nphiesRequestId=${this.FormPreAuthTransaction.controls.nphiesRequestId.value}&`;
    }

    // tslint:disable-next-line:max-line-length
    if (this.FormPreAuthTransaction.controls.beneficiaryName.value && this.FormPreAuthTransaction.controls.beneficiaryId.value && this.FormPreAuthTransaction.controls.documentId.value) {
      path += `beneficiaryId=${this.FormPreAuthTransaction.controls.beneficiaryId.value}&`;
      path += `beneficiaryName=${this.FormPreAuthTransaction.controls.beneficiaryName.value}&`;
      path += `documentId=${this.FormPreAuthTransaction.controls.documentId.value}&`;
    }

    if (this.FormPreAuthTransaction.controls.documentId.value) {
      path += `documentId=${this.FormPreAuthTransaction.controls.documentId.value}&`;
    }

    if (this.FormPreAuthTransaction.controls.status.value) {
      path += `status=${this.FormPreAuthTransaction.controls.status.value}&`;
    }

    if (this.FormPreAuthTransaction.controls.preAuthRefNo.value) {
      path += `preAuthRefNo=${this.FormPreAuthTransaction.controls.preAuthRefNo.value}&`;
      // path += `preAuthRefNo=${this.FormPreAuthTransaction.controls.preAuthRefNo.value.map(x => {
      //   return x.value;
      // })}&`;
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

  toggleRow(index) {
    this.currentOpenRow = this.currentOpenRow == index ? -1 : index;
  }

  toggleAdvanceSearch() {
    this.advanceSearchEnable = !this.advanceSearchEnable;
  }

  convertToClaim() {
    let episodeIds = [];
    if (this.selectedApprovals.length === 0) {
      episodeIds = this.transactions.map(x => {
        return x.convertToClaimEpisodeId;
      });
    } else {
      episodeIds = this.selectedApprovals;
    }
    this.sharedServices.loadingChanged.next(true);

    this.providerNphiesApprovalService.convertToClaim(this.sharedServices.providerId, episodeIds).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        const body = event.body;

        const messages = [];
        messages.push('Upload Name:' + body.uploadName);
        messages.push('upload Date:' + body.uploadDate);
        messages.push('Accepted Claims:' + body.noOfAcceptedClaims);
        messages.push('Not Accepted Claims:' + body.noOfNotAcceptedClaims);
        // tslint:disable-next-line:max-line-length
        this.dialogService.showMessageObservable('Success', body.message, 'success', true, 'OK', messages, true).subscribe(res => {
          this.onSubmit();
        });
        this.sharedServices.loadingChanged.next(false);
      }
    }, error => {
      this.sharedServices.loadingChanged.next(false);
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', error.error.errors);
        } else if (error.status === 404) {
          const errors: any[] = [];
          if (error.error.errors) {
            error.error.errors.forEach(x => {
              errors.push(x);
            });
            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', errors);
          } else {
            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK');
          }
        } else if (error.status === 500) {
          // tslint:disable-next-line:max-line-length
          this.dialogService.showMessage(error.error.message ? error.error.message : error.error.error, '', 'alert', true, 'OK', error.error.error);
        } else if (error.status === 503) {
          const errors: any[] = [];
          if (error.error.errors) {
            error.error.errors.forEach(x => {
              errors.push(x);
            });
            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', errors);
          } else {
            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK');
          }
        }
      }
    });
  }

  selectApproval(convertToClaimEpisodeId: string) {
    if (!this.selectedApprovals.includes(convertToClaimEpisodeId)) {
      this.selectedApprovals.push(convertToClaimEpisodeId);
      this.selectedApprovalsCountOfPage++;
    } else {
      this.selectedApprovals.splice(this.selectedApprovals.indexOf(convertToClaimEpisodeId), 1);
      this.selectedApprovalsCountOfPage--;
    }
  }

}
