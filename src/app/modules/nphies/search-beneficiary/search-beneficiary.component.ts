import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material';
import { BeneficiarySearch } from 'src/app/models/nphies/beneficiarySearch';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { SharedServices } from 'src/app/services/shared.services';
import { saveAs } from 'file-saver';
import { DownloadService } from 'src/app/services/downloadService/download.service';
import { DownloadStatus } from 'src/app/models/downloadRequest';

@Component({
  selector: 'app-search-beneficiary',
  templateUrl: './search-beneficiary.component.html'

})
export class SearchBeneficiaryComponent implements OnInit {
  beneficiaries: BeneficiarySearch[];
  constructor(private sharedServices: SharedServices, private providersBeneficiariesService: ProvidersBeneficiariesService, private providerNphiesSearchService: ProviderNphiesSearchService, private dialogService: DialogService,private downloadService: DownloadService) { }

  length = 100;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 50, 100];
  showFirstLastButtons = true;


  nameController: FormControl = new FormControl();
  nationalIdController: FormControl = new FormControl();
  contactNoController: FormControl = new FormControl();
  fileIdController: FormControl = new FormControl();
  memberCardidController: FormControl = new FormControl();

  detailTopActionIcon = 'ic-download.svg';


  handlePageEvent(event: PageEvent) {
    // this.beneficiaries = [];
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    localStorage.setItem('pagesize', event.pageSize + '');
    this.searchByCriteria();

  }

  ngOnInit() {

    this.providerNphiesSearchService.NphisBeneficiarySearchByCriteria(this.sharedServices.providerId, null, null, null, null, null, 0, 10).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body != null && event.body instanceof Array)
          this.beneficiaries = [];

        this.beneficiaries = event.body["content"] as BeneficiarySearch[];
        this.length = event.body["totalElements"]
      }
    }
      , err => {

        if (err instanceof HttpErrorResponse) {
          console.log(err.message)


        }
      });

  }

  searchByCriteria() {

    this.providerNphiesSearchService.NphisBeneficiarySearchByCriteria(this.sharedServices.providerId,
      this.nationalIdController.value, this.nameController.value, this.memberCardidController.value,
      this.fileIdController.value, this.contactNoController.value, this.pageIndex, this.pageSize).subscribe(event => {
        if (event instanceof HttpResponse) {
          if (event.body != null && event.body instanceof Array)
            this.beneficiaries = [];
          this.beneficiaries = event.body["content"] as BeneficiarySearch[];
          this.length = event.body["totalElements"]
        }
      }
        , err => {

          if (err instanceof HttpErrorResponse) {
            console.log(err.message)


          }
        });

  }

  /*downloadFile() {

    this.providersBeneficiariesService.downloadSampleFile(this.sharedServices.providerId).subscribe(event => {
      if (event instanceof HttpResponse) {
        console.log("Response");
      }

    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        this.dialogService.openMessageDialog({
          title: '',
          message: `No File Returned`,
          isError: true
        });
      }
    });

  }*/

  /*downloadFile2() {
    this.providersBeneficiariesService.downloadSampleFile(this.sharedServices.providerId)
      .subscribe(
        (response: HttpResponse<Blob>) => {
          let filename: string = "sample.csv";
          let binaryData = [];
          binaryData.push(response.body);
          let downloadLink = document.createElement('a');
          downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: 'blob' }));
          downloadLink.setAttribute('download', filename);
          document.body.appendChild(downloadLink);
          downloadLink.click();
        }
      )
  }


  downloadFile3(){
    this.providersBeneficiariesService.downloadSampleFile(this.sharedServices.providerId).subscribe(data => this.downloadFile4(data)),//console.log(data),
                 error => console.log('Error downloading the file.'),
                 () => console.info('OK');
  }

  downloadFile4(data: Response) {
    const blob = new Blob([data], { type: 'text/csv' });
    const url= window.URL.createObjectURL(blob);
    window.open(url);
  }*/

  /*download() {
    this.providersBeneficiariesService
      .downloadSampleFile(this.sharedServices.providerId)
      .subscribe(blob => saveAs(blob, 'sample.csv'))
  }*/

  /*download(): void {
    this.providersBeneficiariesService
      .downloadSampleFile(this.sharedServices.providerId)
      .subscribe(blob => {
        const a = document.createElement('a')
        const objectUrl = URL.createObjectURL(blob)
        a.href = objectUrl
        a.download = 'sample.csv';
        a.click();
        URL.revokeObjectURL(objectUrl);
      })
  }*/

  /*downloadFile(): void {
    this.providersBeneficiariesService
      .download(this.sharedServices.providerId)
      .subscribe(blob => saveAs(blob, 'sample.csv'));
  }*/

  downloadSheetFormat() {
    if (this.detailTopActionIcon == 'ic-check-circle.svg') { return; }

    let event;

    event = this.providersBeneficiariesService.download(this.sharedServices.providerId);
    if (event != null) {
      this.downloadService.startDownload(event)
        .subscribe(status => {
          if (status != DownloadStatus.ERROR) {
            this.detailTopActionIcon = 'ic-check-circle.svg';
          } else {
            this.detailTopActionIcon = 'ic-download.svg';
          }
        });
    }

  }

}


