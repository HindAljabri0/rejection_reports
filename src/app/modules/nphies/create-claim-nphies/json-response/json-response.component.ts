import { Component, OnInit, Input } from '@angular/core';
import { ProviderNphiesApprovalService } from 'src/app/services/providerNphiesApprovalService/provider-nphies-approval.service';
import { SharedServices } from 'src/app/services/shared.services';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { MatDialog } from '@angular/material';
import { JsonViewDialogComponent } from 'src/app/components/dialogs/json-view-dialog/json-view-dialog.component';

@Component({
  selector: 'app-json-response',
  templateUrl: './json-response.component.html',
  styleUrls: ['./json-response.component.css']
})
export class JsonResponseComponent implements OnInit {

  @Input() otherDataModel;

  transactions = [];

  constructor(
    private providerNphiesApprovalService: ProviderNphiesApprovalService,
    private sharedServices: SharedServices,
    private dialog: MatDialog,
    private dialogService: DialogService) { }

  ngOnInit() {
    this.GetJsonResponses();
  }

  GetJsonResponses() {
    this.sharedServices.loadingChanged.next(true);
    // tslint:disable-next-line:max-line-length
    this.providerNphiesApprovalService.getJSONTransactions(this.sharedServices.providerId, this.otherDataModel.claimId).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          this.transactions = event.body;
        }
        this.sharedServices.loadingChanged.next(false);
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        this.sharedServices.loadingChanged.next(false);
        console.log(error.status);
        // if (error.status === 400) {
        //   if (error.error && error.error.errors) {
        //     // tslint:disable-next-line:max-line-length
        //     this.dialogService.showMessage('Error', (error.error && error.error.message) ? error.error.message : ((error.error && !error.error.message) ? error.error : (error.error ? error.error : error.message)), 'alert', true, 'OK', error.error.errors);
        //   } else {
        //     // tslint:disable-next-line:max-line-length
        //     this.dialogService.showMessage('Error', (error.error && error.error.message) ? error.error.message : ((error.error && !error.error.message) ? error.error : (error.error ? error.error : error.message)), 'alert', true, 'OK');
        //   }
        // } else if (error.status === 404) {
        //   this.dialogService.showMessage('Error', error.error.message ? error.error.message : error.error.error, 'alert', true, 'OK');
        // } else if (error.status === 500) {
        //   this.dialogService.showMessage('Error', error.error.message, 'alert', true, 'OK');
        // }

      }
    });
  }

  GetJson(transactionId, pollTransactionId, transactionType, actionType) {
    this.sharedServices.loadingChanged.next(true);

    const model: any = {};
    model.transactionId = transactionId;
    model.pollTransactionId = pollTransactionId;
    model.transactionType = transactionType;

    // tslint:disable-next-line:max-line-length
    this.providerNphiesApprovalService.getJSON(this.sharedServices.providerId, model).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          const json = event.body;

          const fileName = transactionType + '_' + this.otherDataModel.claimResourceId + '.json';
          this.ViewJson(transactionId, transactionType, json, fileName);

        }
        this.sharedServices.loadingChanged.next(false);
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        this.sharedServices.loadingChanged.next(false);
        console.log(error.status);
        // if (error.status === 400) {
        //   if (error.error && error.error.errors) {
        //     // tslint:disable-next-line:max-line-length
        //     this.dialogService.showMessage('Error', (error.error && error.error.message) ? error.error.message : ((error.error && !error.error.message) ? error.error : (error.error ? error.error : error.message)), 'alert', true, 'OK', error.error.errors, true);
        //   } else {
        //     // tslint:disable-next-line:max-line-length
        //     this.dialogService.showMessage('Error', (error.error && error.error.message) ? error.error.message : ((error.error && !error.error.message) ? error.error : (error.error ? error.error : error.message)), 'alert', true, 'OK', null, true);
        //   }
        // } else if (error.status === 404) {
        //   // tslint:disable-next-line:max-line-length
        //   this.dialogService.showMessage('Error', error.error.message ? error.error.message : error.error.error, 'alert', true, 'OK', null, true);
        // } else if (error.status === 500) {
        //   this.dialogService.showMessage('Error', error.error.message, 'alert', true, 'OK', null, true);
        // }
      }
    });
  }

  // DownloadJson(transactionId, myJson) {
  //   const sJson = JSON.stringify(myJson);
  //   const element = document.createElement('a');
  //   element.setAttribute('href', 'data:text/json;charset=UTF-8,' + encodeURIComponent(sJson));
  //   element.setAttribute('download', this.otherDataModel.claimId + '-' + transactionId + '.json');
  //   element.style.display = 'none';
  //   document.body.appendChild(element);
  //   element.click(); // simulate click
  //   document.body.removeChild(element);
  // }

  ViewJson(transactionId, transactionType, json, fName) {
    this.dialog.open(JsonViewDialogComponent, {
      panelClass: ['primary-dialog', 'dialog-lg', 'json-dialog'],
      data: {
        title: `JSON of Transaction [${transactionId}]`,
        tabs: [
          {
            IsDownload: true,
            title: transactionType,
            fileName: fName,
            json
          }
        ]
      }
    });
  }

}
