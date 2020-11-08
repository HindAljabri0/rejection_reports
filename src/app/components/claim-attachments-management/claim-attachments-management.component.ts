import { Component, OnInit } from '@angular/core';
import { MAT_CHECKBOX_CLICK_ACTION } from '@angular/material';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { cancelAttachmentEdit, requestClaimAttachments, requestClaimsPage, saveAttachmentsChanges, SearchPaginationAction, updateClaimAttachments } from 'src/app/pages/searchClaimsPage/store/search.actions';
import { getCurrentSearchResult, getClaimsWithChanges, getIsAssignedAttachmentsLoading, getPageInfo, getSelectedClaimAttachments } from 'src/app/pages/searchClaimsPage/store/search.reducer';

@Component({
  selector: 'app-claim-attachments-management',
  templateUrl: './claim-attachments-management.component.html',
  styleUrls: ['./claim-attachments-management.component.css'],
  providers: [{ provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'noop' }]
})
export class ClaimAttachmentsManagementComponent implements OnInit {

  currentPage: number = 0;
  maxPages: number = 0;

  claims: { id: string, referenceNumber: string, memberId: string, hasAttachments: boolean }[] = [];

  attachments: { attachment, type: string, name: string, attachmentId?: string }[] = [];

  selectedClaim: string;

  selectedClaimAssignedAttachments: { attachment, type: string, name: string, attachmentId?: string }[] = [];

  assignedAttachmentsSubscription$: Subscription;

  selectedAttachments: number[] = [];
  selectedAssignedAttachments: number[] = [];

  attachmentBeingTypeEdited: { attachment, type: string, name: string, attachmentId?: string };
  attachmentBeingTypeEditedIsAssigned: boolean = false;
  selectAttachmentBeingEdited: number = -1;

  attachmentsLoading: boolean = false;
  assignedAttachmentsLoading: boolean = false;

  hasChanges: boolean = false;

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
    this.store.select(getIsAssignedAttachmentsLoading).subscribe(isLoading => this.assignedAttachmentsLoading = isLoading);
    this.store.select(getClaimsWithChanges).subscribe(claimsWithChanges => this.hasChanges = claimsWithChanges.length > 0);
  }

  addFiles(event: FileList) {
    this.attachmentsLoading = true;
    const numOfFiles = event.length;
    for (let i = 0; i < numOfFiles; i++) {
      let file = event.item(i);
      if (file.size == 0)
        continue;
      let mimeType = file.type;
      if (mimeType.match(/image\/*/) == null && !mimeType.includes('pdf')) {
        continue;
      }
      if (this.attachments.find(attachment => attachment.name == file.name) != undefined) {
        continue;
      }
      if (file.size / 1024 / 1024 > 2) {
        continue;
      }
      this.preview(file);
    }
    this.attachmentsLoading = false;
  }

  preview(file: File) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      let data: string = reader.result as string;
      data = data.substring(data.indexOf(',') + 1);
      this.attachments.push({ attachment: data, name: file.name, type: '' });
    }
  }

  onClaimClicked(claimId: string) {
    if (this.selectedClaim == claimId) return;
    this.selectedClaim = claimId;
    this.selectedAttachments = [];
    const index = this.claims.findIndex(claim => claim.id == claimId);
    if (index != -1) {
      if (this.claims[index].hasAttachments) {
        this.store.dispatch(requestClaimAttachments({ claimId: claimId }));
      }
      if (this.assignedAttachmentsSubscription$ != null) {
        this.assignedAttachmentsSubscription$.unsubscribe();
      }
      this.selectedAssignedAttachments = [];
      this.assignedAttachmentsSubscription$ = this.store.select(getSelectedClaimAttachments(claimId)).subscribe(attachments => this.selectedClaimAssignedAttachments = attachments.map(att => ({ attachment: att.file, type: att.type, name: att.name, attachmentId: att.attachmentId })));
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
    if (type == null || type.trim().length == 0) {
      return 'Select Type'
    }
    return type.replace('_', ' ').replace('_', ' ').toUpperCase();
  }

  toggleAssignedAttachmentSelection(i: number) {
    this.toggleSelectionInList(this.selectedAssignedAttachments, i);
  }

  toggleAttachmentSelection(i: number) {
    this.toggleSelectionInList(this.selectedAttachments, i);
    if ((this.selectedAttachments.length + this.selectedClaimAssignedAttachments.length) > 7) {
      this.toggleSelectionInList(this.selectedAttachments, i);
    }
  }

  toggleSelectionInList(list: number[], i: number) {
    const index = list.findIndex(num => num == i);
    if (index == -1) list.push(i);
    else list.splice(index, 1);
  }

  changePage(action: SearchPaginationAction) {
    this.store.dispatch(requestClaimsPage({ action: action }));
  }

  changeAttachmentType(type: string, assigned?: boolean) {
    this.attachmentBeingTypeEdited.type = type;
    if (this.selectAttachmentBeingEdited != -1) {
      this.toggleAttachmentSelection(this.selectAttachmentBeingEdited);
      this.selectAttachmentBeingEdited = -1;
    }
    if (assigned) {
      this.updateClaimAttachments();
    }
  }

  moveSelectionToAssigned() {
    if (this.selectedClaim == null) {
      return;
    }
    this.selectedClaimAssignedAttachments = this.selectedClaimAssignedAttachments.concat(
      this.attachments.filter((att, i) => this.selectedAttachments.includes(i))
        .map(att => ({ claimId: this.selectedClaim, attachment: att.attachment, name: att.name, type: att.type, attachmentId: att.attachmentId }))
    );
    this.attachments = this.attachments.filter((att, i) => !this.selectedAttachments.includes(i));
    this.selectedAttachments = [];
    this.updateClaimAttachments();
  }

  moveSelectionToUnassigned() {
    if (this.selectedAssignedAttachments.length == 0) {
      return;
    }
    this.attachments = this.attachments.concat(
      this.selectedClaimAssignedAttachments.filter((att, i) => this.selectedAssignedAttachments.includes(i))
        .map(att => ({ attachment: att.attachment, name: att.name, type: att.type, attachmentId: att.attachmentId }))
    );
    this.selectedClaimAssignedAttachments = this.selectedClaimAssignedAttachments.filter((att, i) => !this.selectedAssignedAttachments.includes(i));
    this.selectedAssignedAttachments = [];
    this.updateClaimAttachments()
  }

  updateClaimAttachments() {
    this.store.dispatch(updateClaimAttachments({
      claimId: this.selectedClaim,
      attachments: this.selectedClaimAssignedAttachments.map(att =>
        ({ claimId: this.selectedClaim, file: att.attachment, name: att.name, type: att.type, attachmentId: att.attachmentId })
      )
    }))
  }

  cancel() {
    this.selectedClaim = null;
    this.selectAttachmentBeingEdited = null;
    this.selectedAssignedAttachments = [];
    this.selectedAttachments = [];
    this.selectedClaimAssignedAttachments = [];
    if(this.assignedAttachmentsSubscription$ != null){
      this.assignedAttachmentsSubscription$.unsubscribe();
      this.assignedAttachmentsSubscription$ = null;
    }
    this.store.dispatch(cancelAttachmentEdit());
  }

  save() {
    this.store.dispatch(saveAttachmentsChanges());
  }

}
