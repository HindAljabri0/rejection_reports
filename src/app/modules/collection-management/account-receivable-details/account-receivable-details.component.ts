import { Component, OnInit } from '@angular/core';
import { CollectionManagementService } from 'src/app/services/collection-management/collection-management.service';
import { SharedServices } from 'src/app/services/shared.services';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-account-receivable-details',
  templateUrl: './account-receivable-details.component.html',
  styles: []
})
export class AccountReceivableDetailsComponent implements OnInit {
  month: string;
  payersList: { id: number, name: string, arName: string }[] = [];
  receivableData: any = [];
  displayMonth: any;
  constructor(private collectionManagementService: CollectionManagementService, private sharedService: SharedServices, private routeActive: ActivatedRoute) {
  }

  ngOnInit() {
    this.payersList = this.sharedService.getPayersList();
    this.routeActive.queryParams.subscribe(params => {
      if (params.month != null) {
        this.month = params.month;
        this.displayMonth = params.month.replace('-', ' ');
      }
    });
    this.getAccountReceivableYearDetailsData();
  }
  getAccountReceivableYearDetailsData() {
    const obj = {
      monthYear: this.month
    }
    this.sharedService.loadingChanged.next(true);
    this.collectionManagementService.getAccountReceivableYearDetailsData(
      this.sharedService.providerId,
      obj
    ).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          this.receivableData = event['body'];
          this.receivableData.map(ele => {
            const payerData = this.payersList.find(sele => sele.id === parseInt(ele.payerId));
            ele.payerName = payerData !== undefined ? payerData.name + ' ' + payerData.arName : ele.payerId;
            if (ele.initRejectionPerc !== null)
              ele.initRejectionPerc = ele.initRejectionPerc + '%';

            if (ele.totalReceivedPerc !== null)
              ele.totalReceivedPerc = ele.totalReceivedPerc + '%';
            return ele;
          });
          this.sharedService.loadingChanged.next(false);
        }
      }
    }, err => {
      if (err instanceof HttpErrorResponse) {
        this.sharedService.loadingChanged.next(false);
        this.receivableData = [];
        console.log(err);
      }
    });
  }

}
