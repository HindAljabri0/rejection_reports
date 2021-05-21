import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { FileUploadDialogComponent } from 'src/app/components/file-upload-dialog/file-upload-dialog.component';
import { AccountReceivableAddPaymentComponent } from '../account-receivable-add-payment/account-receivable-add-payment.component';

@Component({
    selector: 'app-accounts-receivable-list',
    templateUrl: './accounts-receivable-list.component.html',
    styles: []
})
export class AccountsReceivableListComponent implements OnInit {
    recordOneOpen = false;
    recordTwoOpen = false;
    public chartFontFamily = '"Poppins", sans-serif';
    public chartFontColor = '#2d2d2d';

    public barChartOptions: ChartOptions = {
        responsive: true,
        aspectRatio: 7 / 2.5,
        scales: {
            xAxes: [{
                gridLines: {
                    display: false
                },
                ticks: {
                    fontFamily: this.chartFontFamily,
                    fontColor: this.chartFontColor
                }
            }],
            yAxes: [{
                ticks: {
                    display: false
                }
            }]
        },
        legend: {
            display: false
        },
        tooltips: {
            bodyFontFamily: this.chartFontFamily,
            titleFontFamily: this.chartFontFamily,
            footerFontFamily: this.chartFontFamily,
        }
    };

    public barChartType: ChartType = 'bar';
    public barChartLegend = false;
    public barChartData: ChartDataSets[] = [
        {
            data: [4469, 1400, 4028, 4739, 2424, 1042, 879, 344, 4534, 4875, 2526, 3080],
            label: '',
            barPercentage: 0.7,
            backgroundColor: '#3060AA',
            hoverBackgroundColor: '#3060AA',
            datalabels: {
                display: false
            }
        }
    ];
    public barChartLabels: Label[] = ['2/3/2059', '12/4/2101', '9/12/2047', '4/2/2088', '3/16/2116', '2/11/2103', '7/21/2092', '11/1/2085',
        '10/28/2040', '12/28/2049', '2/9/2100', '10/25/2104'];

    public doughnutChartLabels: Label[] = ['Excellent', 'Good', 'Fair', 'Bad'];
    public doughnutChartData: ChartDataSets[] = [
        {
            label: '# of Votes',
            data: [25, 25, 25, 25],
            backgroundColor: ['#45E23F', '#F0F63C', '#FFAD41', '#F55656'],
            hoverBackgroundColor: ['#45E23F', '#F0F63C', '#FFAD41', '#F55656'],
            borderColor: ['#fff', '#fff', '#fff', '#fff'],
            hoverBorderColor: ['#fff', '#fff', '#fff', '#fff'],
            borderWidth: 2
        }
    ];
    public doughnutChartType: ChartType = 'doughnut';
    public doughnutChartOptions: ChartOptions = {
        responsive: true,
        rotation: 1 * Math.PI,
        circumference: 1 * Math.PI,
        tooltips: {
            enabled: false
        },
        legend: {
            display: false
        },
        cutoutPercentage: 75
    };

    constructor(public dialog: MatDialog) { }

    ngOnInit() {
    }

    fileUploadChange(event) {
        const dialogRef = this.dialog.open(FileUploadDialogComponent,
            {
                panelClass: ['primary-dialog'], autoFocus: false, data: event.target.files[0]
            });
    }

    openAddPaymentDialog(event) {
        event.preventDefault();
        const dialogRef = this.dialog.open(AccountReceivableAddPaymentComponent,
            {
                panelClass: ['primary-dialog']
            });
    }

}
