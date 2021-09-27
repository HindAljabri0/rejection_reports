import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authService/authService.service';
import { UploadService } from 'src/app/services/claimfileuploadservice/upload.service';
import { SharedServices } from 'src/app/services/shared.services';
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
  isRevenueVisible = false;

  constructor(private auth: AuthService, private uploadService: UploadService, private sharedServices: SharedServices) {
    this.auth.isUserNameUpdated.subscribe(updated => {
      this.init();
    });
  }

  ngOnInit() {
    this.init();
    this.envProd = (environment.name == 'oci_prod' || environment.name == 'prod');
    this.envStaging = (environment.name == 'oci_staging' || environment.name == 'staging');
  }

  init() {
    this.providerId = this.auth.getProviderId();
    const providerId = localStorage.getItem('provider_id');
    try {
      const userPrivileges = localStorage.getItem(`${providerId}101`);
      this.isRevenueVisible = userPrivileges.split('|').includes('24.0') || userPrivileges.split('|').includes('24.1');
    } catch (error) {
    }

  }

  get uploadProgress(): number {
    return this.uploadService.progress.percentage;
  }

  get uploadSummaryIsNotNull(): boolean {
    return this.uploadService.summary.uploadSummaryID != null;
  }

  toggleNav() {
    document.body.classList.remove('nav-open');
    document.getElementsByTagName('html')[0].classList.remove('nav-open');
  }


  get isAdmin() {
    return this.sharedServices.isAdmin;
  }
  get isProvider() {
    return this.sharedServices.isProvider;
  }
  get isProviderAdmin() {
    return this.sharedServices.isAdminOfProvider;
  }
  get isRcmUser() {
    return this.sharedServices.isRcmUser;
  }
  get hasAllNphiesPrivilege() {
    return this.sharedServices.hasAllNphiesPrivilege;
  }
  get hasNphiesBeneficiaryPrivilege() {
    return this.sharedServices.hasNphiesBeneficiaryPrivilege;
  }
  get hasAnyNphiesPrivilege() {
    return this.hasAllNphiesPrivilege || this.hasNphiesBeneficiaryPrivilege;
  }
  get hasRcmPrivilege(){
    return this.sharedServices.hasRcmPrivilege;

  }

  get IsNewAuthTransactions() {
    if (this.sharedServices.unReadProcessedCount > 0 || this.sharedServices.unReadComunicationRequestCount > 0) {
      return true;
    } else {
      return false;
    }
  }
}
