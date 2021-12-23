import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { CertificateConfigurationProvider } from 'src/app/models/certificateConfigurationProvider';
import { SuperAdminService } from 'src/app/services/administration/superAdminService/super-admin.service';
import { SettingsService } from 'src/app/services/settingsService/settings.service';
import { SharedServices } from 'src/app/services/shared.services';
import { CertificateConfigurationModelComponent } from '../certificate-configuration-model/certificate-configuration-model.component';

@Component({
  selector: 'app-certificate-configuration',
  templateUrl: './certificate-configuration.component.html',
  styleUrls: ['./certificate-configuration.component.css']
})
export class CertificateConfigurationComponent implements OnInit {
  providerController: FormControl = new FormControl();
  enterPassword:any;
  filteredProviders: any[] = [];
  providers: any[] = [];
  selectedProvider: string;
  certificateConfigurationProvider =new CertificateConfigurationProvider();

  
  constructor(
    private dialog: MatDialog,
    private sharedServices: SharedServices,
    private settingsService: SettingsService) { }

  ngOnInit() {
    this.sharedServices.loadingChanged.next(true);
    this.settingsService.getProviders().subscribe(event => {
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



  openP12(event) {

  
    const dialogRef = this.dialog.open(CertificateConfigurationModelComponent,
      {
        panelClass: ['primary-dialog'],
        autoFocus: false,
        data: {
          file: event.target.files[0],
          providerId: this.sharedServices.providerId,
          selectedProviderId: this.selectedProvider,
          password: this.certificateConfigurationProvider.password
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
      `${provider.switchAccountId} | ${provider.code} | ${provider.name}`.toLowerCase().includes(this.providerController.value.toLowerCase())
    );
    this.selectedProvider = this.providerController.value === '' ? undefined : this.selectedProvider;
  }


}