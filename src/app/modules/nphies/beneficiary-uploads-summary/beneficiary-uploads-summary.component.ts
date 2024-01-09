import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { UploadBeneficiaryCchiErrorsDialogComponent } from '../upload-beneficiary-cchi-errors-dialog/upload-beneficiary-cchi-errors-dialog.component';
import { SharedServices } from 'src/app/services/shared.services';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
    selector: 'app-beneficiary-uploads-summary',
    templateUrl: './beneficiary-uploads-summary.component.html',
    styles: []
})
export class BeneficiaryUploadsSummaryComponent implements OnInit {
    currentPage = 0;
    tempCurrentPage = 0;
    maxPages = Number.MAX_VALUE;
    tempMaxPages = Number.MAX_VALUE;
    uploadSummaryList = [];
    constructor(
        private dialog: MatDialog,
        private commen: SharedServices,
        private beneficiarySerivce: ProvidersBeneficiariesService
    ) { }

    openErrorsDialog(uploadId) {
        const dialogRef = this.dialog.open(UploadBeneficiaryCchiErrorsDialogComponent, {
            panelClass: ['primary-dialog', 'dialog-lg'],
            autoFocus: false,
            data: uploadId
        });
    }

    ngOnInit() {
        this.fetchData();
    }
    fetchData() {
        if (this.currentPage >= this.maxPages || this.loading) {
            return;
        }
        this.commen.loadingChanged.next(true);
        this.beneficiarySerivce.getUploadSummary(this.commen.providerId, this.currentPage, 10)
            .subscribe(event => {
                if (event instanceof HttpResponse) {
                    this.maxPages = event.body['totalPages'];
                    this.currentPage++;
                    //this.uploadSummaryList = event.body['content'];
                    event.body['content'].forEach((upload: any) => {
                        this.uploadSummaryList.push(upload);
                    });
                    
                    console.log(this.uploadSummaryList);
                    /* event.body['content'].forEach((upload: UploadSummary) => {
                       upload.uploadDate = new Date(upload.uploadDate);
                        const key = formatDate(upload.uploadDate, 'MMM, yyyy', this.locale);
                        if (this.uploadsMap.has(key)) {
                            this.uploadsMap.get(key).push(upload);
                        } else {
                            this.uploadsMap.set(key, [upload]);
                            this.uploadsMapKeys.push(key);
                        }

                    });*/

                    this.commen.loadingChanged.next(false);
                }


            }, error => {
                if (error instanceof HttpErrorResponse) {
                    this.commen.loadingChanged.next(false);
                    console.log(error);
                }
            });
    }
    scrollHandler(e) {
        //console.log(e);
        if (e === 'bottom') {
            this.fetchData();
        }
    }
    get loading() {
        return this.commen.loading;
    }
}
