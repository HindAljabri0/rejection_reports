import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authService/authService.service';
import { UploadService } from 'src/app/services/claimfileuploadservice/upload.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  providerId: string;
  doNotShowGlobMedIn: string[] = ['oci_prod', 'oci_staging'];
  envName = environment.name;
  isAdmin = false;
  isProviderAdmin = false;

  constructor(private auth: AuthService, private uploadService: UploadService) {
    this.auth.isUserNameUpdated.subscribe(updated => {
      this.init();
    });
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.providerId = this.auth.getProviderId();
    const privilege = localStorage.getItem('101101');
    this.isAdmin = privilege != null && (privilege.includes('|22') || privilege.startsWith('22'));
    try {
      const providerId = localStorage.getItem('provider_id');
      const userPrivileges = localStorage.getItem(`${providerId}101`);
      this.isProviderAdmin = userPrivileges.split('|').includes('3.0');
    } catch (error) {
      this.isProviderAdmin = false;
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

}
