import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SuperAdminService } from 'src/app/services/administration/superAdminService/super-admin.service';
import { SharedServices } from 'src/app/services/shared.services';
import { AuthService } from 'src/app/services/authService/authService.service';
import { Router } from '@angular/router';
import { takeUntil, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-switch-provider-component',
  templateUrl: './switch-provider-component.component.html'
})
export class SwitchProviderComponentComponent implements OnInit {
  providers: any[] = [];
  filteredProviders: any[] = [];
  providerController: FormControl = new FormControl();
  error: string;
  selectedProvider: string;

  constructor(
    private superAdmin: SuperAdminService,
    private authService: AuthService,
    private sharedServices: SharedServices,
    private router: Router

  ) {
    sharedServices.loadingChanged.next(true);
  }

  ngOnInit() {
    this.superAdmin.getProviders().subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body instanceof Array) {
          this.providers = event.body;
          this.filteredProviders = this.providers;

          this.sharedServices.loadingChanged.next(false);
        }
      }
    }, error => {
      this.sharedServices.loadingChanged.next(false);
      this.error = 'could not load providers, please try again later.';
      console.log(error);
    });
  }
  get isLoading() {
    return this.sharedServices.loading;
  }

  selectProvider(providerId: string = null) {
    if (providerId !== null) {
      this.selectedProvider = providerId;
    } else {
      const providerId = this.providerController.value.split('|')[0].trim();
      this.selectedProvider = providerId;
    }
  }

  updateFilter() {
    this.filteredProviders = this.providers.filter(provider =>
      `${provider.switchAccountId} | ${provider.cchiId} | ${provider.code} | ${provider.name}`.toLowerCase()
        .includes(this.providerController.value.toLowerCase())
    );
  }

  switch() {
    if (!this.isLoading) {
      this.sharedServices.loadingChanged.next(true);
      this.authService.getSwitchUserToken(this.selectedProvider, 'o').subscribe(event => {
        if (event instanceof HttpResponse) {
          this.authService.isUserNameUpdated.subscribe(updated => {
            if (updated) {
              this.router.navigate(['/']).then(() => {
                location.reload();
              });
              this.sharedServices.loadingChanged.next(false);
            }
          });
          this.authService.setTokens(event.body);
        }
      }, error => {
        this.sharedServices.loadingChanged.next(false);
        console.log(error);
      })
    }
  }
}
