import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as moment from 'moment';
import { Label } from 'ng2-charts';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { RevenuReportService } from 'src/app/services/revenuReportService/revenu-report.service';
import { SharedServices } from 'src/app/services/shared.services';
import { getDepartments } from 'src/app/pages/dashboard/store/dashboard.reducer';
import { getDepartmentNames } from 'src/app/pages/dashboard/store/dashboard.actions';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-revenue-breakdown-report',
    templateUrl: './revenue-breakdown-report.component.html',
    styles: []
})
export class RevenueBreakdownReportComponent implements OnInit {
    chartMode = 0;
    public chartFontFamily = '"Poppins", sans-serif';
    public chartFontColor = '#2d2d2d';
    public pieChartOptions: ChartOptions = {
        maintainAspectRatio: false,
        layout: {
            padding: 32
        },
        plugins: {
            legend: false
        },
        tooltips: {
            bodyFontFamily: this.chartFontFamily,
            titleFontFamily: this.chartFontFamily,
            footerFontFamily: this.chartFontFamily,
        },
    };
    public pieChartLabels: Label[] = [];
    public pieChartData: ChartDataSets[] = [];
    public pieChartType: ChartType = 'pie';
    public pieChartLegend = true;
    public pieChartPlugins = [];

    selectedPayerName = 'All';

    payersList: { id: number, name: string, arName: string }[] = [];
    departments;
    selectedPayerId = 'All';
    selectedCategory: 'Doctor' | 'Department' | 'ServiceCode' | 'ServiceType' | 'Payers' = 'Payers';
    fromDateControl = '';
    fromDateError: string;
    toDateControl = '';
    toDateError: string;
    error: string;

    noOfGeneratedData = 0;

    datePickerConfig: Partial<BsDatepickerConfig> = { dateInputFormat: 'MMM YYYY' };

    constructor(
        private sharedService: SharedServices,
        private reportService: RevenuReportService,
        private store: Store,
        private location: Location,
        private routeActive: ActivatedRoute) { }

    ngOnInit(): void {
        this.payersList = this.sharedService.getPayersList();
        this.store.dispatch(getDepartmentNames());
        this.store.select(getDepartments).subscribe(departments => this.departments = departments);
        this.routeActive.queryParams.subscribe(params => {
            if (params.payerId != null) {
                this.selectedPayerId = params.payerId;
            }
            if (params.category != null) {
                this.selectedCategory = params.category;
            }
            if (params.fromDate != null) {
                this.fromDateControl = params.fromDate;
            }
            if (params.toDate != null) {
                this.toDateControl = params.toDate;
            }
            if (this.isValidDate(this.fromDateControl) && this.isValidDate(this.toDateControl)) {
                this.generate();
            }
        }).unsubscribe();
    }

    get providerId(): string {
        return this.sharedService.providerId;
    }

    onPayerChanged() {
        if (this.selectedPayerId != 'All' && this.selectedCategory == 'Payers') {
            this.selectedCategory = 'ServiceCode';
        }
        this.selectedPayerName = this.selectedPayerId == 'All'
            ? 'All'
            : this.payersList.find(payer => payer.id == Number.parseInt(this.selectedPayerId, 10)).name;
        this.generate();
    }

    onCategoryChanged(category: 'Doctor' | 'Department' | 'ServiceCode' | 'ServiceType' | 'Payers', form: NgForm) {

        if (this.sharedService.loading) {
            return;
        }
        if (!form.invalid)
            this.selectedCategory = category;

        this.generate();
    }

    generate() {
        if (this.sharedService.loading) {
            return;
        }
        if (!this.isValidDate(this.fromDateControl)) {
            this.fromDateError = 'Please select a valid date.';
            return;
        }
        if (!this.isValidDate(this.toDateControl)) {
            this.toDateError = 'Please select a valid date.';
            return;
        }
        this.sharedService.loadingChanged.next(true);
        const fromDate = moment(this.fromDateControl).format('YYYY-MM-DD');
        this.fromDateError = null;
        const toDate = moment(this.toDateControl).format('YYYY-MM-DD');
        this.toDateError = null;
        this.editURL(fromDate, toDate);
        this.reportService.generateRevenuReportBreakdown(
            this.providerId,
            this.selectedPayerId,
            fromDate,
            toDate,
            this.selectedCategory).subscribe(event => {
                if (event instanceof HttpResponse) {
                    this.noOfGeneratedData++;
                    this.sharedService.loadingChanged.next(false);
                    this.error = null;
                    this.pieChartLabels = event.body.map(set => {
                        if (this.selectedCategory == 'Payers') {
                            const index = this.payersList.findIndex(payer => payer.id == set.label);
                            if (index != -1) {
                                return `${this.payersList[index].name}`;
                            }
                        } else if (this.selectedCategory == 'Department') {
                            return this.getDepartmentName(set.label);
                        }
                        return set.label;
                    });
                    const colors = this.sharedService.getAnalogousColor(event.body.length);
                    this.pieChartData = [
                        {
                            data: event.body.map(set => set.ratio.toFixed(2)),
                            datalabels: {
                                display: false
                            },
                            backgroundColor: colors,
                            hoverBackgroundColor: colors,
                            borderWidth: 0,
                        },
                    ];
                }

            }, err => {
                this.sharedService.loadingChanged.next(false);
                this.pieChartLabels = [];
                this.pieChartData = [];
                if (err instanceof HttpErrorResponse) {
                    if (err.status == 404) {
                        this.error = 'No data found.';
                    }
                } else {
                    console.log(err);
                    this.error = 'Could not load data at the moment. Please try again later.';
                }
            });
    }
    editURL(fromDate?: string, toDate?: string) {
        let path = '/reports/revenue-report-breakdown?';
        if (this.selectedPayerId != 'All') {
            path += `payerId=${this.selectedPayerId}&`;
        }
        if (this.selectedCategory != 'Payers') {
            path += `category=${this.selectedCategory}&`;
        }
        if (fromDate != null) {
            path += `fromDate=${fromDate}&`;
        }
        if (toDate != null) {
            path += `toDate=${toDate}`;
        }
        if (path.endsWith('?') || path.endsWith('&')) {
            path = path.substr(0, path.length - 2);
        }
        this.location.go(path);
    }
    onOpenCalendar(container) {
        container.monthSelectHandler = (event: any): void => {
            container._store.dispatch(container._actions.select(event.date));
        };
        container.setViewMode('month');
    }


    getEmptyStateMessage() {
        if (this.noOfGeneratedData == 0 && this.error == null) {
            return 'Please apply the filter and generate the report.';
        } else {
            return this.error;
        }
    }

    isValidDate(date): boolean {
        return date != null && !Number.isNaN(new Date(moment(date).format('YYYY-MM-DD')).getTime());
    }

    getDepartmentName(code: string) {
        if (this.departments != null) {
            const index = this.departments.findIndex(department => department.departmentId + '' == code);
            if (index != -1) {
                return this.departments[index].name;
            }
        }
        return code;
    }

}
