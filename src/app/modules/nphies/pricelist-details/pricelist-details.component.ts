import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { SharedServices } from 'src/app/services/shared.services';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { MatPaginator, MatDialog } from '@angular/material';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { PriceDetailModel } from 'src/app/models/price-detail-model';
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';
import { Location, DatePipe } from '@angular/common';
import { AddPricelistDialogComponent } from './add-pricelist-dialog/add-pricelist-dialog.component';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { NphiesConfigurationService } from 'src/app/services/nphiesConfigurationService/nphies-configuration.service';
import { AuthService } from 'src/app/services/authService/authService.service';

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
  isHeadOffice;
  headOfficeProviderId;
  providerId;
    nphiesId: any;
  constructor(
    private dialog: MatDialog,
    private activateRoute: ActivatedRoute,
    private sharedDataService: SharedDataService,
    private location: Location,
    private sharedServices: SharedServices,
    private beneficiaryService: ProvidersBeneficiariesService,
    private providerNphiesSearchService: ProviderNphiesSearchService,
    private nphiesConfigurationService: NphiesConfigurationService,
    private dialogService: DialogService) {

    this.priceListId = this.activateRoute.snapshot.queryParams.priceListId;
    this.payerNphiesId = this.activateRoute.snapshot.queryParams.payerNphiesId;
    this.uploadedDate = this.activateRoute.snapshot.queryParams.uploadedDate;
  }

  ngOnInit() {
    this.getPayerList();
    this.searchItems();
    this.isHeadOffice = AuthService.isProviderHeadOffice();
    this.headOfficeProviderId = localStorage.getItem("headOfficeProviderId");
    this.providerId = localStorage.getItem("providerId");
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
          this.nphiesId = body.filter(x => x.nphiesId === this.payerNphiesId)[0] ? body.filter(x => x.nphiesId === this.payerNphiesId)[0].nphiesId : '';
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

  typeName(type) {
    return this.typeList.filter(x => x.value === type)[0] ? this.typeList.filter(x => x.value === type)[0].name : '-';
  }

  openAddPricelistDialog(priceDetailData: any = null) {
    const dialogRef = this.dialog.open(AddPricelistDialogComponent, {
      panelClass: ['primary-dialog', 'dialog-sm'],
      autoFocus: false,
      data: {
        priceListId: this.priceListId,
        priceDetail: priceDetailData,
        nphiesId:  this.nphiesId,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.page = 0;
        this.pageSize = 10;
        this.searchItems();
      }
    });
  }

  DeletePriceDetail(priceDetail: any) {
    this.dialogService.openMessageDialog(
      new MessageDialogData('Delete Price List Service?',
        `This will delete price list service. Are you sure you want to delete it? This cannot be undone.`,
        false,
        true))
      .subscribe(result => {
        if (result === true) {
          const model: any = {};
          model.serviceType = priceDetail.itemType;
          model.serviceCode = priceDetail.code;
          model.nonStandardCode = priceDetail.nonStandardCode;
          model.nonStandardDesc = priceDetail.nonStandardDescription;
          model.unitPrice = priceDetail.unitPrice;
          model.factor = priceDetail.factor;

          this.sharedServices.loadingChanged.next(true);

          // tslint:disable-next-line:max-line-length
          this.nphiesConfigurationService.deletePriceDetail(this.sharedServices.providerId, this.priceListId, model).subscribe(event => {
            if (event instanceof HttpResponse) {
              if (event.status === 200) {
                const body: any = event.body;
                this.dialogService.showMessage('Success', body.message, 'success', true, 'OK');
                this.searchItems();
              }
              this.sharedServices.loadingChanged.next(false);
            }

          }, error => {
            this.sharedServices.loadingChanged.next(false);
            if (error instanceof HttpErrorResponse) {
              if (error.status === 400) {
                this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', error.error.errors);
              } else if (error.status === 404) {
                this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK');
              } else if (error.status === 500) {
                this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK');
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
      });
  }

  goBack() {
    this.location.back();
  }

}
