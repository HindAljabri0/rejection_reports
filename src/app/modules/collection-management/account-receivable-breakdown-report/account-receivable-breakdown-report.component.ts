import { Component, HostListener, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReconciliationService } from 'src/app/services/reconciliationService/reconciliation.service';
import { SharedServices } from 'src/app/services/shared.services';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-account-receivable-breakdown-report',
    templateUrl: './account-receivable-breakdown-report.component.html',
    styles: []
})
export class AccountReceivableBreakdownReportComponent implements OnInit {

    datePickerConfig: Partial<BsDatepickerConfig> = { dateInputFormat: 'YYYY' };
    FormBreakDownReport: FormGroup = this.formBuilder.group({
        payerId: ['', Validators.required],
        year: ['', Validators.required]
    });

    isSubmitted = false;

    chartMode = 0;
    public chartFontFamily = '"Poppins", sans-serif';
    public chartFontColor = '#2d2d2d';
    public paymentStatusChartOptions: ChartOptions = {
        maintainAspectRatio: false,
        legend: {
            position: 'bottom',
            labels: {
                fontColor: this.chartFontColor,
                fontFamily: this.chartFontFamily
            }
        },
        tooltips: {
            bodyFontFamily: this.chartFontFamily,
            titleFontFamily: this.chartFontFamily,
            footerFontFamily: this.chartFontFamily,
        },
    };
    public paymentStatusChartLabels: Label[] = ['Paid', 'Unpaid'];
    public paymentStatusChartData: ChartDataSets[] = [

    ];
    public paymentStatusChartType: ChartType = 'pie';
    public paymentStatusChartLegend = true;

    public paymentCategoryChartOptions: ChartOptions = {
        maintainAspectRatio: false,
        legend: {
            position: 'bottom',
            labels: {
                fontColor: this.chartFontColor,
                fontFamily: this.chartFontFamily
            }
        },
        tooltips: {
            bodyFontFamily: this.chartFontFamily,
            titleFontFamily: this.chartFontFamily,
            footerFontFamily: this.chartFontFamily,
        },
    };
    public paymentCategoryChartLabels: Label[] = ['Monthly', 'Reconciled Payment'];
    public paymentCategoryChartData: ChartDataSets[] = [

    ];
    public paymentCategoryChartType: ChartType = 'pie';
    public paymentCategoryChartLegend = true;


    public paymentTypeChartOptions: ChartOptions = {
        maintainAspectRatio: false,
        legend: {
            position: 'right',
            labels: {
                fontColor: this.chartFontColor,
                fontFamily: this.chartFontFamily
            }
        },
        tooltips: {
            bodyFontFamily: this.chartFontFamily,
            titleFontFamily: this.chartFontFamily,
            footerFontFamily: this.chartFontFamily,
        },
    };
    public paymentTypeChartLabels: Label[] = ['Regular', 'Prompt / Early'];
    public paymentTypeChartData: ChartDataSets[] = [
        // {
        //   data: [45, 55],
        //   backgroundColor: ['#006607', '#60DCFA'],
        //   hoverBackgroundColor: ['#006607', '#60DCFA'],
        //   borderColor: ['#fff', '#fff'],
        //   borderWidth: 3,
        //   hoverBorderColor: ['#fff', '#fff']
        // }
    ];
    public paymentTypeChartType: ChartType = 'pie';
    public paymentTypeChartLegend = true;


    public payerBreakdownChartOptions: ChartOptions = {
        maintainAspectRatio: false,
        legend: {
            position: 'bottom',
            labels: {
                fontColor: this.chartFontColor,
                fontFamily: this.chartFontFamily
            }
        },
        tooltips: {
            bodyFontFamily: this.chartFontFamily,
            titleFontFamily: this.chartFontFamily,
            footerFontFamily: this.chartFontFamily,
        },
    };
    public paidChartLabels: Label[] = [];
    public paidChartData: ChartDataSets[] = [];

    public unPaidChartLabels: Label[] = [];
    public unPaidChartData: ChartDataSets[] = [];

    public payerBreakdownChartType: ChartType = 'pie';
    public payerBreakdownChartLegend = true;

    payersList: { id: string[] | string, name: string }[];
    emptypaymentStatus = true;
    emptyCategoryStatus = true;
    emptyPaidStatus = true;
    emptyUnPaidStatus = true;

    constructor(
        private formBuilder: FormBuilder,
        private datePipe: DatePipe,
        private reconciliationService: ReconciliationService,
        private sharedService: SharedServices) { }

    ngOnInit() {
        this.payersList = [];
        this.sharedService.getPayersList().map(value => {
            this.payersList.push({
                id: `${value.id}`,
                name: value.name
            });
        });

        this.FormBreakDownReport.controls.payerId.setValue('all');
    }

    onOpenCalendar(container) {
        container.yearSelectHandler = (event: any): void => {
            container._store.dispatch(container._actions.select(event.date));
        };
        container.setViewMode('year');
    }

    payerChange($event) {
        this.isSubmitted = false;
        this.emptypaymentStatus = true;
    }


    onSubmit(status = null) {
        this.isSubmitted = true;
        if (this.FormBreakDownReport.valid) {
            this.chartMode = 0;
            const model: any = {};

            model.year = this.datePipe.transform(this.FormBreakDownReport.controls.year.value, 'yyyy');
            if (status) {
                model.status = status;
            } else {
                model.payerId = this.FormBreakDownReport.controls.payerId.value;
            }

            this.sharedService.loadingChanged.next(true);
            this.reconciliationService.getArBreakDownData(this.sharedService.providerId, model).subscribe(event => {
                if (event.status === 200) {
                    const body: any = event.body;
                    if (status) {
                        if (status === 'paid') {
                            if (body.length === 0) {
                                this.emptyPaidStatus = true;
                            } else {
                                this.emptyPaidStatus = false;
                                this.paidChartLabels = body.map(x => {
                                    // tslint:disable-next-line:radix
                                    // tslint:disable-next-line:max-line-length
                                    return this.payersList.filter(y => y.id === x.label)[0] ? this.payersList.filter(y => y.id === x.label)[0].name : '';
                                });
                                const colors = this.sharedService.getColorsFromShades(body.length, 'success');
                                this.paidChartData = [
                                    {
                                        data: body.map(x => {
                                            return x.value;
                                        }),
                                        backgroundColor: colors,
                                        hoverBackgroundColor: colors,
                                        borderColor: ['#fff', '#fff', '#fff', '#fff', '#fff'],
                                        borderWidth: 0,
                                        hoverBorderColor: ['#fff', '#fff', '#fff', '#fff', '#fff']
                                    }];
                                this.chartMode++;
                            }
                        } else if (status === 'unpaid') {
                            if (body.length === 0) {
                                this.emptyUnPaidStatus = true;
                            } else {
                                this.emptyUnPaidStatus = false;
                                this.unPaidChartLabels = body.map(x => {
                                    // tslint:disable-next-line:radix
                                    // tslint:disable-next-line:max-line-length
                                    return this.payersList.filter(y => y.id === x.label)[0] ? this.payersList.filter(y => y.id === x.label)[0].name : '';
                                });
                                const colors = this.sharedService.getColorsFromShades(body.length, 'danger');
                                this.unPaidChartData = [
                                    {
                                        data: body.map(x => {
                                            return x.value;
                                        }),
                                        backgroundColor: colors,
                                        hoverBackgroundColor: colors,
                                        borderColor: ['#fff', '#fff', '#fff', '#fff', '#fff'],
                                        borderWidth: 0,
                                        hoverBorderColor: ['#fff', '#fff', '#fff', '#fff', '#fff']
                                    }];
                                this.chartMode++;
                            }
                        }
                    } else {
                        if (body.length === 0) {
                            this.emptypaymentStatus = true;
                        } else {
                            this.emptypaymentStatus = false;

                            this.paymentStatusChartLabels = body.map(x => {
                                return x.label;
                            });

                            this.paymentStatusChartData = [
                                {
                                    data: body.map(x => {
                                        return x.value;
                                    }),
                                    backgroundColor: ['#6ABD63', '#D03131'],
                                    hoverBackgroundColor: ['#4CA444', '#D03131'],
                                    borderColor: ['#fff', '#fff'],
                                    borderWidth: 0,
                                    hoverBorderColor: ['#fff', '#fff']
                                }
                            ];

                            if (this.FormBreakDownReport.controls.payerId.value === 'all') {
                                this.onSubmit('paid');
                                this.onSubmit('unpaid');
                            }

                        }

                        this.searchcategoryData();
                    }

                    this.sharedService.loadingChanged.next(false);
                }
            }, err => {
                if (err instanceof HttpErrorResponse) {
                    this.sharedService.loadingChanged.next(false);
                    console.log(err);
                }
            });
        }
    }

    searchcategoryData() {

        const model: any = {};
        model.payerId = this.FormBreakDownReport.controls.payerId.value;
        model.year = this.datePipe.transform(this.FormBreakDownReport.controls.year.value, 'yyyy');

        this.sharedService.loadingChanged.next(true);
        this.reconciliationService.getArBreakDownCategoryData(this.sharedService.providerId, model).subscribe(event => {
            if (event.status === 200) {
                const body: any = event.body;
                if (body.length === 0) {
                    this.emptyCategoryStatus = true;
                } else {
                    this.emptyCategoryStatus = false;
                    this.paymentCategoryChartLabels = body.map(x => {
                        return x.label;
                    });
                    this.paymentCategoryChartData = [
                        {
                            data: body.map(x => {
                                return x.ratio;
                            }),
                            backgroundColor: ['#2394E0', '#F471FF'],
                            hoverBackgroundColor: ['#2394E0', '#F471FF'],
                            borderColor: ['#fff', '#fff'],
                            borderWidth: 0,
                            hoverBorderColor: ['#fff', '#fff']
                        }
                    ];
                }
                this.sharedService.loadingChanged.next(false);
            }
        }, err => {
            if (err instanceof HttpErrorResponse) {
                this.sharedService.loadingChanged.next(false);
                console.log(err);
            }
        });
    }



}
