import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfiguartionModalComponent } from '../configuartion-modal/configuartion-modal.component';
import { FormControl } from '@angular/forms';
import { SharedServices } from 'src/app/services/shared.services';
import { SuperAdminService } from 'src/app/services/administration/superAdminService/super-admin.service';
import { HttpResponse } from '@angular/common/http';
import { Location } from '@angular/common';

@Component({
  selector: 'app-provider-mapping',
  templateUrl: './provider-mapping.component.html',
  styles: []
})
export class ProviderMappingComponent implements OnInit {
  providerController: FormControl = new FormControl();
  filteredProviders: any[] = [];
  providers: any[] = [];
  selectedProvider: string;
  constructor(
    private dialog: MatDialog,
    private sharedServices: SharedServices,
    private superAdmin: SuperAdminService,
    private location: Location) { }

  ngOnInit() {
    this.sharedServices.loadingChanged.next(true);
    this.superAdmin.getProviders().subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body instanceof Array) {
          this.providers = event.body;
          this.filteredProviders = this.providers;
        }
        this.sharedServices.loadingChanged.next(false);

      }
    }, error => {
      this.sharedServices.loadingChanged.next(false);
      console.log(error);
    });
  }

  selectProvider(providerId: string = null) {
    if (providerId !== null)
      this.selectedProvider = providerId;
    else {
      const providerId = this.providerController.value.split('|')[0].trim();
      this.selectedProvider = providerId;
    }
  }

  openCSV(event) {
    const dialogRef = this.dialog.open(ConfiguartionModalComponent,
      {
        panelClass: ['primary-dialog'],
        autoFocus: false,
        data: {
          file: event.target.files[0],
          providerId: this.sharedServices.providerId,
          selectedProviderId: this.selectedProvider
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    }, error => {

    });

  }
  get isLoading() {
    return this.sharedServices.loading;
  }


  clearFiles(event) {
    event.target.value = '';
  }
  updateFilter() {
    this.filteredProviders = this.providers.filter(provider =>
      `${provider.switchAccountId} | ${provider.cchiId} | ${provider.code} | ${provider.name}`.toLowerCase()
        .includes(this.providerController.value.toLowerCase()))
    this.selectedProvider = this.providerController.value === '' ? undefined : this.selectedProvider;
  }

}
