import { DatePipe, Location } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Subscription } from 'rxjs';
import { DownloadStatus } from 'src/app/models/downloadRequest';
import { DownloadService } from 'src/app/services/downloadService/download.service';
import { ReportsService } from 'src/app/services/reportsService/reports.service';
import { SharedServices } from 'src/app/services/shared.services';
@Component({
  selector: 'app-claims-cover-letter',
  templateUrl: './claims-cover-letter.component.html',
  styles: []
})
export class ClaimsCoverLetterComponent implements OnInit {

  datePickerConfig: Partial<BsDatepickerConfig> = { dateInputFormat: 'MMM YYYY' };
  isSubmitted: boolean = false;
  payersList = this.sharedServices.getPayersListWithoutTPA();
  tpasList = this.sharedServices.getTPAsList();
  claimCoverList = [];
  selectedGroup;
  detailTopActionIcon = 'ic-download.svg';
  lastDownloadSubscriptions: Subscription;
  errorMessage: string;

  groups = [
    {
      name: "TPAs",
      options: this.tpasList
    },
    {
      name: "Payers",
      options: this.payersList
    },
  ];


  FormClaimCover: FormGroup = this.formBuilder.group({
    tpaORpayer: ['', Validators.required],
    month: ['', Validators.required]
  });

  constructor(
    private formBuilder: FormBuilder,
    private sharedServices: SharedServices,
    private reportsService: ReportsService,
    private datePipe: DatePipe,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private downloadService: DownloadService) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.tpaId) {
        this.FormClaimCover.controls.tpaORpayer.setValue(parseInt(params.tpaId));
        this.selectedGroup = 'TPAs';
      }
      if (params.payerId) {
        this.FormClaimCover.controls.tpaORpayer.setValue(parseInt(params.payerId));
        this.selectedGroup = 'Payers';
      }
      if (params.month) {
        let month = new Date(params.month);
        this.FormClaimCover.controls.month.setValue(month);
      }
      if (this.FormClaimCover.valid) {
        this.onSubmit();
      }
    });
  }

  selectChange(event, groupName: string) {
    if (event.isUserInput) {
      this.selectedGroup = groupName;
    }
  }

  onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }

  getTotal(field: string) {
    let total = this.claimCoverList.reduce(function (accumulator, claimCover) {
      return accumulator + claimCover[field];
    }, 0);
    return Math.round(total * 100) / 100;
  }


  onSubmit() {
    this.isSubmitted = true;
    if (this.FormClaimCover.valid) {
      this.sharedServices.loadingChanged.next(true);
      this.errorMessage = null;
      const model: any = {};
      model.providerId = this.sharedServices.providerId;
      model.month = this.datePipe.transform(this.FormClaimCover.controls.month.value, 'yyyy-MM-dd');
      if (this.selectedGroup === 'TPAs') {
        model.tpaId = this.FormClaimCover.controls.tpaORpayer.value;
      } else {
        model.payerId = this.FormClaimCover.controls.tpaORpayer.value;
      }
      this.editURL(model.tpaId, model.payerId, model.month);
      this.reportsService.getClaimCovers(model).subscribe(event => {
        if (event instanceof HttpResponse) {
          if (event.status == 200) {
            this.claimCoverList = event.body;
            const payersList = this.sharedServices.getPayersList();
            this.claimCoverList.forEach(x => {
              if (this.selectedGroup === 'Payers') {
                // tslint:disable-next-line:max-line-length
                x.description = this.payersList.filter(payer => payer.id === parseInt(x.payerId))[0] ? this.payersList.filter(payer => payer.id === parseInt(x.payerId))[0].name : '';
              } else if (this.selectedGroup === 'TPAs') {
                // tslint:disable-next-line:max-line-length
                x.description = payersList.filter(payer => payer.id === parseInt(x.payerId))[0] ? payersList.filter(payer => payer.id === parseInt(x.payerId))[0].name : '';
              }
            });
            if (this.claimCoverList.length == 0) {
              this.errorMessage = 'No Results Found';
            }
            this.sharedServices.loadingChanged.next(false);
          }
        }
      }, error => {
        if (error instanceof HttpErrorResponse) {
          this.sharedServices.loadingChanged.next(false);
        }
      })
    }
  }

  editURL(tpaId, payerId, month) {
    let path = `/${this.sharedServices.providerId}/reports/claims-cover-letter?`;
    if (tpaId) {
      path += `tpaId=${tpaId}&`;
    }

    if (payerId) {
      path += `payerId=${payerId}&`;
    }

    if (month) {
      path += `month=${month}&`;
    }

    if (path.endsWith('?') || path.endsWith('&')) {
      path = path.substr(0, path.length - 1);
    }
    this.location.go(path);
  }

  download() {
    if (this.detailTopActionIcon == 'ic-check-circle.svg') {
      return;
    }

    const model: any = {};
    model.providerId = this.sharedServices.providerId;
    model.month = this.datePipe.transform(this.FormClaimCover.controls.month.value, 'yyyy-MM-dd');
    if (this.selectedGroup == 'TPAs') {
      model.tpaId = this.FormClaimCover.controls.tpaORpayer.value;
    } else {
      model.payerId = this.FormClaimCover.controls.tpaORpayer.value;
    }

    this.downloadService
      .startGeneratingDownloadFile(
        this.reportsService.downloadClaimCovers(model))
      .subscribe(status => {
        if (status != DownloadStatus.ERROR) {
          this.detailTopActionIcon = 'ic-check-circle.svg';
        } else {
          this.detailTopActionIcon = 'ic-download.svg';
        }
      });
  }

}
