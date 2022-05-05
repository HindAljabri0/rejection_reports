import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { SharedServices } from 'src/app/services/shared.services';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { MatPaginator } from '@angular/material';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { PriceDetailModel } from 'src/app/models/price-detail-model';
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';

@Component({
  selector: 'app-pricelist-details',
  templateUrl: './pricelist-details.component.html',
  styles: []
})
export class PricelistDetailsComponent implements OnInit {

  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  paginatorPagesNumbers: number[] = [];
  paginatorPageSizeOptions = [10, 20, 50, 100];
  manualPage = null;
  page = 0;
  pageSize = 10;

  priceListId: string;
  payerName: string;
  payerNphiesId: string;
  uploadedDate: string;
  searchQuery: string;

  typeList = this.sharedDataService.itemTypeList;

  priceDetailModel: PaginatedResult<PriceDetailModel>;
  priceDetails = [];

  priceList = [];

  constructor(
    private activateRoute: ActivatedRoute,
    private sharedDataService: SharedDataService,
    private sharedServices: SharedServices,
    private beneficiaryService: ProvidersBeneficiariesService,
    private providerNphiesSearchService: ProviderNphiesSearchService) {

    this.priceListId = this.activateRoute.snapshot.queryParams.priceListId;
    this.payerNphiesId = this.activateRoute.snapshot.queryParams.payerNphiesId;
    this.uploadedDate = this.activateRoute.snapshot.queryParams.uploadedDate;
  }

  ngOnInit() {
    this.getPayerList();
    this.searchItems();
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
    this.searchItems();
  }

  paginationChange(event) {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  get paginatorLength() {
    if (this.priceDetailModel != null) {
      return this.priceDetailModel.totalElements;
    } else {
      return 0;
    }
  }

  getPayerList() {
    this.sharedServices.loadingChanged.next(true);
    this.beneficiaryService.getPayers().subscribe(event => {
      if (event instanceof HttpResponse) {
        const body = event.body;
        if (body instanceof Array) {
          // tslint:disable-next-line:max-line-length
          this.payerName = body.filter(x => x.nphiesId === this.payerNphiesId)[0] ? body.filter(x => x.nphiesId === this.payerNphiesId)[0].englistName : '';
        }
      }
    }, errorEvent => {
      this.sharedServices.loadingChanged.next(false);
      if (errorEvent instanceof HttpErrorResponse) {

      }
    });
  }

  search() {
    this.page = 0;
    this.pageSize = 10;
    this.searchItems();
  }

  searchItems() {
    this.sharedServices.loadingChanged.next(true);
    // const RequestDate = this.data.dateOrdered;

    // tslint:disable-next-line:max-line-length
    this.providerNphiesSearchService.searchPriceList(this.sharedServices.providerId, this.priceListId, this.searchQuery, this.page, this.pageSize).subscribe(event => {
      if (event instanceof HttpResponse) {
        const body = event.body;
        this.priceDetailModel = new PaginatedResult(body, PriceDetailModel);
        this.priceDetails = this.priceDetailModel.content;
        const pages = Math.ceil((this.priceDetailModel.totalElements / this.pageSize));
        this.paginatorPagesNumbers = Array(pages).fill(pages).map((x, i) => i);
        this.manualPage = this.priceDetailModel.number;
        this.page = this.priceDetailModel.number;
        this.pageSize = this.priceDetailModel.size;
        this.sharedServices.loadingChanged.next(false);
      }
    }, err => {
      this.sharedServices.loadingChanged.next(false);
      console.log(err);
    });
  }

}
