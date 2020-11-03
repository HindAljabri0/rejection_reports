import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-claim-attachments-management',
  templateUrl: './claim-attachments-management.component.html',
  styleUrls: ['./claim-attachments-management.component.css']
})
export class ClaimAttachmentsManagementComponent implements OnInit {

  confirmButtonText:string = "Upload";

  constructor() { }

  ngOnInit() {
  }

}
