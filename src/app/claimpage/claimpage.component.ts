import { Component, OnInit } from '@angular/core';
import { UploadService, Summary } from './claimfileuploadservice/upload.service';

@Component({
  selector: 'app-claimpage',
  templateUrl: './claimpage.component.html',
  styleUrls: ['./claimpage.component.css']
})
export class ClaimpageComponent implements OnInit {

  constructor(private uploadService:UploadService) { }

  ngOnInit() {
  }

  get summary(): Summary {
    return this.uploadService.summary;
  }

}
