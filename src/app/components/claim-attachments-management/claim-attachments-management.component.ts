import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { requestClaimAttachments } from 'src/app/pages/searchClaimsPage/store/search.actions';
import { getCurrentSearchResult, getSelectedClaimAttachments } from 'src/app/pages/searchClaimsPage/store/search.reducer';

@Component({
  selector: 'app-claim-attachments-management',
  templateUrl: './claim-attachments-management.component.html',
  styleUrls: ['./claim-attachments-management.component.css']
})
export class ClaimAttachmentsManagementComponent implements OnInit {

  confirmButtonText: string = "Upload";

  currentPage: number = 0;
  maxPages: number = 0;

  claims: { id: string, referenceNumber: string, memberId: string, hasAttachments: boolean }[] = [];

  attachments: { file: File, type?: string, isSelected: boolean }[] = [];

  selectedClaim: string;

  selectedClaimAssignedAttachments: { attachment, type: string, name: string }[] = [];

  assignedAttachmentsSubscription$: Subscription;

  constructor(private store: Store) { }

  ngOnInit() {
    this.store.select(getCurrentSearchResult).subscribe(
      claims =>
        this.claims = claims.map(claim => ({
          id: claim.claimId,
          referenceNumber: claim.providerClaimNumber,
          memberId: claim.memberId,
          hasAttachments: claim.numOfAttachments > 0
        }))
    );
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
      this.assignedAttachmentsSubscription$ = this.store.select(getSelectedClaimAttachments(claimId)).subscribe(attachments => this.selectedClaimAssignedAttachments = attachments.map(att => ({ attachment: att.file, type: att.type, name: att.name })));
    }
  }

  beautifyFileName(name: string) {
    if (name.length > 11) {
      return name.substring(0, 8) + '...';
    }
    return name;
  }

}
