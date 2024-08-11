import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/authService/authService.service';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { SharedServices } from 'src/app/services/shared.services';
import { getUserPrivileges, initState, UserPrivileges } from 'src/app/store/mainStore.reducer';
import { environment } from 'src/environments/environment';
import { ConfirmationAlertDialogComponent } from '../confirmation-alert-dialog/confirmation-alert-dialog.component';
import { MatDialog,MatDialogRef, MatDialogConfig } from '@angular/material';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styles: []
})
export class SidebarComponent implements OnInit {

    providerId: string;
    envProd = false;
    envStaging = false;

    userPrivileges: UserPrivileges = initState.userPrivileges;
    LegacyUrl: string;


    constructor(private auth: AuthService, private sharedServices: SharedServices, private dialog: MatDialog, private router: Router,  private dialogService: DialogService, private store: Store) {
        this.LegacyUrl = environment.legacyUrl;
        this.auth.isUserNameUpdated.subscribe(updated => {
            this.init();
        });
    }

    ngOnInit() {
        this.init();
        this.store.select(getUserPrivileges).subscribe(privileges => this.userPrivileges = privileges);
        this.envProd = (environment.name == 'oci_prod' || environment.name == 'prod');
        this.envStaging = (environment.name == 'oci_staging' || environment.name == 'staging');

  }

    init() {
        this.providerId = this.auth.getProviderId();
    }

    get hasAnyNphiesPrivilege() {
        const keys = Object.keys(this.userPrivileges.ProviderPrivileges.NPHIES);
        return keys.some(key => this.userPrivileges.ProviderPrivileges.NPHIES[key]);
    }
    redirectToLegacy() {
        const dialogRef: MatDialogRef<ConfirmationAlertDialogComponent> = this.dialog.open(
            ConfirmationAlertDialogComponent,
            {
                width: '600px', 
              data: {
                mainMessage: 'Important Information: You will be redirected to Waseel Eclaims',
                subMessage: 'Please note that by clicking "OK" you will be redirected to Waseel Eclaims URL. Please remember to bookmark the new URL for future login convenience.',
                mode: 'alert',
                hideNoButton: true,
                yesButtonText: 'OK'
              }
            }
          );
        
           dialogRef.afterClosed().subscribe(result => {
            if (result) {
                window.open(this.LegacyUrl, '_blank');
              
            }
          });

    }
  
    toggleNav() {
        document.body.classList.remove('nav-open');
        document.getElementsByTagName('html')[0].classList.remove('nav-open');
    }
    get NewAuthTransactions() {
        const transCount = this.sharedServices.unReadProcessedTotalCount + this.sharedServices.unReadComunicationRequestTotalCount;
        return transCount;
    }
    get NewAPAProcessed() {
        return this.sharedServices.unReadProcessedApaTotalCount;
      }
      get PrescriberProcessed() {
        return this.sharedServices.unReadPrescriberProcessedTotalCount;
      }
      get PrescriberComunicationRequests() {
        return this.sharedServices.unReadPrescriberCommunicationRequestTotalCount;
      } 
      get NewPrescriberTransactions() {
        const transCount = this.PrescriberProcessed + this.PrescriberComunicationRequests;
        return transCount;
    }
    get NewAPAComunicationRequests() {
        return this.sharedServices.unReadApaComunicationRequestTotalCount;
      }
      get TotalAPATransactions(){
        const transCount = this.NewAPAProcessed + this.NewAPAComunicationRequests;
        return transCount;  
      }
    get TotalPreAuthTransactions(){
        const transCount = this.NewAuthTransactions + this.TotalAPATransactions;
        return transCount;
     }
    get RecentReconciliations() {
        return this.sharedServices.unReadRecentTotalCount;
    }

    get NewClaimTransactions() {
        const transCount = this.sharedServices.unReadClaimProcessedTotalCount + this.sharedServices.unReadClaimComunicationRequestTotalCount;
        return transCount;
    }
}
