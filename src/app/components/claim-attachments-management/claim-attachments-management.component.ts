import { Component, OnInit } from '@angular/core';
import { MAT_CHECKBOX_CLICK_ACTION } from '@angular/material';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { requestClaimAttachments, requestClaimsPage, SearchPaginationAction } from 'src/app/pages/searchClaimsPage/store/search.actions';
import { getCurrentSearchResult, getPageInfo, getSelectedClaimAttachments } from 'src/app/pages/searchClaimsPage/store/search.reducer';

@Component({
  selector: 'app-claim-attachments-management',
  templateUrl: './claim-attachments-management.component.html',
  styleUrls: ['./claim-attachments-management.component.css'],
  providers: [{ provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'noop' }]
})
export class ClaimAttachmentsManagementComponent implements OnInit {

  confirmButtonText: string = "Upload";

  currentPage: number = 0;
  maxPages: number = 0;

  claims: { id: string, referenceNumber: string, memberId: string, hasAttachments: boolean }[] = [];

  attachments: { attachment, type: string, name: string }[] = [];

  selectedClaim: string;

  selectedClaimAssignedAttachments: { attachment, type: string, name: string }[] = [];

  assignedAttachmentsSubscription$: Subscription;

  selectedAttachments: number[] = [];
  selectedAssignedAttachments: number[] = [];

  attachmentBeingTypeEdited: { attachment, type: string, name: string };

  constructor(private store: Store) { }

  ngOnInit() {
    this.store.select(getCurrentSearchResult).subscribe(
      claims => {
        this.selectedClaim = null;
        this.selectedClaimAssignedAttachments = [];
        this.selectedAttachments = []
        if (this.assignedAttachmentsSubscription$ != null) this.assignedAttachmentsSubscription$.unsubscribe();
        this.claims = claims.map(claim => ({
          id: claim.claimId,
          referenceNumber: claim.providerClaimNumber,
          memberId: claim.memberId,
          hasAttachments: claim.numOfAttachments > 0
        }))
      }
    );
    this.store.select(getPageInfo).subscribe(info => {
      this.currentPage = info.currentPage;
      this.maxPages = info.maxPages;
    });
  }

  onClaimClicked(claimId: string) {
    if (this.selectedClaim == claimId) return;
    this.selectedClaim = claimId;
    const index = this.claims.findIndex(claim => claim.id == claimId);
    if (index != -1) {
      if (this.claims[index].hasAttachments) {
        this.store.dispatch(requestClaimAttachments({ claimId: claimId }));
      }
      if (this.assignedAttachmentsSubscription$ != null) {
        this.assignedAttachmentsSubscription$.unsubscribe();
      }
      this.selectedAssignedAttachments = [];
      this.assignedAttachmentsSubscription$ = this.store.select(getSelectedClaimAttachments(claimId)).subscribe(attachments => this.selectedClaimAssignedAttachments = attachments.map(att => ({ attachment: att.file, type: att.type, name: att.name })));
    }
  }

  beautifyFileName(name: string) {
    if (name.length > 11) {
      return name.substring(0, 8) + '...';
    }
    return name;
  }

  getFileExtension(name: string) {
    return name.substr(name.lastIndexOf('.') + 1).toUpperCase();
  }

  getFileType(type: string) {
    return type.replace('_', ' ').replace('_', ' ').toUpperCase();
  }

  toggleAssignedAttachmentSelection(i: number) {
    this.toggleSelectionInList(this.selectedAssignedAttachments, i);
  }

  toggleAttachmentSelection(i: number) {
    this.toggleSelectionInList(this.selectedAttachments, i);
  }

  toggleSelectionInList(list: number[], i: number) {
    const index = list.findIndex(num => num == i);
    if (index == -1) list.push(i);
    else list.splice(index, 1);
  }

  changePage(action:SearchPaginationAction){
    this.store.dispatch(requestClaimsPage({ action: action }));
  }

}
