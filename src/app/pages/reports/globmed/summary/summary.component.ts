
import { Component, OnInit, Input, Output } from '@angular/core';
import { SharedServices } from 'src/app/services/shared.services';
import { ActivatedRoute, Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { SearchedClaim } from 'src/app/models/searchedClaim';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { GlobMedService } from 'src/app/services/globmedService/glob-med.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  @Input() type: number;
  @Input() payer: string;
  @Input() from: string;
  @Input() to: string;
  @Input() queryPage: number;
  @Input() pageSize: number;
  @Input() providerId: string;

  @Output() onPaginationChange = new EventEmitter();

  searchResult: PaginatedResult<SearchedClaim>;
  claims: SearchedClaim[] = [];

  errorMessage: string;

  downloadButtonText = 'vertical_align_bottom';

  constructor(
    private globMedService: GlobMedService,
    private dialogService: DialogService,
    public sharedServices: SharedServices,
    public routeActive: ActivatedRoute,
    public router: Router) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    if (this.providerId == null || this.from == null || this.to == null || (this.type == 2 && this.payer == null)) {
      return;
    }
    this.sharedServices.loadingChanged.next(true);
    this.errorMessage = null;
    this.globMedService.search(this.providerId,
      this.payer,
      this.from,
      this.to,
      this.type,
      this.queryPage,
      this.pageSize).subscribe((event) => {
        if (event instanceof HttpResponse) {
          this.searchResult = new PaginatedResult(event.body, SearchedClaim);
          this.claims = this.searchResult.content;
          this.sharedServices.loadingChanged.next(false);
        }
      }, error => {
        if (error instanceof HttpErrorResponse) {
          if ((error.status / 100).toFixed() == '4') {
            this.errorMessage = 'Access Denied.';
          } else if ((error.status / 100).toFixed() == '5') {
            this.errorMessage = 'Server could not handle the request. Please try again later.';
          } else {
            this.errorMessage = 'Cloud not reach the server at the moment. Please try again later.';
          }
        }
        this.sharedServices.loadingChanged.next(false);
      });
  }

  async download() {
    if (this.downloadButtonText == 'check_circle') {
      return;
    }
    this.sharedServices.loadingChanged.next(true);
    let event;
    if (this.type == 1) {
      event = await this.globMedService.getDownloadableClaims(this.providerId,
        localStorage.getItem('provider_name'),
        this.from,
        this.to).toPromise().catch(error => {
          if (error instanceof HttpErrorResponse) {
            this.dialogService.openMessageDialog(new MessageDialogData('',
              'Could not reach the server at the moment. Please try again later.',
              true));
          }
          this.sharedServices.loadingChanged.next(false);
        });
    } else if (this.type == 2) {
      event = await this.globMedService.getDownloadableEBillingClaims(this.providerId,
        this.payer,
        localStorage.getItem('provider_name'),
        this.from, this.to).toPromise().catch(error => {
          if (error instanceof HttpErrorResponse) {
            this.dialogService.openMessageDialog(new MessageDialogData('',
              'Could not reach the server at the moment. Please try again later.',
              true));
          }
          this.sharedServices.loadingChanged.next(false);
        });
    }
    if (event instanceof HttpResponse) {
      let exportedFilename = 'GlobMed_Claims_' + this.from + '_' + this.to + '.xlsx';
      if (event.headers.has('content-disposition')) {
        exportedFilename = event.headers.get('content-disposition').split(' ')[1].split('=')[1];
      }
      const blob = new Blob([event.body], { type: 'application/ms-excel' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.download = exportedFilename;
      anchor.href = url;
      anchor.click();
      this.sharedServices.loadingChanged.next(false);
    }
  }

  showClaim(claimId: string) {
    window.open(`${location.protocol}//${location.host}/${location.pathname.split('/')[1]}/claims/${claimId}`);
  }

  goToFirstPage() {
    this.paginatorAction({ pageIndex: 0, pageSize: 10 });
  }
  goToPrePage() {
    if (this.searchResult.number != 0) {
      this.paginatorAction({ pageIndex: this.searchResult.number - 1, pageSize: 10 });
    }
  }
  goToNextPage() {
    if (this.searchResult.number + 1 < this.searchResult.totalPages) {
      this.paginatorAction({ pageIndex: this.searchResult.number + 1, pageSize: 10 });
    }
  }
  goToLastPage() {
    this.paginatorAction({ pageIndex: this.searchResult.totalPages - 1, pageSize: 10 });
  }

  paginatorAction(event) {
    this.queryPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.onPaginationChange.emit(event);
    this.fetchData();
  }

}
