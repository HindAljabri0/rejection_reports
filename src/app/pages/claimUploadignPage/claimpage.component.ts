import { Component, OnInit } from '@angular/core';
import { UploadService } from '../../services/claimfileuploadservice/upload.service';
import { UploadSummary } from 'src/app/models/uploadSummary';
import { Location } from '@angular/common';

@Component({
  selector: 'app-claimpage',
  templateUrl: './claimpage.component.html',
  styleUrls: ['./claimpage.component.css']
})
export class ClaimpageComponent implements OnInit {

  constructor(private uploadService:UploadService, public location: Location) { }

  ngOnInit() {
  }

  get summary(): UploadSummary {
    if(this.location.path().includes("summary"))
      return this.uploadService.summary;
    else
      return new UploadSummary();
  }

}
