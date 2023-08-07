import { Component, OnInit, ViewChild, Input, Output, InjectionToken, Injector } from '@angular/core';
import { ReportsService } from 'src/app/services/reportsService/reports.service';
import { SharedServices } from 'src/app/services/shared.services';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator, MatDialog } from '@angular/material';
import { HttpResponse, HttpErrorResponse, } from '@angular/common/http';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { EventEmitter } from '@angular/core';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { RejectionSummary } from 'src/app/models/rejectionSummary';
import { RejectionReportClaimDialogData } from 'src/app/models/dialogData/rejectionReportClaimDialogData';
import { ClaimStatus } from 'src/app/models/claimStatus';
import { Location } from '@angular/common';
import { DownloadService } from 'src/app/services/downloadService/download.service';
import { Observable, Subscription } from 'rxjs';
import { DownloadStatus } from 'src/app/models/downloadRequest';
import { EditClaimComponent } from '../../edit-claim/edit-claim.component';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
@Component({
  selector: 'app-rejection-report',
  templateUrl: './rejection-report.component.html',
  styles: []
})
export class RejectionReportComponent implements OnInit {
  detailCardTitle = 'Submitted Invoices';
  detailTopActionIcon = 'ic-download.svg';
  detailAccentColor = 'primary';
  sortStatusArray = {
    claimdate: true,
    status: true
  };
  // @Input() from: string;
  // @Input() to: string;
  // @Input() payerId: string[];
  // @Input() queryPage: number;
  // @Input() pageSize: number;
  // @Input() commen.providerId: string;
  // @Input() criteriaType: string;

  // @Output() onPaymentClick = new EventEmitter();
  // @Output() onPaginationChange = new EventEmitter();

  page: number;
  pageSize: number;
  tempPage = 0;
  tempPageSize = 10;

  paginatorPagesNumbers: number[];
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  paginatorPageSizeOptions = [10, 20, 50, 100];
  manualPage = null;

  errorMessage: string;

  rejectionReportSummary: PaginatedResult<RejectionSummary>;
  rejectedClaims = Array();

  lastDownloadSubscriptions: Subscription;

  sortDir = 1;
  payers: { id: string[] | string, name: string }[];

  criterias: { id: number, name: string }[] = [
    { id: 1, name: 'Upload Date' },
    { id: 2, name: 'Claim Date' },
  ];

  actionIcon = 'ic-download.svg';


  reportTypeControl: FormControl = new FormControl();
  fromDateControl: FormControl = new FormControl();
  fromDateHasError = false;

  toDateControl: FormControl = new FormControl();
  toDateHasError = false;

  payerIdControl: FormControl = new FormControl();
  payerIdHasError = false;

  rejectionCriteriaControl: FormControl = new FormControl();
  rejectionCriteriaHasError = false;
  constructor(
    public reportService: ReportsService,
    public commen: SharedServices,
    public routeActive: ActivatedRoute,
    public router: Router,
    private dialogService: DialogService,
    private downloadService: DownloadService,
    private location: Location,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.payers = [];
    const allPayersIds = [];
    this.commen.getPayersList().map(value => {
      this.payers.push({
        id: `${value.id}`,
        name: value.name
      });
      allPayersIds.push(`${value.id}`);
    });
    this.payers.push({
      id: allPayersIds,
      name: 'All'
    });
    this.routeActive.queryParams.subscribe(value => {
      if (value.from != undefined) {
        const fromDate: Date = new Date(value.from);
        this.fromDateControl.setValue(fromDate);
      }
      if (value.to != undefined) {
        const toDate: Date = new Date(value.to);
        this.toDateControl.setValue(toDate);
      }
      if (value.payer != undefined) {
        if (value.payer instanceof Array && value.payer.length > 1) {
          this.payerIdControl.setValue(allPayersIds);
        } else {
          this.payerIdControl.setValue(value.payer);
        }
      }
      // if (value.type != undefined) {
      //   this.reportTypeControl.setValue(Number.parseInt(value.type, 10));
      // }
      if (value.criteria != null) {
        this.rejectionCriteriaControl.setValue(Number.parseInt(value.criteria, 10));
        // this.criteria = value.criteria;
      }
      if (value.page != null) {
        this.page = Number.parseInt(value.page, 10);
      } else {
        this.page = 0;
      }
      if (value.pageSize != null) {
        this.pageSize = Number.parseInt(value.pageSize, 10);
      } else {
        this.pageSize = 10;
      }
    }).unsubscribe();
    this.fetchData();

  }

  fetchData() {
    this.fromDateHasError = false;
    this.toDateHasError = false;
    this.payerIdHasError = false;
    this.rejectionCriteriaHasError = false;

    if (this.reportTypeControl.invalid) {
      return;
    }

    if (this.payerIdControl.invalid) {
      this.payerIdHasError = true;
      return;
    }

    if (this.fromDateControl.invalid) {
      this.fromDateHasError = true;
      return;
    }

    if (this.toDateControl.invalid) {
      this.toDateHasError = true;
      return;
    }

    if (this.reportTypeControl.value == 3 && this.rejectionCriteriaControl.invalid) {
      this.rejectionCriteriaHasError = true;
      return;
    }

    if (this.commen.loading) {
      return;
    }

    if (this.commen.providerId == null || this.fromDateControl.value == null || this.toDateControl.value == null
      || this.payerIdControl.value == null || this.rejectionCriteriaControl.value == null) {
      return;
    }
    this.commen.loadingChanged.next(true);
    this.detailTopActionIcon = 'ic-download.svg';
    if (this.lastDownloadSubscriptions != null && !this.lastDownloadSubscriptions.closed) {
      this.lastDownloadSubscriptions.unsubscribe();
    }
    this.errorMessage = null;
    // let event;
    // event = await this.reportService.getRejectionSummary(this.commen.providerId,
    //   this.fromDateControl.value,
    //   this.toDateControl.value,
    //   this.payerIdControl.value,
    //   this.rejectionCriteriaControl.value,
    //   this.page,
    //   this.pageSize).subscribe((event) => {
    //     if (event instanceof HttpResponse) {
    //       this.rejectionReportSummary = new PaginatedResult(event.body, RejectionSummary);
    //       this.rejectedClaims = this.rejectionReportSummary.content;
    //       const pages = Math.ceil((this.rejectionReportSummary.totalElements / this.paginator.pageSize));
    //       this.paginatorPagesNumbers = Array(pages).fill(pages).map((x, i) => i);
    //       this.manualPage = this.rejectionReportSummary.number;
    //       this.paginator.pageIndex = this.rejectionReportSummary.number;
    //       this.paginator.pageSize = this.rejectionReportSummary.numberOfElements;

    //       if (this.rejectedClaims.length == 0) {
    //         this.errorMessage = 'No Results Found';
    //       }
    //       this.commen.loadingChanged.next(false);
    //     }
    //   }, error => {
    //     if (error instanceof HttpErrorResponse) {
    //       if ((error.status / 100).toFixed() == '4') {
    //         this.errorMessage = 'Access Denied.';
    //       } else if ((error.status / 100).toFixed() == '5') {
    //         this.errorMessage = 'Server could not handle the request. Please try again later.';
    //       } else {
    //         this.errorMessage = 'Somthing went wrong.';
    //       }
    //     }
    //     this.commen.loadingChanged.next(false);
    //   });
    const fromDate = moment(this.fromDateControl.value).format('YYYY-MM-DD');
    const toDate = moment(this.toDateControl.value).format('YYYY-MM-DD');
    const criteriaType = this.rejectionCriteriaControl.value.toString() === '1' ? 'extraction' : 'claim';
    this.editURL(fromDate, toDate);
    this.reportService.getTechinicalRejection(this.commen.providerId,
      fromDate,
      toDate,
      this.payerIdControl.value,
      criteriaType,
      this.page, this.pageSize).subscribe((event: any) => {
        if (event instanceof HttpResponse) {
          const body = JSON.parse(event.body);
          this.rejectionReportSummary = new PaginatedResult(body, RejectionSummary);
          this.rejectedClaims = this.rejectionReportSummary.content;
          const pages = Math.ceil((this.rejectionReportSummary.totalElements / this.pageSize));
          this.paginatorPagesNumbers = Array(pages).fill(pages).map((x, i) => i);
          this.manualPage = this.rejectionReportSummary.number;
        //  this.page = this.rejectionReportSummary.number;
         // this.pageSize = this.rejectionReportSummary.numberOfElements;

          if (this.rejectedClaims.length == 0) {
            this.errorMessage = 'No Results Found';
            this.page = 0;
            this.pageSize = 10;
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

  download() {
    if (this.detailTopActionIcon == 'ic-check-circle.svg') {
      return;
    }
    // this.lastDownloadSubscriptions = this.downloadService
    //   .startDownload(this.reportService.downloadRejectionAsCSV(
    //   this.commen.providerId, this.fromDateControl.value, this.toDateControl.value, this.payerIdControl.value,
    //   this.rejectionCriteriaControl.value))
    //   .subscribe(status => {
    //     if (status != DownloadStatus.ERROR) {
    //       this.detailTopActionIcon = 'ic-check-circle.svg';
    //     } else {
    //       this.detailTopActionIcon = 'ic-download.svg';
    //     }
    //   });
    const fromDate = moment(this.fromDateControl.value).format('YYYY-MM-DD');
    const toDate = moment(this.toDateControl.value).format('YYYY-MM-DD');
    const criteriaType = this.rejectionCriteriaControl.value.toString() === '1' ? 'extraction' : 'claim';
    this.lastDownloadSubscriptions = this.downloadService
      .startGeneratingDownloadFile(this.reportService
        .downloadTechnicalRejectionReport(this.commen.providerId, fromDate, toDate, this.payerIdControl.value, criteriaType))
      .subscribe(status => {
        if (status != DownloadStatus.ERROR) {
          this.detailTopActionIcon = 'ic-check-circle.svg';
        } else {
          this.detailTopActionIcon = 'ic-download.svg';
        }
      });
  }

  paginatorAction(event) {
    this.manualPage = event.pageIndex;
    this.paginationChange(event);
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchData();
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

  get paginatorLength() {
    if (this.rejectionReportSummary != null) {
      return this.rejectionReportSummary.totalElements;
    } else {
      return 0;
    }
  }

  mapPayer(payerId) {
    return this.commen.getPayersList().find(value => `${value.id}` == payerId).name;
  }

  onClaimClick(id) {
    this.reportService.getClaimRejection(this.commen.providerId, this.payerIdControl.value, id).subscribe(
      event => {
        if (event instanceof HttpResponse) {
          const claim = new RejectionReportClaimDialogData();
          claim.claimDate = new Date(event.body['wslGenInfo'].claimuploadeddate);
          claim.claimStatus = event.body['wslGenInfo'].claimprop.statuscode;
          claim.drName = event.body['wslGenInfo'].physicianname;
          claim.netAmount = event.body['wslGenInfo'].net;
          claim.netVatAmount = event.body['wslGenInfo'].netvatamount;
          claim.netAmountUnit = event.body['wslGenInfo'].unitofnet;
          claim.netvatAmountUnit = event.body['wslGenInfo'].unitofnetvatamount;
          claim.patientFileNumber = event.body['wslGenInfo'].patientfilenumber;
          claim.patientName = event.body['wslGenInfo'].fullname != null ? event.body['wslGenInfo'].fullname : `${(event.body['wslGenInfo'].firstname != null ?
            event.body['wslGenInfo'].firstname : '')}
          ${(event.body['wslGenInfo'].middlename != null ? event.body['wslGenInfo'].middlename : '')}
          ${(event.body['wslGenInfo'].lastname != null ? event.body['wslGenInfo'].lastname : '')}`;
          claim.policyNumber = event.body['wslGenInfo'].policynumber;
          claim.providerClaimId = event.body['wslGenInfo'].provclaimno;
          claim.statusDescription = event.body['wslGenInfo'].claimprop.statusdetail;

          switch (claim.claimStatus) {
            case ClaimStatus.NotAccepted:
              const errors = event.body['claimError'];
              if (errors instanceof Array) {
                claim.claimErrors = errors.map(error => {
                  return {
                    status: error.errorcode,
                    feildName: error.fieldcode,
                    description: error.errormessage,
                  };
                });
              }
              break;
            case ClaimStatus.INVALID:
              break;
            default:
              const invoices = event.body['wslGenInfo'].wslClaimInvoices;
              if (invoices instanceof Array) {
                claim.services = [];
                invoices.forEach(invoice => {
                  const services = invoice.wslServiceDetails;
                  if (services instanceof Array) {
                    services.forEach(service => {
                      claim.services.push({
                        code: service.servicecode,
                        description: service.servicedescription,
                        differentInComputation: service.servicedecision.pricecorrection,
                        invoiceNmber: invoice.invoicenumber,
                        rejectedAmount: service.servicedecision.rejection,
                        rejectedAmountUnit: service.servicedecision.unitofrejection,
                        requestedNA: service.net,
                        requestedNAUnit: service.unitofnet,
                        requestedNAVat: service.netvatamount,
                        requestedNAVatUnit: service.unitofnetvatamount,
                        status: '',
                        statusDetails: service.servicedecision.decisioncomment
                      });
                    });
                  }
                });
              }
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
  viewClaim(item, e) {
    e.preventDefault();
    // this.location.go(`${this.commen.providerId}/claims?claimRefNo=${item.claimRefNo}&hasPrevious=1`);
    this.location.go(this.location.path() + '&hasPrevious=1');
    const dialogRef = this.dialog.open(EditClaimComponent, {
      panelClass: ['primary-dialog', 'full-screen-dialog'],
      autoFocus: false, data: { claimId: item.claimId }
    });

  }
  onSortClick(event, name) {
    const target = event.currentTarget;

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
    this.rejectedClaims.sort((a, b) => {
      a = a[colName].toLowerCase();
      b = b[colName].toLowerCase();
      return a.localeCompare(b) * this.sortDir;
    });
  }
  paginationChange(event) {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    // this.resetURL();
  }
  editURL(fromDate?: string, toDate?: string) {
    let path = '/reports/technical-rejection-report?';
    if (this.payerIdControl.value != null) {
      path += `payer=${this.payerIdControl.value}&`;
    }
    if (this.rejectionCriteriaControl.value != null) {
      path += `criteria=${this.rejectionCriteriaControl.value}&`;
    }
    if (fromDate != null) {
      path += `from=${fromDate}&`;
    }
    if (toDate != null) {
      path += `to=${toDate}`;
    }
    if (this.page > 0) {
      path += `&page=${this.page}`;
    }
    if (this.pageSize > 10) {
      path += `&pageSize=${this.pageSize}`;
    }
    if (path.endsWith('?') || path.endsWith('&')) {
      path = path.substr(0, path.length - 1);
    }
    this.location.go(path);
  }

}


