import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-claim-attachments-management',
  templateUrl: './claim-attachments-management.component.html',
  styleUrls: ['./claim-attachments-management.component.css']
})
export class ClaimAttachmentsManagementComponent implements OnInit {

  confirmButtonText: string = "Upload";

  currentPage: number = 0;
  maxPages: number = 0;

  claims: { id: number, referenceNumber: string, memberId: string }[] = [];

  attachments: { file: File, type?: string, isSelected: boolean }[] = [];

  selectedClaim: number;

  selectedClaimAssignedAttachments: { attachment, type: string }[] = [];

  constructor() { }

  ngOnInit() {
  }

}
