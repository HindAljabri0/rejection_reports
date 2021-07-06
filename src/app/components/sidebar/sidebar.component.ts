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
  isAdmin = false;
  isProvider = false;
  isProviderAdmin = false;
  isRevenueVisible: boolean = false;

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
    const privilege = localStorage.getItem('101101');
    this.isAdmin = privilege != null && (privilege.includes('|22') || privilege.startsWith('22'));
    const providerId = localStorage.getItem('provider_id');
    try {
      const userPrivileges = localStorage.getItem(`${providerId}101`);
      this.isProviderAdmin = userPrivileges.split('|').includes('3.0');
      this.isRevenueVisible = userPrivileges.split('|').includes('24.0') || userPrivileges.split('|').includes('24.1');
    } catch (error) {
      this.isProviderAdmin = false;
    }
    this.isProvider = this.sharedServices.getPayersList().some(payer => {
      const userPrivileges = localStorage.getItem(`${providerId}${payer.id}`);
      return userPrivileges != null && userPrivileges.split('|').includes('3.0');
    });
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

}
