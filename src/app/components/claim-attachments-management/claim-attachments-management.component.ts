import { Component, OnDestroy, OnInit } from '@angular/core';
import { MAT_CHECKBOX_CLICK_ACTION } from '@angular/material';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {
  cancelAttachmentEdit,
  requestClaimAttachments,
  requestClaimsPage,
  saveAttachmentsChanges,
  SearchPaginationAction,
  showErrorMessage,
  updateClaimAttachments
} from 'src/app/pages/searchClaimsPage/store/search.actions';
import {
  getCurrentSearchResult,
  getClaimsWithChanges,
  getIsAssignedAttachmentsLoading,
  getPageInfo,
  getSelectedClaimAttachments,
  getIsSavingChanges,
  getSavingResponses
} from 'src/app/pages/searchClaimsPage/store/search.reducer';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';

@Component({
  selector: 'app-claim-attachments-management',
  templateUrl: './claim-attachments-management.component.html',
  styles: [],
  providers: [{ provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'noop' }]
})
export class ClaimAttachmentsManagementComponent implements OnInit, OnDestroy {

  currentPage = 0;
  maxPages = 0;

  claims: { id: string, referenceNumber: string, memberId: string, hasAttachments: boolean }[] = [];

  attachments: { attachment, type: string, name: string, attachmentId?: string }[] = [];

  selectedClaim: string;

  selectedClaimAssignedAttachments: { attachment, type: string, name: string, attachmentId?: string }[] = [];

  assignedAttachmentsSubscription$: Subscription;

  selectedAttachments: number[] = [];
  selectedAssignedAttachments: number[] = [];

  attachmentBeingTypeEdited: { attachment, type: string, name: string, attachmentId?: string };
  attachmentBeingTypeEditedIsAssigned = false;
  selectAttachmentBeingEdited = -1;

  attachmentsLoading = false;
  assignedAttachmentsLoading = false;
  saving = false;

  hasChanges = false;

  afterSavingResponses: { id: string, status: string, error?}[] = [];

  constructor(private store: Store, private dialogService: DialogService) { }

  ngOnInit() {
    this.store.select(getCurrentSearchResult).subscribe(
      claims => {
        this.selectedClaim = null;
        this.selectedClaimAssignedAttachments = [];
        this.selectedAttachments = [];
        if (this.assignedAttachmentsSubscription$ != null) {
          this.assignedAttachmentsSubscription$.unsubscribe();
        }
        this.claims = claims.map(claim => ({
          id: claim.claimId,
          referenceNumber: claim.providerClaimNumber,
          memberId: claim.memberId,
          hasAttachments: claim.numOfAttachments > 0
        }));
      }
    );
    this.store.select(getPageInfo).subscribe(info => {
      this.currentPage = info.currentPage;
      this.maxPages = info.maxPages;
    });
    this.store.select(getIsAssignedAttachmentsLoading).subscribe(isLoading => this.assignedAttachmentsLoading = isLoading);
    this.store.select(getIsSavingChanges).subscribe(isLoading => this.saving = isLoading);
    this.store.select(getClaimsWithChanges).subscribe(claimsWithChanges => this.hasChanges = claimsWithChanges.length > 0);
    this.store.select(getSavingResponses).subscribe(responses => {
      if (responses.length > 0) {
        this.attachments = this.attachments.filter(att => att.attachmentId == null);
        const errorResponses = responses.filter(res => res.status == 'error');
        if (errorResponses.length > 0) {
          this.dialogService.openMessageDialog({
            title: '',
            message: `${errorResponses.length} out of ${responses.length} attachment operations have failed! Please try performing those attachment operations again.`,
            isError: true
          });
        }
      }
      this.afterSavingResponses = responses;
    });
  }

  ngOnDestroy() {
    this.cancel();
  }

  addFiles(event: FileList) {
    this.attachmentsLoading = true;
    const numOfFiles = event.length;
    for (let i = 0; i < numOfFiles; i++) {
      const file = event.item(i);
      const error = { code: 'SELECT_ATTACHMENT', message: null };
      if (file.size == 0) {
        error.message = `[${file.name}] file is empty`;
        this.store.dispatch(showErrorMessage({ error: error }));
        continue;
      }
      const mimeType = file.type;
      if (mimeType.match(/image\/*/) == null && !mimeType.includes('pdf')) {
        error.message = `[${file.name}] is not an image or a PDF file`;
        this.store.dispatch(showErrorMessage({ error: error }));
        continue;
      }
      if (this.attachments.find(attachment => attachment.name == file.name) != undefined) {
        error.message = `[${file.name}] attachment with same file name already exist.`;
        this.store.dispatch(showErrorMessage({ error: error }));
        continue;
      }
      if (file.size / 1024 / 1024 > 2) {
        error.message = `[${file.name}] file size is higher than 2MB`;
        this.store.dispatch(showErrorMessage({ error: error }));
        continue;
      }
      this.preview(file);
    }
    this.attachmentsLoading = false;
  }

  preview(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      let data: string = reader.result as string;
      data = data.substring(data.indexOf(',') + 1);
      this.attachments.push({ attachment: data, name: file.name, type: '' });
    };
  }

  onClaimClicked(claimId: string) {
    if (this.selectedClaim == claimId) {
      return;
    }
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
      this.assignedAttachmentsSubscription$ = this.store.select(getSelectedClaimAttachments(claimId))
        .subscribe(attachments => this.selectedClaimAssignedAttachments = attachments.map(att =>
          ({ attachment: att.file, type: att.type, name: att.name, attachmentId: att.attachmentId })));
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
      return 'Select Type';
    }
    return type.replace('_', ' ').replace('_', ' ').toUpperCase();
  }

  toggleAssignedAttachmentSelection(i: number) {
    this.toggleSelectionInList(this.selectedAssignedAttachments, i);
  }

  toggleAttachmentSelection(i: number) {
    if (!this.selectedAttachments.includes(i)) {
      if (this.attachments[i] != null && this.selectedClaimAssignedAttachments.some(att => att.name == this.attachments[i].name)) {
        this.store.dispatch(showErrorMessage({
          error: {
            code: 'SELECTION_ERROR',
            message: `Attachment with the same name already assigned to selected claim.`
          }
        }));
        return;
      }
      if (this.attachments[i] != null && this.selectedAttachments.some(index => this.attachments[index].name == this.attachments[i].name)) {
        this.store.dispatch(showErrorMessage({
          error: {
            code: 'SELECTION_ERROR',
            message: `Attachment with the same name already selected .`
          }
        }));
        return;
      }
    }
    this.toggleSelectionInList(this.selectedAttachments, i);
    if ((this.selectedAttachments.length + this.selectedClaimAssignedAttachments.length) > 7) {
      this.store.dispatch(showErrorMessage({
        error: {
          code: 'SELECTION_ERROR',
          message: `You can't assign more than 7 attachments to a claim.`
        }
      }));
      this.toggleSelectionInList(this.selectedAttachments, i);
    }
  }

  toggleSelectionInList(list: number[], i: number) {
    const index = list.findIndex(num => num == i);
    if (index == -1) {
      list.push(i);
    } else {
      list.splice(index, 1);
    }
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
      this.store.dispatch(showErrorMessage({ error: { code: 'ASSIGNING_ERROR', message: 'Please select a claim first!' } }));
      return;
    }
    this.selectedClaimAssignedAttachments = this.selectedClaimAssignedAttachments.concat(
      this.attachments.filter((att, i) => this.selectedAttachments.includes(i))
        .map(att => ({
          claimId: this.selectedClaim,
          attachment: att.attachment,
          name: att.name,
          type: att.type,
          attachmentId: att.attachmentId
        }))
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
    this.selectedClaimAssignedAttachments = this.selectedClaimAssignedAttachments.filter((att, i) =>
      !this.selectedAssignedAttachments.includes(i));
    this.selectedAssignedAttachments = [];
    this.updateClaimAttachments();
  }

  updateClaimAttachments() {
    this.store.dispatch(updateClaimAttachments({
      claimId: this.selectedClaim,
      attachments: this.selectedClaimAssignedAttachments.map(att =>
        ({ claimId: this.selectedClaim, file: att.attachment, name: att.name, type: att.type, attachmentId: att.attachmentId })
      )
    }));
  }

  cancel() {
    this.selectedClaim = null;
    this.selectAttachmentBeingEdited = null;
    this.selectedAssignedAttachments = [];
    this.selectedAttachments = [];
    this.selectedClaimAssignedAttachments = [];
    if (this.assignedAttachmentsSubscription$ != null) {
      this.assignedAttachmentsSubscription$.unsubscribe();
      this.assignedAttachmentsSubscription$ = null;
    }
    this.store.dispatch(cancelAttachmentEdit());
  }

  save() {
    if (this.attachments.length == 0) {
      this.store.dispatch(saveAttachmentsChanges());
    } else {
      this.dialogService.openMessageDialog({
        title: '',
        message: 'Unassigned attachments will be deleted',
        isError: false,
        withButtons: true,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'cancel'
      }).subscribe(confirmed => {
        if (confirmed) {
          this.store.dispatch(saveAttachmentsChanges());
        }
      });
    }
  }

  changesToClaimSuccess(claimId: string) {
    const index = this.afterSavingResponses.findIndex(res => res.id == claimId && res.status == 'done');
    return index != -1;
  }

  changesToClaimFailed(claimId: string) {
    const index = this.afterSavingResponses.findIndex(res => res.id == claimId && res.status == 'error');
    return index != -1;
  }
}
