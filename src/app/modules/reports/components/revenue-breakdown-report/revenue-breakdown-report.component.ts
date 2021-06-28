import { CurrencyPipe, Location } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as moment from 'moment';
import { Label } from 'ng2-charts';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { getDepartmentNames } from 'src/app/pages/dashboard/store/dashboard.actions';
import { getDepartments } from 'src/app/pages/dashboard/store/dashboard.reducer';
import { RevenuReportService } from 'src/app/services/revenuReportService/revenu-report.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
    selector: 'app-revenue-breakdown-report',
    templateUrl: './revenue-breakdown-report.component.html',
    styles: []
})
export class RevenueBreakdownReportComponent implements OnInit, AfterViewInit {
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
            callbacks: {
                label: (tooltipItem, data) => {
                    let label: any = data.labels[tooltipItem.index];
                    return label + ': ' + data.datasets[0].data[tooltipItem.index] + '%';
                },

            }
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
    tempPieChartData: any = [];

    selectedDoctor = -1;
    servicePerDoctorData: any[] = [];
    tempPieChartLables: Label[] = [];
    minDate: any;
    constructor(
        private sharedService: SharedServices,
        private reportService: RevenuReportService,
        private store: Store,
        private location: Location,
        private routeActive: ActivatedRoute, private currencyPipe: CurrencyPipe) { }

    ngOnInit(): void {
        this.payersList = this.sharedService.getPayersList();
        this.store.dispatch(getDepartmentNames());
        this.store.select(getDepartments).subscribe(departments => this.departments = departments);

    }

    ngAfterViewInit() {
        this.routeActive.queryParams.subscribe(params => {
            if (params.payerId != null) {
                this.selectedPayerId = params.payerId;
                this.onPayerChanged();
            }
            if (params.category != null) {
                this.selectedCategory = params.category;
            }
            if (params.fromDate != null) {
                const fromDate: any = moment(params.fromDate, 'YYYY-MM-DD').toDate();
                this.fromDateControl = fromDate;
            }
            if (params.toDate != null) {
                const toDate: any = moment(params.toDate, 'YYYY-MM-DD').toDate();
                this.toDateControl = toDate;
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
    }

    onCategoryChanged(category: 'Doctor' | 'Department' | 'ServiceCode' | 'ServiceType' | 'Payers', form: NgForm) {

        if (this.sharedService.loading) {
            return;
        }
        if (!form.invalid) {
            this.selectedCategory = category;
        }
        this.selectedDoctor = -1;

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
        if (!this.isDateBeforeDate(this.fromDateControl, this.toDateControl)) {
            this.fromDateError = 'This date should be before the to-date';
            this.toDateError = 'This date should be after the from-date';
            return;
        }
        const fromDate = moment(this.fromDateControl).format('YYYY-MM-DD');
        const toDate = moment(this.toDateControl).format('YYYY-MM-DD');
        this.fromDateError = null;
        this.toDateError = null;
        this.sharedService.loadingChanged.next(true);
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
                    this.tempPieChartLables = this.pieChartLabels;
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
                    this.tempPieChartData = event.body.map((ele) => {
                        ele.ratio = ele.ratio.toFixed(2);
                        return ele;
                    });
                    if (this.selectedCategory == 'Doctor')
                        this.pieChartLabels.map((ele) => {
                            this.getServicesPerDoctorData(ele);

                        });

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

    isDateBeforeDate(date1, date2) {
        return new Date(moment(date1).format('YYYY-MM-DD')).getTime() <= new Date(moment(date2).format('YYYY-MM-DD')).getTime();
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

    selectDoctor(index) {
        if (this.selectedDoctor == index) {
            this.selectedDoctor = -1;
        } else {
            this.selectedDoctor = index;
        }
        let serviceData = this.servicePerDoctorData.find(ele => ele.drName === this.tempPieChartLables[index]);
        if (this.selectedDoctor !== -1) {
            if (serviceData !== null && serviceData !== undefined && serviceData.data.length > 0) {
                const colors = this.sharedService.getAnalogousColor(serviceData.data.length);
                this.pieChartData = [
                    {
                        data: serviceData.data.map(set => Number(set.ratio).toFixed(2)),
                        datalabels: {
                            display: false
                        },
                        backgroundColor: colors,
                        hoverBackgroundColor: colors,
                        borderWidth: 0,
                    },
                ];
                this.pieChartLabels = serviceData.data.map((ele) => ele.label);

            }
            else {
                this.pieChartLabels = [];
                this.pieChartData = this.pieChartData.map((ele) => {
                    ele.data = [];
                    return ele;
                });
            }
        }
        else {
            const colors = this.sharedService.getAnalogousColor(this.tempPieChartData.length);
            this.pieChartData = [
                {
                    data: this.tempPieChartData.map(set => set.ratio),
                    datalabels: {
                        display: false
                    },
                    backgroundColor: colors,
                    hoverBackgroundColor: colors,
                    borderWidth: 0,
                },
            ];
            this.pieChartLabels = this.tempPieChartLables;
        }

    }

    getServicesPerDoctorData(drName) {
        this.sharedService.loadingChanged.next(true);
        const obj = {
            fromDate: moment(this.fromDateControl).format('YYYY-MM-DD'),
            toDate: moment(this.toDateControl).format('YYYY-MM-DD'),
            drname: drName
        }

        this.reportService.getServicePerDoctor(this.selectedPayerId, this.sharedService.providerId, obj).subscribe((event: any) => {
            if (event instanceof HttpResponse) {
                let body = event['body'];
                body = JSON.parse(body);
                if (body !== undefined && body !== null && body.length > 0) {
                    const data = {
                        drName: drName,
                        data: body
                    }
                    this.servicePerDoctorData.push(data);
                }
                this.sharedService.loadingChanged.next(false);
            }
        }, err => {
            console.log(err);
            this.sharedService.loadingChanged.next(false);
            // this.servicePerDoctorData = [];
        });


    }
    serviceDoctorData(drName) {
        let serviceData = this.servicePerDoctorData.find(ele => ele.drName === drName);
        return serviceData === null || serviceData === undefined ? [] : serviceData.data.map((ele) => {
            ele.ratio = Number(ele.ratio).toFixed(2);
            return ele;
        });
    }
    dynamicPieChartLableData() {
        return this.selectedDoctor !== -1 ? this.tempPieChartLables : this.pieChartLabels;
    }
    dateValidation(event: any) {
        if (event !== null) {
            const startDate = moment(event).format('YYYY-MM-DD');
            const endDate = moment(this.fromDateControl).format('YYYY-MM-DD');
            if (startDate > endDate)
                this.toDateControl = '';
        }
        this.minDate = new Date(event);

    }

}
