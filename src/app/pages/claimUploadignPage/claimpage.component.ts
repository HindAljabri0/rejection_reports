import { Component, OnInit } from '@angular/core';
import { UploadService } from '../../services/claimfileuploadservice/upload.service';
import { UploadSummary } from 'src/app/models/uploadSummary';

@Component({
  selector: 'app-claimpage',
  templateUrl: './claimpage.component.html',
  styleUrls: ['./claimpage.component.css']
})
export class ClaimpageComponent implements OnInit {

  constructor(private uploadService:UploadService) { }

  ngOnInit() {
  }

  get summary(): UploadSummary {
    return this.uploadService.summary;
  }

}
