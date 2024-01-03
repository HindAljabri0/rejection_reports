import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
    selector: 'app-upload-beneficiary-cchi-errors-dialog',
    templateUrl: './upload-beneficiary-cchi-errors-dialog.component.html',
    styles: []
})
export class UploadBeneficiaryCchiErrorsDialogComponent implements OnInit {
  totalPages: any;
    uploadErrorList = [];
    pageSizeOptions = [5, 10, 25, 100];
    page = 0;
    pageSize = 5;
    constructor(
        private dialogRef: MatDialogRef<UploadBeneficiaryCchiErrorsDialogComponent>,
        private commen: SharedServices,
        private beneficiarySerivce: ProvidersBeneficiariesService,
        @Inject(MAT_DIALOG_DATA) public data
    ) { }
    ngOnInit() {
        this.fetchData();
    }
    fetchData() {
        this.commen.loadingChanged.next(true);
        this.beneficiarySerivce.getSummaryError(this.commen.providerId,this.data, this.page,this.pageSize)
            .subscribe(event => {
                if (event instanceof HttpResponse) {
                    this.uploadErrorList = event.body['content'];
                    console.log("errors = " + JSON.stringify(event.body['content']));
                    this.commen.loadingChanged.next(false);
                    this.totalPages = event.body["totalElements"] as string;
                }


            }, error => {
                if (error instanceof HttpErrorResponse) {
                    this.commen.loadingChanged.next(false);
                    console.log(error);
                }
            });
    }
    get loading() {
        return this.commen.loading;
    }
    closeDialog() {
        this.dialogRef.close();
    }
    handlePageChange(event) {
      console.log(event.pageIndex)
      this.page = event.pageIndex;
      this.pageSize = event.pageSize;
      this.fetchData();
    }

}
