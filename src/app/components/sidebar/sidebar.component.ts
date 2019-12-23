import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authService/authService.service';
import { UploadService } from 'src/app/services/claimfileuploadservice/upload.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  providerId:string;

  constructor(private auth:AuthService, private uploadService:UploadService) {
    this.auth.isUserNameUpdated.subscribe(updated=>{
      this.providerId = this.auth.getProviderId();
    });
  }

  ngOnInit() {
    this.providerId = this.auth.getProviderId();
  }

  get uploadProgress():number {
    return this.uploadService.progress.percentage;
  }

  get uploadSummaryIsNotNull():boolean{
    return this.uploadService.summary.uploadSummaryID != null;
  }

}
