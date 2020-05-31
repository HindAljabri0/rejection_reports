import { Component, OnInit, Input, ViewChild, Output } from '@angular/core';
import { ReportsService } from 'src/app/services/reportsService/reports.service';
import { HttpResponse } from '@angular/common/http';
import { MatPaginator } from '@angular/material';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { PaymentClaimSummary } from 'src/app/models/paymentClaimSummary';
import { SharedServices } from 'src/app/services/shared.services';
import { EventEmitter } from '@angular/core';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';

@Component({
  selector: 'app-payment-claim-summary-report',
  templateUrl: './payment-claim-summary-report.component.html',
  styleUrls: ['./payment-claim-summary-report.component.css']
})
export class PaymentClaimSummaryReportComponent implements OnInit {

  @Input() providerId: string
  @Input() paymentReference: string;
  @Input() page: number = 0;
  @Input() pageSize: number = 10;

  @Output() onPaginationChange = new EventEmitter();

  paginatorPagesNumbers: number[];
  @ViewChild('paginator') paginator: MatPaginator;
  paginatorPageSizeOptions = [10, 20, 50, 100];
  manualPage = null;

  claimsSummaryResult:PaginatedResult<PaymentClaimSummary>;

  constructor(private reportService: ReportsService, private dialogService:DialogService) { }


  ngOnInit() {
  }

  fetchData(paymentReference:string) {
    if(this.claimsSummaryResult != null){
      this.claimsSummaryResult.content = [];
      this.claimsSummaryResult.number = 0;
      this.claimsSummaryResult.numberOfElements = 0;
    }
    this.paymentReference = paymentReference;
    this.reportService.getPaymentClaimSummary(this.providerId, paymentReference, this.page, this.pageSize).subscribe(event => {
      if(event instanceof HttpResponse){
        console.log(event)
        this.claimsSummaryResult = new PaginatedResult(event.body, PaymentClaimSummary);
        const pages = Math.ceil((this.claimsSummaryResult.totalElements / this.paginator.pageSize));
        this.paginatorPagesNumbers = Array(pages).fill(pages).map((x, i) => i);
        this.manualPage = this.paginator.pageIndex;
        this.paginator.pageIndex = this.claimsSummaryResult.number;
        this.paginator.pageSize = this.claimsSummaryResult.size;
      }
    });
  }

  paginatorAction(event) {
    this.manualPage = event['pageIndex'];
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.onPaginationChange.emit(event);
    this.fetchData(this.paymentReference);
    this.onPaginationChange.emit(event);
  }
  updateManualPage(index) {
    this.manualPage = index;
    this.paginator.pageIndex = index;
    this.paginatorAction({ previousPageIndex: this.paginator.pageIndex, pageIndex: index, pageSize: this.paginator.pageSize, length: this.paginator.length })
  }

  get paginatorLength() {
    if (this.claimsSummaryResult != null) {
      return this.claimsSummaryResult.totalElements;
    }
    else return 0;
  }

  openCLaimPaymentDialog(claimId:number){
    this.dialogService.getPaymentClaimDetailAndViewIt(claimId);
  }

}
