import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// tslint:disable-next-line:max-line-length
import { ProvidersNphiesEligibilityService } from 'src/app/services/providersNphiesEligibilitiyService/providers-nphies-eligibility.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-view-eligibility-details',
  templateUrl: './view-eligibility-details.component.html',
  styles: []
})
export class ViewEligibilityDetailsComponent implements OnInit {

  detailsModel: any;
  isPrint = false;

  constructor(
    private dialogRef: MatDialogRef<ViewEligibilityDetailsComponent>, private sharedServices: SharedServices,
    @Inject(MAT_DIALOG_DATA) public data, private providersNphiesEligibilityService: ProvidersNphiesEligibilityService) { }

  ngOnInit() {
    this.getDetails();
  }

  getDetails() {
    this.sharedServices.loadingChanged.next(true);
    this.providersNphiesEligibilityService.getEligibilityTransactionDetails(this.data.providerId, this.data.responseId).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          this.detailsModel = event.body;
        }
        this.sharedServices.loadingChanged.next(false);
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        console.log(error.error.message);
        this.sharedServices.loadingChanged.next(false);
      }
    });
  }

  print() {
    this.isPrint = true;
    document.body.classList.add('print-eligibility');
    setTimeout(() => {
      window.print();
      document.body.classList.remove('print-eligibility');
      this.isPrint = false;
    }, 2000);
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
