import { Component, OnInit, Input } from '@angular/core';
import { JsonViewDialogComponent } from 'src/app/components/dialogs/json-view-dialog/json-view-dialog.component';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { SharedServices } from 'src/app/services/shared.services';
import { ProviderNphiesApprovalService } from 'src/app/services/providerNphiesApprovalService/provider-nphies-approval.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-approval-json-response',
  templateUrl: './approval-json-response.component.html',
  styleUrls: ['./approval-json-response.component.css']
})
export class ApprovalJsonResponseComponent implements OnInit {

  @Input() otherDataModel;

  transactions = [];

  constructor(
    private providerNphiesApprovalService: ProviderNphiesApprovalService,
    private sharedServices: SharedServices,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.GetJsonResponses();
  }

  GetJsonResponses() {
    this.sharedServices.loadingChanged.next(true);
    // tslint:disable-next-line:max-line-length
    //console.log("isapproval = "+this.otherDataModel.isApproval);
    this.providerNphiesApprovalService.getJSONTransactions(this.sharedServices.providerId, this.otherDataModel.approvalRequestId,this.sharedServices.providerId,this.otherDataModel.isApproval).subscribe((event: any) => {
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
    this.providerNphiesApprovalService.getJSON(this.sharedServices.providerId, model,this.otherDataModel.isApproval).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          const json = event.body;
          const fileName = transactionType + '_' + this.otherDataModel.claimResourceId + '.json';
          if (actionType === 'VIEW') {
            this.ViewJson(transactionId, transactionType, json);
          } else if (actionType === 'DOWNLOAD') {
            this.DownloadJSON(fileName, json);
          }
        }
        this.sharedServices.loadingChanged.next(false);
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        this.sharedServices.loadingChanged.next(false);
        console.log(error.status);
      }
    });
  }

  DownloadJSON(fileName, json) {
    const sJson = JSON.stringify(json);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=UTF-8,' + encodeURIComponent(sJson));
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click(); // simulate click
    document.body.removeChild(element);
  }

  ViewJson(transactionId, transactionType, json) {
    this.dialog.open(JsonViewDialogComponent, {
      panelClass: ['primary-dialog', 'dialog-lg', 'json-dialog'],
      data: {
        title: `JSON of Transaction [${transactionId}]`,
        tabs: [
          {
            title: transactionType,
            json
          }
        ]
      }
    });
  }


}
