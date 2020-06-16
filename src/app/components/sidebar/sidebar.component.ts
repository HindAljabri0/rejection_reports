import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authService/authService.service';
import { UploadService } from 'src/app/services/claimfileuploadservice/upload.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  providerId: string;
  isAdmin: boolean = false;

  constructor(private auth: AuthService, private uploadService: UploadService) {
    this.auth.isUserNameUpdated.subscribe(updated => {
      this.init();
    });
  }

  ngOnInit() {
    this.init();
  }

  init(){
    this.providerId = this.auth.getProviderId();
    let privilege = localStorage.getItem('101101');
    this.isAdmin = privilege != null && (privilege.includes('|22') || privilege.startsWith('22'));
  }

  get uploadProgress(): number {
    return this.uploadService.progress.percentage;
  }

  get uploadSummaryIsNotNull(): boolean {
    return this.uploadService.summary.uploadSummaryID != null;
  }

}
