import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-claimfileupload',
  templateUrl: './claimfileupload.component.html',
  styleUrls: ['./claimfileupload.component.css']
})
export class ClaimfileuploadComponent implements OnInit {

  selectedFile:File;

  constructor() { }

  ngOnInit() {
  }

  detectFiles(event) {
    console.log("testing");
    this.selectedFile = event.target.files.item(0);
  }

}
