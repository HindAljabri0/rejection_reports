import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/authService/authService.service';
import { SharedServices } from 'src/app/services/shared.services';
import { getUserPrivileges, initState, UserPrivileges } from 'src/app/store/mainStore.reducer';
import { environment } from 'src/environments/environment';

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


    constructor(private auth: AuthService, private sharedServices: SharedServices, private store: Store) {
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

    toggleNav() {
        document.body.classList.remove('nav-open');
        document.getElementsByTagName('html')[0].classList.remove('nav-open');
    }
    get NewAuthTransactions() {
        const transCount = this.sharedServices.unReadProcessedCount + this.sharedServices.unReadComunicationRequestCount;
        return transCount;
    }
    get NewAPAProcessed() {
        return this.sharedServices.unReadProcessedApaCount;
      }
    get NewAPAComunicationRequests() {
        return this.sharedServices.unReadApaComunicationRequestCount;
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
        return this.sharedServices.unReadRecentCount;
    }

    get NewClaimTransactions() {
        const transCount = this.sharedServices.unReadClaimProcessedCount + this.sharedServices.unReadClaimComunicationRequestCount;
        return transCount;
    }
}
