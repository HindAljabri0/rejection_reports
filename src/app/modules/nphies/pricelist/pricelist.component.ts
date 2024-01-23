import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator } from '@angular/material';
import { PricelistUploadComponent } from '../pricelist-upload/pricelist-upload.component';
import { SharedServices } from 'src/app/services/shared.services';
import { Location, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NphiesConfigurationService } from 'src/app/services/nphiesConfigurationService/nphies-configuration.service';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { PriceListModel } from 'src/app/models/price-list-model';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { NphiesPayersSelectorComponent } from 'src/app/components/reusables/nphies-payers-selector/nphies-payers-selector.component';
import { AuthService } from 'src/app/services/authService/authService.service';
import { UserPrivileges, getUserPrivileges, initState } from 'src/app/store/mainStore.reducer';

@Component({
  selector: 'app-pricelist',
  templateUrl: './pricelist.component.html',
  styles: []
})
export class PricelistComponent implements OnInit {

  @ViewChild('tpaPayers', { static: false }) tpaPayers: NphiesPayersSelectorComponent;
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  paginatorPagesNumbers: number[];
  paginatorPageSizeOptions = [10, 20, 50, 100];
  manualPage = null;
  page: number;
  pageSize: number;
  userPrivileges: UserPrivileges = initState.userPrivileges;

  FormPriceList: FormGroup = this.formBuilder.group({
    payerNphiesId: [''],
    effectiveDate: [''],
    uploadFromDate: [''],
    uploadToDate: [''],
    tpaNphiesId: ['']
  });

  isSubmitted = false;

  priceListModel: PaginatedResult<PriceListModel>;
  priceLists = [];
  payersList = [];
  isHeadOffice = false;
  headOfficeProviderId;
  providerId;
    store: any;
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private sharedService: SharedServices,
    private dialogService: DialogService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private location: Location,
    private nphiesConfigurationService: NphiesConfigurationService,
    private beneficiaryService: ProvidersBeneficiariesService,
    private routeActive: ActivatedRoute
  ) {

    this.routeActive.queryParams.subscribe(params => {

      if (params.payerNphiesId != null) {
        // tslint:disable-next-line:radix
        this.FormPriceList.controls.payerNphiesId.patchValue(params.payerNphiesId);
      }
      if (params.tpaNphiesId != null && params.tpaNphiesId != '') {
        // tslint:disable-next-line:radix
        this.FormPriceList.controls.tpaNphiesId.patchValue(params.tpaNphiesId);
      }

      if (params.effectiveDate != null) {
        const date = moment(moment(params.effectiveDate, 'DD-MM-YYYY')).format('YYYY-MM-DD');
        this.FormPriceList.controls.effectiveDate.patchValue(this.datePipe.transform(date, 'yyyy-MM-dd'));
      }

      if (params.uploadFromDate != null) {
        const date = moment(moment(params.uploadFromDate, 'DD-MM-YYYY')).format('YYYY-MM-DD');
        this.FormPriceList.controls.uploadFromDate.patchValue(this.datePipe.transform(date, 'yyyy-MM-dd'));
      }

      if (params.uploadToDate != null) {
        const date = moment(moment(params.uploadToDate, 'DD-MM-YYYY')).format('YYYY-MM-DD');
        this.FormPriceList.controls.uploadToDate.patchValue(this.datePipe.transform(date, 'yyyy-MM-dd'));
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

  ngOnInit() {
    this.store.select(getUserPrivileges).subscribe(privileges => this.userPrivileges = privileges);
    this.isHeadOffice = AuthService.isProviderHeadOffice();
    this.headOfficeProviderId = localStorage.getItem("headOfficeProviderId");
    this.providerId = localStorage.getItem("providerId");
    //console.log("isHeadOffice = " + AuthService.isProviderHeadOffice() + " headOfficeProviderId = " + this.headOfficeProviderId);
  }

  getPayerList(isFromUrl: boolean = false) {
    this.sharedService.loadingChanged.next(true);
    this.beneficiaryService.getPayers().subscribe(event => {
      if (event instanceof HttpResponse) {
        const body = event.body;
        if (body instanceof Array) {
          this.payersList = body;
          if (isFromUrl) {
            if (this.FormPriceList.valid) {
              this.onSubmit();
            }
          } else {
            this.sharedService.loadingChanged.next(false);
          }
        }
      }
    }, errorEvent => {
      this.sharedService.loadingChanged.next(false);
      if (errorEvent instanceof HttpErrorResponse) {

      }
    });
  }

  selectPayer(event) {
    console.log(JSON.stringify(event.value));
    if (event.value) {
      this.FormPriceList.patchValue({
        payerNphiesId: event.value.payerNphiesId,
        tpaNphiesId: event.value.organizationNphiesId != '-1' ? event.value.organizationNphiesId : event.value.payerNphiesId
        // destinationId: event.value.organizationNphiesId != '-1' ? event.value.organizationNphiesId : null
      });
    } else {
      this.FormPriceList.patchValue({
        payerNphiesId: '',
        tpaNphiesId: ''
        // destinationId: event.value.organizationNphiesId != '-1' ? event.value.organizationNphiesId : null
      });
    }
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
    if (this.priceListModel != null) {
      return this.priceListModel.totalElements;
    } else {
      return 0;
    }
  }

  downloadSample() {
    this.sharedService.loadingChanged.next(true);
    this.nphiesConfigurationService.downloadSample(this.sharedService.providerId).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body != null) {
          const data = new Blob([event.body as BlobPart], { type: 'application/octet-stream' });
          const FileSaver = require('file-saver');
          FileSaver.saveAs(data, 'PriceListSample.xlsx');
        }
      }
      this.sharedService.loadingChanged.next(false);
    }, err => {
      this.sharedService.loadingChanged.next(false);
      if (err instanceof HttpErrorResponse) {
        this.dialogService.openMessageDialog({
          title: '',
          message: `Unable to download File at this moment`,
          isError: true
        });
      }
    });
  }

  search() {
    this.page = 0;
    this.pageSize = 10;
    this.onSubmit();
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.FormPriceList.valid) {
      this.sharedService.loadingChanged.next(true);

      const model: any = {};

      if (this.FormPriceList.controls.payerNphiesId.value) {
        model.payerNphiesId = this.FormPriceList.controls.payerNphiesId.value;
      }

      if (this.FormPriceList.controls.effectiveDate.value) {
        model.effectiveDate = this.datePipe.transform(this.FormPriceList.controls.effectiveDate.value, 'yyyy-MM-dd');
      }

      if (this.FormPriceList.controls.uploadFromDate.value) {
        model.uploadFromDate = this.datePipe.transform(this.FormPriceList.controls.uploadFromDate.value, 'yyyy-MM-dd');
      }

      if (this.FormPriceList.controls.effectiveDate.value) {
        model.uploadToDate = this.datePipe.transform(this.FormPriceList.controls.uploadToDate.value, 'yyyy-MM-dd');
      }

      if (this.FormPriceList.controls.tpaNphiesId.value) {
        model.tpaNphiesId = this.FormPriceList.controls.tpaNphiesId.value;
      }
      if(model.tpaNphiesId == model.payerNphiesId){
        delete model.tpaNphiesId;
      }
      model.page = this.page;
      model.size = this.pageSize;
      const isHeadOffice = AuthService.isProviderHeadOffice();
      let headOfficeProviderId = localStorage.getItem("headOfficeProviderId");
      //console.log("print the value ="+headOfficeProviderId);

      if (!isHeadOffice && headOfficeProviderId) {
        model.headOfficeProviderId = headOfficeProviderId;
      }
      this.editURL(model.fromDate, model.toDate);
      this.nphiesConfigurationService.getPriceList(this.sharedService.providerId, model).subscribe((event: any) => {
        if (event instanceof HttpResponse) {
          const body = event.body;
          // this.transactions = body;
          this.priceListModel = new PaginatedResult(body, PriceListModel);
          this.priceLists = this.priceListModel.content;
          this.priceLists.forEach(x => {
            // tslint:disable-next-line:max-line-length
            x.payerName = this.payersList.find(y => y.nphiesId === x.payerNphiesId) ? this.payersList.filter(y => y.nphiesId === x.payerNphiesId)[0].englistName : '';
            x.tpaName = this.tpaPayers.findTPAName(x.tpaNphiesId);
          });
          if (this.paginator) {
            const pages = Math.ceil((this.priceListModel.totalElements / this.paginator.pageSize));
            this.paginatorPagesNumbers = Array(pages).fill(pages).map((x, i) => i);
            this.manualPage = this.priceListModel.number;
            this.paginator.pageIndex = this.priceListModel.number;
            this.paginator.pageSize = this.priceListModel.size;
          }
          this.sharedService.loadingChanged.next(false);
        }
      }, err => {
        this.sharedService.loadingChanged.next(false);
        console.log(err);
      });

    }
  }

  editURL(fromDate?: string, toDate?: string) {
    let path = '/nphies/pricelist?';

    if (this.FormPriceList.controls.payerNphiesId.value) {
      path += `payerNphiesId=${this.FormPriceList.controls.payerNphiesId.value}&`;
    }
    if (this.FormPriceList.controls.tpaNphiesId.value) {
      path += `tpaNphiesId=${this.FormPriceList.controls.tpaNphiesId.value}&`;
    }

    if (this.FormPriceList.controls.effectiveDate.value) {
      path += `effectiveDate=${this.datePipe.transform(this.FormPriceList.controls.effectiveDate.value, 'dd-MM-yyyy')}&`;
    }

    if (this.FormPriceList.controls.uploadFromDate.value) {
      path += `uploadFromDate=${this.datePipe.transform(this.FormPriceList.controls.uploadFromDate.value, 'dd-MM-yyyy')}&`;
    }

    if (this.FormPriceList.controls.uploadToDate.value) {
      path += `uploadToDate=${this.datePipe.transform(this.FormPriceList.controls.uploadToDate.value, 'dd-MM-yyyy')}&`;
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

  RedirectToDetails(payerNphiesId: string, uploadedDate: string, priceListId: number) {
    uploadedDate = this.datePipe.transform(uploadedDate, 'dd/MM/yyyy');
    this.router.navigate(['/nphies/pricelist-details/'], { queryParams: { payerNphiesId: payerNphiesId, uploadedDate: uploadedDate, priceListId: priceListId } });
  }

  openUploadPricelistDialog() {
    const dialogRef = this.dialog.open(PricelistUploadComponent, {
      panelClass: ['primary-dialog', 'dialog-lg']
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.FormPriceList.patchValue({
        //   payerNphiesId: result,
        //   effectiveDate: '',
        //   uploadFromDate: '',
        //   uploadToDate: ''
        // });
        this.onSubmit();
      }
    });
  }

  DeletePriceList(priceListId) {
    this.dialogService.openMessageDialog(
      new MessageDialogData('Delete Price List?',
        `This will delete price list. Are you sure you want to delete it? This cannot be undone.`,
        false,
        true))
      .subscribe(result => {
        if (result === true) {
          this.sharedService.loadingChanged.next(true);

          // tslint:disable-next-line:max-line-length
          this.nphiesConfigurationService.deletePriceList(this.sharedService.providerId, priceListId).subscribe(event => {
            if (event instanceof HttpResponse) {
              if (event.status === 200) {
                const body: any = event.body;
                this.dialogService.showMessage('Success', body.message, 'success', true, 'OK');
                this.onSubmit();
              }
              this.sharedService.loadingChanged.next(false);
            }

          }, error => {
            this.sharedService.loadingChanged.next(false);
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

  updateFromDate() {
    this.FormPriceList.controls.uploadToDate.setValue('');
  }
}
