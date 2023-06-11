import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Location } from '@angular/common';
import { SharedServices } from 'src/app/services/shared.services';
import { ReportsService } from 'src/app/services/reportsService/reports.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { RejectionReportClaimDialogData } from 'src/app/models/dialogData/rejectionReportClaimDialogData';
import { ClaimStatus } from 'src/app/models/claimStatus';
import { MatDialog, MatPaginator } from '@angular/material';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { Subscription } from 'rxjs';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { RejectionSummary } from 'src/app/models/rejectionSummary';
import { MedicalRejectionSummary } from 'src/app/models/medicalRejectionSummary';
import { EditClaimComponent } from '../../edit-claim/edit-claim.component';
import { DownloadService } from 'src/app/services/downloadService/download.service';
import { DownloadStatus } from 'src/app/models/downloadRequest';
@Component({
  selector: 'app-medical-rejction-report',
  templateUrl: './medical-rejction-report.component.html',
  styles: []
})
export class MedicalRejctionReportComponent implements OnInit {
  payers: { id: string[] | string, name: string }[];
  medicalRejectionReportForm: FormGroup;
  submitted = false;
  errorMessage: string;
  sortStatusArray = {
    claimdate: true,
    status: true
  };
  detailTopActionIcon = 'ic-download.svg';
  claimStatusSummaryData: any;
  minDate: any;
  criterias: { id: string, name: string }[] = [
    { id: 'uploaddate', name: 'Upload Date' },
    { id: 'claimdate', name: 'Claim Date' },
  ];
  lastDownloadSubscriptions: Subscription;
  page: number;
  pageSize: number;
  tempPage = 0;
  tempPageSize = 10;
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  paginatorPageSizeOptions = [10, 20, 50, 100];
  medicalRejectionReportSummary: PaginatedResult<MedicalRejectionSummary>;
  medicalRejectedClaims = Array();
  paginatorPagesNumbers: number[];
  manualPage = null;
  datePickerConfig: Partial<BsDatepickerConfig> = { showWeekNumbers: false, dateInputFormat: 'DD/MM/YYYY' };
  sortDir = 1;
  constructor(
    public commen: SharedServices,
    private formBuilder: FormBuilder,
    private reportService: ReportsService,
    private location: Location,
    private routeActive: ActivatedRoute,
    private dialogService: DialogService,
    public dialog: MatDialog,
    private downloadService: DownloadService) {
    this.page = 0;
    this.pageSize = 10;
  }

  ngOnInit() {
    this.payers = [];
    this.medicalRejectionReportForm = this.formBuilder.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      payerId: ['', Validators.required],
      summaryCriteria: ['', Validators.required],
    });
    this.commen.getPayersList().map(value => {
      this.payers.push({
        id: `${value.id}`,
        name: value.name
      });
    });

    this.routeActive.queryParams.subscribe(params => {
      if (params.payerId != null) {
        this.medicalRejectionReportForm.controls['payerId'].patchValue(params.payerId);
      }
      if (params.summaryCriteria != null) {
        this.medicalRejectionReportForm.controls['summaryCriteria'].patchValue(params.summaryCriteria);
      }
      if (params.fromDate != null) {
        const fromDate = moment(params.fromDate, 'YYYY-MM-DD').toDate();
        this.medicalRejectionReportForm.controls['fromDate'].patchValue(fromDate);
      }
      if (params.toDate != null) {
        const toDate = moment(params.toDate, 'YYYY-MM-DD').toDate();
        this.medicalRejectionReportForm.controls['toDate'].patchValue(toDate);
      }
      if (this.medicalRejectionReportForm.valid) {
        this.search();
      }
    });
  }
  editURL(fromDate?: string, toDate?: string) {
    let path = '/reports/medical-rejection-report?';
    if (this.medicalRejectionReportForm.value.payerId != null) {
      path += `payerId=${this.medicalRejectionReportForm.value.payerId}&`;
    }
    if (this.medicalRejectionReportForm.value.summaryCriteria != null) {
      path += `summaryCriteria=${this.medicalRejectionReportForm.value.summaryCriteria}&`;
    }
    if (fromDate != null) {
      path += `fromDate=${fromDate}&`;
    }
    if (toDate != null) {
      path += `toDate=${toDate}`;
    }
    if (path.endsWith('?') || path.endsWith('&')) {
      path = path.substr(0, path.length - 1);
    }
    this.location.go(path);
  }
  get formCn() { return this.medicalRejectionReportForm.controls; }

  dateValidation(event: any) {
    if (event !== null) {
      const startDate = moment(event).format('YYYY-MM-DD');
      const endDate = moment(this.medicalRejectionReportForm.value.toDate).format('YYYY-MM-DD');
      if (startDate > endDate) {
        this.medicalRejectionReportForm.controls['toDate'].patchValue('');
      }
    }
    this.minDate = new Date(event);

  }

  search() {
    this.submitted = true;

    if (this.medicalRejectionReportForm.invalid) {
      return;
    }

    this.detailTopActionIcon = 'ic-download.svg';
    if (this.lastDownloadSubscriptions != null && !this.lastDownloadSubscriptions.closed) {
      this.lastDownloadSubscriptions.unsubscribe();
    }
    this.errorMessage = null;
    const fromDate = moment(this.medicalRejectionReportForm.value.fromDate).format('YYYY-MM-DD');
    const toDate = moment(this.medicalRejectionReportForm.value.toDate).format('YYYY-MM-DD');
    const criteriaType = this.medicalRejectionReportForm.value.summaryCriteria.toString() === 'uploaddate' ? 'extraction' : 'claim';
    this.editURL(fromDate, toDate);
    this.reportService.getMedicalRejection(this.commen.providerId,
      fromDate,
      toDate,
      this.medicalRejectionReportForm.value.payerId,
      criteriaType,
      this.page, this.pageSize).subscribe((event: any) => {
        if (event instanceof HttpResponse) {
          const body = JSON.parse(event.body);
          this.medicalRejectionReportSummary = new PaginatedResult(body, RejectionSummary);
          this.medicalRejectedClaims = this.medicalRejectionReportSummary.content;
          const pages = Math.ceil((this.medicalRejectionReportSummary.totalElements / this.pageSize));
          this.paginatorPagesNumbers = Array(pages).fill(pages).map((x, i) => i);
          this.manualPage = this.medicalRejectionReportSummary.number;
          this.page = this.medicalRejectionReportSummary.number;
          this.pageSize = this.medicalRejectionReportSummary.numberOfElements;

          if (this.medicalRejectedClaims.length == 0) {
            this.errorMessage = 'No Results Found';
          }
          this.commen.loadingChanged.next(false);
        }
      }, error => {
        if (error instanceof HttpErrorResponse) {
          if ((error.status / 100).toFixed() == '4') {
            this.errorMessage = 'Access Denied.';
          } else if ((error.status / 100).toFixed() == '5') {
            this.errorMessage = 'Server could not handle the request. Please try again later.';
          } else {
            this.errorMessage = 'Somthing went wrong.';
          }
        }
        this.commen.loadingChanged.next(false);
      });

  }
  onClaimClick(id) {
    this.reportService.getClaimRejection(this.commen.providerId, this.medicalRejectionReportForm.value.payerId, id).subscribe(
      event => {
        if (event instanceof HttpResponse) {
          const claim = new RejectionReportClaimDialogData();
          claim.claimDate = new Date(event.body['wslGenInfo']['claimuploadeddate']);
          claim.claimStatus = event.body['wslGenInfo']['claimprop']['statuscode'];
          claim.drName = event.body['wslGenInfo']['physicianname'];
          claim.netAmount = event.body['wslGenInfo']['net'];
          claim.netVatAmount = event.body['wslGenInfo']['netvatamount'];
          claim.netAmountUnit = event.body['wslGenInfo']['unitofnet'];
          claim.netvatAmountUnit = event.body['wslGenInfo']['unitofnetvatamount'];
          claim.patientFileNumber = event.body['wslGenInfo']['patientfilenumber'];
          claim.patientName = event.body['wslGenInfo'].fullname != null ? event.body['wslGenInfo'].fullname : `${(event.body['wslGenInfo']['firstname'] != null ?
            event.body['wslGenInfo']['firstname'] : '')}
          ${(event.body['wslGenInfo']['middlename'] != null ? event.body['wslGenInfo']['middlename'] : '')}
          ${(event.body['wslGenInfo']['lastname'] != null ? event.body['wslGenInfo']['lastname'] : '')}`;
          claim.policyNumber = event.body['wslGenInfo']['policynumber'];
          claim.providerClaimId = event.body['wslGenInfo']['provclaimno'];
          claim.statusCode=event.body['wslGenInfo']['claimprop']['statuscode'];
          claim.statusDescription = event.body['wslGenInfo']['claimprop']['statusdetail'];

          const invoices = event.body['wslGenInfo']['wslClaimInvoices'];
          switch (claim.claimStatus.toLocaleUpperCase()) {
            case ClaimStatus.PARTIALLY_PAID:
              if (invoices instanceof Array) {
                claim.services = [];
                invoices.forEach(invoice => {
                  const services = invoice['wslServiceDetails'];
                  if (services instanceof Array) {
                    services.forEach(service => {
                      claim.services.push({
                        code: service['servicecode'],
                        description: service['servicedescription'],
                        differentInComputation: service['servicedecision'] === null ? '' : service['servicedecision']['pricecorrection'],
                        invoiceNmber: invoice['invoicenumber'],
                        rejectedAmount: service['servicedecision'] === null ? '' : service['servicedecision']['rejection'],
                        rejectedAmountUnit: service['servicedecision'] === null ? '' : service['servicedecision']['unitofrejection'],
                        requestedNA: service['net'],
                        requestedNAUnit: service['unitofnet'],
                        requestedNAVat: service['netvatamount'],
                        requestedNAVatUnit: service['unitofnetvatamount'],
                        status:service['servicedecision'] === null ? '' : service['servicedecision'] ['servicestatuscode'],
                        statusDetails: service['servicedecision'] === null ? '' : service['servicedecision']['decisioncomment']
                      });
                    });
                  }
                });
              }
              break;
            case ClaimStatus.REJECTED:
              if (invoices instanceof Array) {
                claim.services = [];
                invoices.forEach(invoice => {
                  const services = invoice['wslServiceDetails'];
                  if (services instanceof Array) {
                    services.forEach(service => {
                      claim.services.push({
                        code: service['servicecode'],
                        description: service['servicedescription'],
                        differentInComputation: service['servicedecision'] === null ? '' : service['servicedecision']['pricecorrection'],
                        invoiceNmber: invoice['invoicenumber'],
                        rejectedAmount: service['servicedecision'] === null ? '' : service['servicedecision']['rejection'],
                        rejectedAmountUnit: service['servicedecision'] === null ? '' : service['servicedecision']['unitofrejection'],
                        requestedNA: service['net'],
                        requestedNAUnit: service['unitofnet'],
                        requestedNAVat: service['netvatamount'],
                        requestedNAVatUnit: service['unitofnetvatamount'],
                        status:service['servicedecision'] === null ? '' : service['servicedecision'] ['servicestatuscode'],
                        statusDetails: service['servicedecision'] === null ? '' : service['servicedecision']['decisioncomment']
                      });
                    });
                  }
                });
              }
              break;
            default:
              break;
          }

          this.dialogService.openRejectionReportClaimDialog(claim);
        }
      }, error => {
        if (error instanceof HttpErrorResponse) {
          console.log(error);
        }
      }
    );
  }

  paginationChange(event) {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    // this.resetURL();
    this.search();
  }
  get paginatorLength() {
    if (this.medicalRejectionReportSummary != null) {
      return this.medicalRejectionReportSummary.totalElements;
    } else {
      return 0;
    }
  }

  backButton() {
    // this.paymentReference = null;
    // this.page = this.tempPage;
    // this.pageSize = this.tempPageSize;
    // this.paymentSearchResult.page = this.page;
    // this.paymentSearchResult.pageSize = this.pageSize;
    // if (this.paymentSearchResult.payments.length == 0) {
    //   this.paymentSearchResult.fetchData();
    // }
    // this.resetURL();
  }
  viewClaim(item, e) {
    e.preventDefault();
    this.location.go(this.location.path() + '&hasPrevious=1&isViewOnly');
    const dialogRef = this.dialog.open(EditClaimComponent, {
      panelClass: ['primary-dialog', 'full-screen-dialog'],
      autoFocus: false, data: { claimId: item.claimId }
    });

  }
  paginatorAction(event) {
    this.manualPage = event['pageIndex'];
    this.paginationChange(event);
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.search();
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
  download() {
    if (this.detailTopActionIcon == 'ic-check-circle.svg') {
      return;
    }
    const fromDate = moment(this.medicalRejectionReportForm.value.fromDate).format('YYYY-MM-DD');
    const toDate = moment(this.medicalRejectionReportForm.value.toDate).format('YYYY-MM-DD');
    const criteriaType = this.medicalRejectionReportForm.value.summaryCriteria.toString() === 'uploaddate' ? 'extraction' : 'claim';
    this.lastDownloadSubscriptions = this.downloadService
      .startGeneratingDownloadFile(this.reportService
        .downloadMedicalRejectionReport(
          this.commen.providerId,
          fromDate,
          toDate,
          this.medicalRejectionReportForm.value.payerId,
          criteriaType
        ))
      .subscribe(status => {
        if (status != DownloadStatus.ERROR) {
          this.detailTopActionIcon = 'ic-check-circle.svg';
        } else {
          this.detailTopActionIcon = 'ic-download.svg';
        }
      });
  }
  onSortClick(event, name) {
    const target = event.currentTarget;
    const classList = target.classList;

    if (this.sortStatusArray[name]) {
      this.sortStatusArray[name] = false;
      this.sortDir = -1;
    } else {
      this.sortStatusArray[name] = true;
      this.sortDir = 1;
    }
    this.sortArr(name);
  }

  sortArr(colName: any) {
    this.medicalRejectedClaims.sort((a, b) => {
      a = a[colName].toLowerCase();
      b = b[colName].toLowerCase();
      return a.localeCompare(b) * this.sortDir;
    });
  }

}
