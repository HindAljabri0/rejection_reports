import { Location } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CollectionManagementService } from 'src/app/services/collection-management/collection-management.service';
import { SharedServices } from 'src/app/services/shared.services';
import * as moment from 'moment';
@Component({
    selector: 'app-accounts-receivable-list',
    templateUrl: './accounts-receivable-list.component.html',
    styles: []
})
export class AccountsReceivableListComponent implements OnInit {
    datePickerConfig: Partial<BsDatepickerConfig> = { dateInputFormat: 'YYYY' };
    YearDatePickerTitle = 'year';
    accountReceivableModel = new AccountReceivableModel();
    payersList: { id: number, name: string, arName: string }[] = [];
    yearData: any = [];
    payementData: any = [];
    strPayerYear: string;
    monthlyYear: string;
    constructor(private collectionManagementService: CollectionManagementService, private sharedService: SharedServices, private routeActive: ActivatedRoute, private location: Location) { }

    ngOnInit() {
        this.payersList = this.sharedService.getPayersList();
        this.routeActive.queryParams.subscribe(params => {
            if (params.strYear != null) {
                this.accountReceivableModel.strYear = params.strYear;
            }
            else {
                const todayDate = new Date();
                this.accountReceivableModel.strYear = moment(todayDate).format('YYYY');
            }
            this.search();
        });
    }


    getAccountReceivablePayerData() {
        if (this.accountReceivableModel.strYear === null || this.accountReceivableModel.strYear === undefined)
            return
        this.strPayerYear = moment(this.accountReceivableModel.strYear).format('YYYY');
        const obj = {
            strYear: this.strPayerYear
        }
        this.sharedService.loadingChanged.next(true);
        this.collectionManagementService.getAccountReceivablePayer(
            this.sharedService.providerId,
            obj
        ).subscribe(event => {
            if (event instanceof HttpResponse) {
                if (event.status === 200) {
                    this.payementData = event['body'];
                    this.payementData.map(ele => {
                        const payerData = this.payersList.find(sele => sele.id === parseInt(ele.payerId));
                        ele.payerName = payerData !== undefined ? payerData.name + ' ' + payerData.arName : ele.payerId;
                        if (ele.totalReceivedPerc !== null)
                            ele.totalReceivedPerc = ele.totalReceivedPerc + '%';
                        return ele;
                    });
                    this.sharedService.loadingChanged.next(false);
                }
            }
        }, err => {
            if (err instanceof HttpErrorResponse) {
                this.sharedService.loadingChanged.next(false);
                this.payementData = [];
                console.log(err);
            }
        });
    }

    getAccountReceivableYearData() {
        if (this.accountReceivableModel.strYear === null || this.accountReceivableModel.strYear === undefined)
            return
        this.monthlyYear = moment(this.accountReceivableModel.strYear).format('YYYY');
        const obj = {
            year: this.monthlyYear
        }
        this.sharedService.loadingChanged.next(true);
        this.collectionManagementService.getAccountReceivableYear(
            this.sharedService.providerId,
            obj
        ).subscribe(event => {
            if (event instanceof HttpResponse) {
                if (event.status === 200) {
                    this.yearData = event['body'];
                    this.yearData.map(ele => {
                        const payerData = this.payersList.find(sele => sele.id === parseInt(ele.payerId));
                        ele.payerName = payerData !== undefined ? payerData.name + ' ' + payerData.arName : ele.payerId;
                        if (ele.collecttionRatio !== null)
                            ele.collecttionRatio = ele.collecttionRatio + '%';
                        return ele;
                    });
                    this.sharedService.loadingChanged.next(false);
                }
            }
        }, err => {
            if (err instanceof HttpErrorResponse) {
                this.sharedService.loadingChanged.next(false);
                this.yearData = [];
                console.log(err);
            }
        });
    }

    editURL(strYear: string) {
        let path = '/collection-management/accounts-receivable-list?';

        if (strYear != null) {
            path += `strYear=${strYear}`;
        }
        this.location.go(path);
    }

    onOpenCalendar(container) {
        container.yearSelectHandler = (event: any): void => {
            container._store.dispatch(container._actions.select(event.date));
        };
        container.setViewMode('year');

    }

    search() {
        this.editURL(moment(this.accountReceivableModel.strYear).format('YYYY'));
        this.getAccountReceivableYearData();
        this.getAccountReceivablePayerData();
    }
}
export class AccountReceivableModel {
    strYear: any
}