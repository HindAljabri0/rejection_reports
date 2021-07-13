import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddProviderContractDialogComponent } from '../add-provider-contract-dialog/add-provider-contract-dialog.component';
import { FormControl } from '@angular/forms';
import { SharedServices } from 'src/app/services/shared.services';
import { HttpResponse } from '@angular/common/http';
import { SuperAdminService } from 'src/app/services/administration/superAdminService/super-admin.service';
import { AttachmentViewDialogComponent } from 'src/app/components/dialogs/attachment-view-dialog/attachment-view-dialog.component';
import { AttachmentViewData } from 'src/app/components/dialogs/attachment-view-dialog/attachment-view-data';

@Component({
  selector: 'app-provider-contract',
  templateUrl: './provider-contract.component.html',
  styles: []
})
export class ProviderContractComponent implements OnInit {
  providers: any[] = [];
  filteredProviders: any[] = [];
  providerController: FormControl = new FormControl();
  selectedProvider: string;
  errors: string;
  pageNo = 0;
  pageSize = 10;
  totalPages = 0;
  providerLoader: boolean = false;
  paymentData: any[] = [];
  payersList: { id: number; name: string; arName: string; }[];
  associatedPayers: { switchAccountId: number; name: string; arabicName: string; category: string; hasAssociatedPriceList: boolean; }[];
  constructor(private dialog: MatDialog, private sharedServices: SharedServices, private superAdmin: SuperAdminService) { }

  ngOnInit() {
    this.sharedServices.loadingChanged.next(true);
    this.providerLoader = true;
    this.superAdmin.getProviders().subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body instanceof Array) {
          this.providers = event.body;
          this.filteredProviders = this.providers;
          if (!location.href.endsWith('providers')) {
            const paths = location.href.split('/');
            this.selectedProvider = paths[paths.length - 1];

            const provider = this.providers.find(provider => provider.switchAccountId == this.selectedProvider);
            if (provider != undefined) {
              this.providerController.setValue(`${provider.switchAccountId} | ${provider.code} | ${provider.name}`);
            } else {
              this.sharedServices.loadingChanged.next(false);
              this.providerLoader = false;
            }
          } else {
            this.sharedServices.loadingChanged.next(false);
            this.providerLoader = false;
          }
        }
      }
    }, error => {
      this.sharedServices.loadingChanged.next(false);
      this.providerLoader = false;
      this.errors = 'could not load providers, please try again later.';
      console.log(error);
    });
  }


  openAddContractDialog(item = null) {
    const isEditData = item !== null ? true : false;
    let dialogRef = this.dialog.open(AddProviderContractDialogComponent,
      {
        panelClass: ['primary-dialog', 'dialog-lg'],
        data: {
          providers: this.providers,
          isEditData: isEditData,
          editData: item
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (dialogRef.componentInstance.closeStatus) {
        this.getPaymentData();
      }
    }, error => {

    });

  }
  updateFilter() {
    this.filteredProviders = this.providers.filter(provider =>
      `${provider.switchAccountId} | ${provider.code} | ${provider.name}`.toLowerCase().includes(this.providerController.value.toLowerCase())
    );
  }
  selectProvider(providerId: string) {
    this.selectedProvider = providerId;
    this.getAssociatedPayers();
  }
  getAssociatedPayers() {
    if (this.selectedProvider == null || this.selectedProvider == '') { return; }
    this.sharedServices.loadingChanged.next(true);
    this.superAdmin.getAssociatedPayers(this.selectedProvider).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body instanceof Array) {
          // this.sharedServices.loadingChanged.next(false);
          this.associatedPayers = event.body;
          this.getPaymentData();
        }
      }
    }, err => {
      this.sharedServices.loadingChanged.next(false);
    });
  }

  getPaymentData() {
    this.sharedServices.loadingChanged.next(true);

    this.superAdmin.getPayerPaymentContractDetailsData(this.selectedProvider).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        const body = event['body'];
        const data = JSON.parse(body);
        this.paymentData = data.map((ele) => {
          const data = this.associatedPayers.find((subele) => subele.switchAccountId === parseInt(ele.payerId));
          ele.payerName = data.name;
          return ele;
        })
        this.sharedServices.loadingChanged.next(false);
      }
    }, err => {
      this.sharedServices.loadingChanged.next(false);
      this.paymentData = [];
      console.log(err);
    });
  }

  get isLoading() {
    return this.sharedServices.loading;
  }
  viewAttachment(item) {
    this.dialog.open<AttachmentViewDialogComponent, AttachmentViewData, any>(AttachmentViewDialogComponent, {
      data: { filename: 'provider_' + item.providerId + '_payment_contract.pdf', attachment: item.agreementCopy }
    })
  }

}
