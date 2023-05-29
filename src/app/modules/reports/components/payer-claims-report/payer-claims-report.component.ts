import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { SearchedClaim } from 'src/app/models/searchedClaim';
import { SearchService } from 'src/app/services/serchService/search.service';
import { SharedServices } from 'src/app/services/shared.services';
import { Subscription } from 'rxjs';
import { DownloadService } from 'src/app/services/downloadService/download.service';
import { DownloadStatus } from 'src/app/models/downloadRequest';
import { MatPaginator } from '@angular/material';
import { DatePipe } from '@angular/common';
import { SuperAdminService } from 'src/app/services/administration/superAdminService/super-admin.service';
import { DbMappingService } from 'src/app/services/administration/dbMappingService/db-mapping.service';
import { getUserPrivileges, initState, UserPrivileges } from 'src/app/store/mainStore.reducer';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/authService/authService.service';

@Component({
    selector: 'app-payer-claims-report',
    templateUrl: './payer-claims-report.component.html',
    styles: []
})
export class PayerClaimsReportComponent implements OnInit {
    payers = [];
    claimStatusSummaryData: any;
    payerId = '';
    fromDate = new FormControl();
    payerName = '';
    isPayerUser=true;
    userId='';

    toDate = new FormControl();
    filtterStatuses: string[] = []
    statuses: { code: string, name: string }[] = [
        { code: 'accepted,failed', name: 'Ready for Submission' },
        { code: 'batched', name: 'Under Submission' },
        { code: 'rejected', name: 'Rejected By Payer' },
        { code: 'paid', name: 'Paid' },
        { code: 'notaccepted', name: 'Validation Errors' },
        { code: 'invalid,returned', name: 'Invalid' },
        { code: 'outstanding,under_process', name: 'Under Processing' },
        { code: 'partially_paid', name: 'Partially Paid' },
        { code: 'downloadable', name: 'Downloadable' },
        { code: 'submitted_outside_waseel', name: 'Submitted Outside Waseel' }

    ];
    paginatorPagesNumbers: number[];
    page: number = 0;
    pageSize: number = 10;
    minDate: any;
    paginatorLength1 = 0;


    @ViewChild('paginator', { static: false }) paginator: MatPaginator;
    paginatorPageSizeOptions = [10, 20, 50, 100];
    PayerClaimsReportForm: FormGroup;
    searchedClaim: SearchedClaim[] = []


    datePickerConfig: Partial<BsDatepickerConfig> = { showWeekNumbers: false, dateInputFormat: 'DD/MM/YYYY' };
    manualPage = 0;
    constructor(
        public commen: SharedServices,
        private formBuilder: FormBuilder,
        private searchService: SearchService,
        private downloadService: DownloadService,
        public datepipe: DatePipe,
        private sharedServices: SharedServices,
        public authService: AuthService,
        private superAdmin: SuperAdminService,
        private dbMappingService: DbMappingService,

    ) {
        this.page = 0;
        this.pageSize = 10;
    }
    submitted = false;
    errorMessage = null;
    detailTopActionIcon = 'ic-download.svg';
    lastDownloadSubscriptions: Subscription;

    providers: any[] = [];
    filteredProviders: any[] = [];
    selectedProvider: string;
    providerLoader = false;

    ngOnInit() {
        this.userId=this.authService.getProviderId();
        this.isPayerUser=this._isOnlyPayerUser();
        this.payerName = this.authService.getProviderName();
        this.PayerClaimsReportForm = this.formBuilder.group({
            providerId: ['', Validators.required],
            fromDate: ['', Validators.required],
            toDate: ['', Validators.required],
            payerId: [this.isPayerUser ? this.authService.getProviderId() : '', Validators.required],
            summaryCriteria: ['', Validators.required],
        });

        this.getProviders();
        console.log(this.isPayerUser);

        // this.commen.getPayersList().map(value => {
        //   this.payers.push({
        //     id: `${value.id}`,
        //     name: value.name
        //   });
        // });

    }

    getProviders() {
        this.sharedServices.loadingChanged.next(true);
        this.providerLoader = true;
        this.superAdmin.getProviders().subscribe(event => {
            if (event instanceof HttpResponse) {
                if (event.body instanceof Array) {
                    this.providers = event.body;
                    this.filteredProviders = this.providers;
                    this.sharedServices.loadingChanged.next(false);
                    this.providerLoader = false;
                }
            }
        }, error => {
            this.sharedServices.loadingChanged.next(false);
            this.providerLoader = false;
            console.log(error);
        });
    }

    updateFilter() {
        // tslint:disable-next-line:max-line-length
        this.filteredProviders = this.providers.filter(provider => `${provider.switchAccountId} | ${provider.cchiId} | ${provider.code} | ${provider.name}`.toLowerCase().includes(this.PayerClaimsReportForm.controls.providerId.value.toLowerCase())
        );
    }

    selectProvider(providerId: string = null) {
        if (providerId !== null) {
            this.selectedProvider = providerId;
        } else {
            // tslint:disable-next-line:no-shadowed-variable
            const providerId = this.PayerClaimsReportForm.controls.providerId.value.split('|')[0].trim();
            this.selectedProvider = providerId;
        }
        if (!this.isPayerUser)
            this.getPayers();
    }

    getPayers() {
        if (this.selectedProvider == null || this.selectedProvider == '') { return; }
        this.sharedServices.loadingChanged.next(true);
        this.dbMappingService.getPayerMapping(this.selectedProvider).subscribe(event => {
            if (event instanceof HttpResponse) {
                this.payers = event.body['mappingList'];
                this.payers = this.payers.filter(x => x.enabled === true);
            }
            this.sharedServices.loadingChanged.next(false);
        }, err => {
            this.sharedServices.loadingChanged.next(false);
        });
    }

    get formCn() { return this.PayerClaimsReportForm.controls; }

    get paginatorLength() {
        if (this.searchedClaim.length != null) {
            return this.paginatorLength1
        } else {
            return 0;
        }
    }

    paginatorAction(event) {
        this.manualPage = event['pageIndex'];
        this.page = event.pageIndex;
        this.pageSize = event.pageSize;
        this.search();
    }
    updateManualPage(index) {
        this.manualPage = index;
        this.paginator.pageIndex = index;
        this.paginatorAction({
            previousPageIndex: this.paginator.pageIndex,
            pageIndex: index,
            pageSize: this.paginator.pageSize,
            length: this.paginator.length
        });
    }
    dateValidation(event: any) {
        if (event !== null) {
            const startDate = moment(event).format('YYYY-MM-DD');
            const endDate = moment(this.PayerClaimsReportForm.value.toDate).format('YYYY-MM-DD');
            if (startDate > endDate) {
                this.PayerClaimsReportForm.controls['toDate'].patchValue('');
            }
        }
        this.minDate = new Date(event);

    }
    search() {
        this.submitted = true;
        this.filtterStatuses = [];
        this.detailTopActionIcon = 'ic-download.svg';
        this.errorMessage = null;
        if (this.PayerClaimsReportForm.valid) {
            this.commen.loadingChanged.next(true);

            const providerId = this.selectedProvider;
            const fromDate = moment(this.PayerClaimsReportForm.controls.fromDate.value).format('YYYY-MM-DD');
            const toDate = moment(this.PayerClaimsReportForm.controls.toDate.value).format('YYYY-MM-DD');
            const payerId = this.PayerClaimsReportForm.controls.payerId.value;

            this.PayerClaimsReportForm.controls['summaryCriteria'].value.forEach(element => {
                this.filtterStatuses = this.filtterStatuses.concat(element.split(",", 3));
            });


            // tslint:disable-next-line:max-line-length
            this.searchService.getPayerClaimReportResults(providerId, payerId, this.filtterStatuses, fromDate, toDate, this.page, this.pageSize).subscribe((event) => {
                if (event instanceof HttpResponse) {

                    this.searchedClaim = event.body["content"] as SearchedClaim[];
                    this.paginatorLength1 = event.body["totalElements"];
                    this.manualPage = event.body["number"];
                    const pages = Math.ceil((this.paginatorLength1 / this.pageSize));
                    this.paginatorPagesNumbers = Array(pages).fill(pages).map((x, i) => i);
                    if (this.searchedClaim.length == 0) {
                        this.errorMessage = 'No Results Found';
                    }
                    this.commen.loadingChanged.next(false);

                }
            }, error => {
                if (error instanceof HttpErrorResponse) {
                    if ((error.status / 100).toFixed() == '4') {
                        this.errorMessage = 'Access Denied.';
                    } else if ((error.status / 100).toFixed() == '5') {
                        this.errorMessage = 'Server could not handle the request. Please try again later.';
                    } else {
                        this.errorMessage = 'Somthing went wrong.';
                    }
                }
                this.commen.loadingChanged.next(false);
            });

        }
    }

    download() {
        if (this.detailTopActionIcon == 'ic-check-circle.svg') {
            return;
        }
        const providerId = this.selectedProvider;
        const fromDate = moment(this.PayerClaimsReportForm.controls.fromDate.value).format('YYYY-MM-DD');
        const toDate = moment(this.PayerClaimsReportForm.controls.toDate.value).format('YYYY-MM-DD');
        const payerId = this.PayerClaimsReportForm.controls.payerId.value;

        this.lastDownloadSubscriptions = this.downloadService
            .startGeneratingDownloadFile(this.searchService.generatePayerClaimsReport(
                providerId,
                payerId,
                fromDate, toDate,
                this.filtterStatuses
            ), true)
            .subscribe(status => {
                if (status != DownloadStatus.ERROR) {
                    this.detailTopActionIcon = 'ic-check-circle.svg';
                } else {
                    this.detailTopActionIcon = 'ic-download.svg';
                }
            });
    }

    get isLoading() {
        return this.sharedServices.loading;
    }
    private _isOnlyPayerUser(): boolean {

        const providerId = localStorage.getItem('provider_id');
        const userPrivileges = localStorage.getItem(`${providerId}101`);
        return userPrivileges != null && userPrivileges.split('|').includes('99.0');

    }

}
