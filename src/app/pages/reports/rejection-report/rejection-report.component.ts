import { Component, OnInit, ViewChild, Input, Output } from '@angular/core';
import { ReportsService } from 'src/app/services/reportsService/reports.service';
import { SharedServices } from 'src/app/services/shared.services';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material';
import { HttpResponse, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { EventEmitter } from '@angular/core';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { RejectionSummary } from 'src/app/models/rejectionSummary';
import { RejectionReportClaimDialogData } from 'src/app/models/dialogData/rejectionReportClaimDialogData';
import { ClaimStatus } from 'src/app/models/claimStatus';

@Component({
  selector: 'app-rejection-report',
  templateUrl: './rejection-report.component.html',
  styleUrls: ['./rejection-report.component.css']
})
export class RejectionReportComponent implements OnInit {
  detailCardTitle = "Submitted Invoices";
  detailTopActionText = "vertical_align_bottom";
  detailAccentColor = "#3060AA";
  detailActionText: string = null;
  detailSubActionText: string = null;
  detailCheckBoxIndeterminate: boolean;
  detailCheckBoxChecked: boolean;
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
  @ViewChild('paginator', {static: false}) paginator: MatPaginator;
  paginatorPageSizeOptions = [10, 20, 50, 100];
  manualPage = null;

  errorMessage: string;

  rejectionReportSummary: PaginatedResult<RejectionSummary>;
  rejectedClaims = Array();


  constructor(public reportService: ReportsService, public commen: SharedServices, public routeActive: ActivatedRoute, public router: Router, private dialogService: DialogService) { }

  ngOnInit() {
    //this.fetchData();
  }

  async fetchData() {
    if (this.providerId == null || this.from == null || this.to == null || this.payerId == null || this.criteriaType == null) return;
    this.commen.loadingChanged.next(true);
    this.errorMessage = null;
    let event;
    event = await this.reportService.getRejectionSummary(this.providerId, this.from, this.to, this.payerId, this.criteriaType, this.queryPage, this.pageSize).subscribe((event) => {
      if (event instanceof HttpResponse) {
        this.rejectionReportSummary = new PaginatedResult(event.body, RejectionSummary);
        this.rejectedClaims = this.rejectionReportSummary.content;
        const pages = Math.ceil((this.rejectionReportSummary.totalElements / this.paginator.pageSize));
        this.paginatorPagesNumbers = Array(pages).fill(pages).map((x, i) => i);
        this.manualPage = this.rejectionReportSummary.number;
        this.paginator.pageIndex = this.rejectionReportSummary.number;
        this.paginator.pageSize = this.rejectionReportSummary.numberOfElements;
        console.log(this.rejectionReportSummary);
      }
      this.commen.loadingChanged.next(false);
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if ((error.status / 100).toFixed() == "4") {
          this.errorMessage = 'Access Denied.';
        } else if ((error.status / 100).toFixed() == "5") {
          this.errorMessage = 'Server could not handle the request. Please try again later.';
        } else {
          this.errorMessage = 'Somthing went wrong.';
        }
      }
      this.commen.loadingChanged.next(false);
    });
  }

  download() {
    if (this.detailTopActionText == "check_circle") return;

    this.reportService.downloadRejectionAsCSV(this.providerId, this.from, this.to, this.payerId, this.criteriaType).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (navigator.msSaveBlob) { // IE 10+
          var exportedFilename = this.detailCardTitle + '_' + this.from + '_' + this.to + '.csv';
          var blob = new Blob([event.body as BlobPart], { type: 'text/csv;charset=utf-8;' });
          navigator.msSaveBlob(blob, exportedFilename);
        } else {
          var a = document.createElement("a");
          a.href = 'data:attachment/csv;charset=ISO-8859-1,' + encodeURI(event.body + "");
          a.target = '_blank';
          a.download = this.detailCardTitle + '_' + this.from + '_' + this.to + '.csv';
          a.click();
          this.detailTopActionText = "check_circle";
        }
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        this.dialogService.openMessageDialog(new MessageDialogData("", "Could not reach the server at the moment. Please try again later.", true));
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
    this.paginatorAction({ previousPageIndex: this.paginator.pageIndex, pageIndex: index, pageSize: this.paginator.pageSize, length: this.paginator.length })
  }

  get paginatorLength() {
    if (this.rejectionReportSummary != null) {
      return this.rejectionReportSummary.totalElements;
    }
    else return 0;
  }

  mapPayer(payerId) {
    return this.commen.getPayersList().find(value => `${value.id}` == payerId).name;
  }

  onClaimClick(id) {
    this.reportService.getClaimRejection(this.providerId, this.payerId, id).subscribe(
      event => {
        if (event instanceof HttpResponse) {
          let claim = new RejectionReportClaimDialogData();
          claim.claimDate = new Date(event.body['wslGenInfo']['claimuploadeddate']);
          claim.claimStatus = event.body['wslGenInfo']['claimprop']['statuscode'];
          claim.drName = event.body['wslGenInfo']['physicianname'];
          claim.netAmount = event.body['wslGenInfo']['net'];
          claim.netVatAmount = event.body['wslGenInfo']['netvatamount'];
          claim.netAmountUnit = event.body['wslGenInfo']['unitofnet'];
          claim.netvatAmountUnit = event.body['wslGenInfo']['unitofnetvatamount'];
          claim.patientFileNumber = event.body['wslGenInfo']['patientfilenumber'];
          claim.patientName = `${(event.body['wslGenInfo']['firstname']!=null?event.body["wslGenInfo"]["firstname"]:"")} ${(event.body['wslGenInfo']['middlename']!=null?event.body['wslGenInfo']['middlename']:"")} ${(event.body['wslGenInfo']['lastname']!=null?event.body["wslGenInfo"]["lastname"]:"")}`;
          claim.policyNumber = event.body['wslGenInfo']['policynumber'];
          claim.providerClaimId = event.body['wslGenInfo']['provclaimno'];
          claim.statusDescription = event.body['wslGenInfo']['claimprop']['statusdetail'];

          switch (claim.claimStatus) {
            case ClaimStatus.NotAccepted:
              let errors = event.body['claimError'];
              if (errors instanceof Array) {
                claim.claimErrors = errors.map(error => {
                  return {
                    status: error['errorcode'],
                    feildName: error['fieldcode'],
                    description: error['errormessage'],
                  };
                })
              }
              break;
            case ClaimStatus.INVALID:
              break;
            default:
              let invoices = event.body['wslGenInfo']['wslClaimInvoices'];
              if(invoices instanceof Array){
                claim.services = [];
                invoices.forEach(invoice => {
                  let services = invoice['wslServiceDetails'];
                  if(services instanceof Array){
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
                        status: "",
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
    )
  }


}
