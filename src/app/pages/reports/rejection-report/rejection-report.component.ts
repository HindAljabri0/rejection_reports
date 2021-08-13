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

@Component({
  selector: 'app-rejection-report',
  templateUrl: './rejection-report.component.html',
  styles: []
})
export class RejectionReportComponent implements OnInit {
  detailCardTitle = 'Submitted Invoices';
  detailTopActionIcon = 'ic-download.svg';
  detailAccentColor = 'primary';
  @Input() from: string;
  @Input() to: string;
  @Input() payerId: string[];
  @Input() queryPage: number;
  @Input() pageSize: number;
  @Input() providerId: string;
  @Input() criteriaType: string;

  @Output() onPaymentClick = new EventEmitter();
  @Output() onPaginationChange = new EventEmitter();

  paginatorPagesNumbers: number[];
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  paginatorPageSizeOptions = [10, 20, 50, 100];
  manualPage = null;

  errorMessage: string;

  rejectionReportSummary: PaginatedResult<RejectionSummary>;
  rejectedClaims = Array();

  lastDownloadSubscriptions: Subscription;


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
    // this.fetchData();
  }

  fetchData() {
    if (this.commen.loading) {
      return;
    }
    if (this.providerId == null || this.from == null || this.to == null || this.payerId == null || this.criteriaType == null) {
      return;
    }
    this.commen.loadingChanged.next(true);
    this.detailTopActionIcon = 'ic-download.svg';
    if (this.lastDownloadSubscriptions != null && !this.lastDownloadSubscriptions.closed) {
      this.lastDownloadSubscriptions.unsubscribe();
    }
    this.errorMessage = null;
    // let event;
    // event = await this.reportService.getRejectionSummary(this.providerId,
    //   this.from,
    //   this.to,
    //   this.payerId,
    //   this.criteriaType,
    //   this.queryPage,
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
    const criteriaType = this.criteriaType.toString() === '1' ? 'extraction' : 'claim';
    this.reportService.getTechinicalRejection(this.commen.providerId,
      this.from,
      this.to,
      this.payerId,
      criteriaType,
      this.queryPage, this.pageSize).subscribe((event: any) => {
        if (event instanceof HttpResponse) {
          const body = JSON.parse(event.body);
          this.rejectionReportSummary = new PaginatedResult(body, RejectionSummary);
          this.rejectedClaims = this.rejectionReportSummary.content;
          const pages = Math.ceil((this.rejectionReportSummary.totalElements / this.paginator.pageSize));
          this.paginatorPagesNumbers = Array(pages).fill(pages).map((x, i) => i);
          this.manualPage = this.rejectionReportSummary.number;
          this.paginator.pageIndex = this.rejectionReportSummary.number;
          this.paginator.pageSize = this.rejectionReportSummary.numberOfElements;

          if (this.rejectedClaims.length == 0) {
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

  download() {
    if (this.detailTopActionIcon == 'ic-check-circle.svg') {
      return;
    }
    // this.lastDownloadSubscriptions = this.downloadService
    //   .startDownload(this.reportService.downloadRejectionAsCSV(this.providerId, this.from, this.to, this.payerId, this.criteriaType))
    //   .subscribe(status => {
    //     if (status != DownloadStatus.ERROR) {
    //       this.detailTopActionIcon = 'ic-check-circle.svg';
    //     } else {
    //       this.detailTopActionIcon = 'ic-download.svg';
    //     }
    //   });
    const criteriaType = this.criteriaType.toString() === '1' ? 'extraction' : 'claim';
    this.lastDownloadSubscriptions = this.downloadService
      .startDownload(this.reportService
        .downloadTechnicalRejectionReport(this.providerId, this.from, this.to, this.payerId, criteriaType))
      .subscribe(status => {
        if (status != DownloadStatus.ERROR) {
          this.detailTopActionIcon = 'ic-check-circle.svg';
        } else {
          this.detailTopActionIcon = 'ic-download.svg';
        }
      });
  }

  paginatorAction(event) {
    this.manualPage = event['pageIndex'];
    this.onPaginationChange.emit(event);
    this.queryPage = event.pageIndex;
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
    this.reportService.getClaimRejection(this.providerId, this.payerId, id).subscribe(
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
          claim.patientName = `${(event.body['wslGenInfo']['firstname'] != null ?
            event.body['wslGenInfo']['firstname'] : '')}
          ${(event.body['wslGenInfo']['middlename'] != null ? event.body['wslGenInfo']['middlename'] : '')}
          ${(event.body['wslGenInfo']['lastname'] != null ? event.body['wslGenInfo']['lastname'] : '')}`;
          claim.policyNumber = event.body['wslGenInfo']['policynumber'];
          claim.providerClaimId = event.body['wslGenInfo']['provclaimno'];
          claim.statusDescription = event.body['wslGenInfo']['claimprop']['statusdetail'];

          switch (claim.claimStatus) {
            case ClaimStatus.NotAccepted:
              const errors = event.body['claimError'];
              if (errors instanceof Array) {
                claim.claimErrors = errors.map(error => {
                  return {
                    status: error['errorcode'],
                    feildName: error['fieldcode'],
                    description: error['errormessage'],
                  };
                });
              }
              break;
            case ClaimStatus.INVALID:
              break;
            default:
              const invoices = event.body['wslGenInfo']['wslClaimInvoices'];
              if (invoices instanceof Array) {
                claim.services = [];
                invoices.forEach(invoice => {
                  const services = invoice['wslServiceDetails'];
                  if (services instanceof Array) {
                    services.forEach(service => {
                      claim.services.push({
                        code: service['servicecode'],
                        description: service['servicedescription'],
                        differentInComputation: service['servicedecision']['pricecorrection'],
                        invoiceNmber: invoice['invoicenumber'],
                        rejectedAmount: service['servicedecision']['rejection'],
                        rejectedAmountUnit: service['servicedecision']['unitofrejection'],
                        requestedNA: service['net'],
                        requestedNAUnit: service['unitofnet'],
                        requestedNAVat: service['netvatamount'],
                        requestedNAVatUnit: service['unitofnetvatamount'],
                        status: '',
                        statusDetails: service['servicedecision']['decisioncomment']
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
  viewClaim(item) {
    this.location.go(`${this.providerId}/claims?claimRefNo=${item.claimRefNo}&claimId=${item.claimId}`);
    const dialogRef = this.dialog.open(EditClaimComponent, {
      panelClass: ['primary-dialog', 'full-screen-dialog'],
      autoFocus: false, data: { claimId: item.claimId }
    });

  }

}


