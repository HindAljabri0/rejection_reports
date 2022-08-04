import { Component, OnInit, Input } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { JsonViewDialogComponent } from 'src/app/components/dialogs/json-view-dialog/json-view-dialog.component';
import { SharedServices } from 'src/app/services/shared.services';
import { MatDialog } from '@angular/material';
// tslint:disable-next-line:max-line-length
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';

@Component({
  selector: 'app-eligiblity-json-response',
  templateUrl: './eligiblity-json-response.component.html',
  styleUrls: ['./eligiblity-json-response.component.css']
})
export class EligiblityJsonResponseComponent implements OnInit {

  @Input() otherDataModel;

  transactions = [];

  constructor(
    private providerNphiesSearchService: ProviderNphiesSearchService,
    private sharedServices: SharedServices,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.GetJsonResponses();
  }

  GetJsonResponses() {
    this.sharedServices.loadingChanged.next(true);
    // tslint:disable-next-line:max-line-length
    this.providerNphiesSearchService.getEligibilityJSONTransactions(this.sharedServices.providerId, this.otherDataModel.eligibilityRequestId).subscribe((event: any) => {
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

  GetJson(transactionId, transactionType, actionType) {
    this.sharedServices.loadingChanged.next(true);

    const model: any = {};
    model.transactionId = transactionId;
    model.transactionType = transactionType;

    // tslint:disable-next-line:max-line-length
    this.providerNphiesSearchService.getEligibilityJSON(this.sharedServices.providerId, model).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          const json = event.body;
          const fileName = transactionType + '_' + this.otherDataModel.eligibilityRequestId + '.json';
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
