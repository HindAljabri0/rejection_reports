import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SuperAdminService } from 'src/app/services/administration/superAdminService/super-admin.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Location } from '@angular/common';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-providers-config',
  templateUrl: './providers-config.component.html',
  styleUrls: ['./providers-config.component.css']
})
export class ProvidersConfigComponent implements OnInit {

  providers: any[] = [];
  filteredProviders: any[] = [];
  providerController: FormControl = new FormControl();
  providersError: String;
  payersError: String;

  selectedProvider: string;
  associatedPayers: any[] = [];

  constructor(private superAdmin: SuperAdminService, private router: Router, private sharedServices: SharedServices, private location: Location) {
    sharedServices.loadingChanged.next(true);
  }



  ngOnInit() {

    this.superAdmin.getProviders().subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body instanceof Array) {
          this.providers = event.body;
          this.filteredProviders = this.providers;
          if (!location.href.endsWith('providers')) {
            let paths = location.href.split('/');
            this.selectedProvider = paths[paths.length - 1];

            let provider = this.providers.find(provider => provider.switchAccountId == this.selectedProvider);
            if (provider != undefined) {
              console.log(provider);
              this.providerController.setValue(`${provider.switchAccountId} | ${provider.name}`);
              this.updateFilter();
              this.getAssociatedPayers();
            } else this.sharedServices.loadingChanged.next(false);
          } else this.sharedServices.loadingChanged.next(false);
        }
      }
    }, error => {
      this.sharedServices.loadingChanged.next(false);
      this.providersError = 'could not load providers, please try again later.'
      console.log(error);
    });
  }

  updateFilter() {
    this.filteredProviders = this.providers.filter(provider =>
      `${provider.switchAccountId} | ${provider.name}`.toLowerCase().includes(this.providerController.value.toLowerCase())
    );
  }

  selectProvider(providerId: string) {
    this.selectedProvider = providerId;
    this.location.go(`/administration/config/providers/${providerId}`);
    this.getAssociatedPayers();
  }

  getAssociatedPayers() {
    if(this.selectedProvider == null || this.selectedProvider == '') return;
    this.sharedServices.loadingChanged.next(true);
    this.superAdmin.getAssociatedPayers(this.selectedProvider).subscribe(event => {
      if (event instanceof HttpResponse) {
        if(event.body instanceof Array){
          this.associatedPayers = event.body;
        }
        if(this.associatedPayers.length == 0){
          this.payersError = 'There are no payers associated with this provider.';
        }
        this.sharedServices.loadingChanged.next(false);
      }
    }, error => {
      if(error instanceof HttpErrorResponse){
        if(error.status == 404){
          this.payersError = 'There are no payers associated with this provider.';
        } else {
          this.payersError = 'Could not load payers, please try again later.';
        }
      }
      
      console.log(error);
      this.sharedServices.loadingChanged.next(false);
    })
  }

  get isLoading() {
    return this.sharedServices.loading;
  }

}
