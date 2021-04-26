import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginOutLabels from 'chartjs-plugin-piechart-outlabels';
import { SharedServices } from 'src/app/services/shared.services';

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
        responsive: true,
        layout: {
            padding: 50
        },
        plugins: {
            legend: false,
            outlabels: {
                text: ' %l %p ',
                stretch: 45,
                color: this.chartFontColor,
                backgroundColor: '#fff',
                valuePrecision: 5,
                font: {
                    resizable: true,
                    minSize: 12,
                    family: this.chartFontFamily,
                    maxSize: 18
                },
            }
        },
        tooltips: {
            bodyFontFamily: this.chartFontFamily,
            titleFontFamily: this.chartFontFamily,
            footerFontFamily: this.chartFontFamily,
        },
    };
    public pieChartLabels: Label[] = ['AXA', 'Tawuniya', 'Medgulf', 'Bupa'];
    public pieChartData: ChartDataSets[] = [
        {
            data: [7.2, 29, 20.3, 43.5],
            backgroundColor: ['#9C1218', '#14C7C7', '#371AAE', '#3F91FF'],
            hoverBackgroundColor: ['#9C1218', '#14C7C7', '#371AAE', '#3F91FF'],
            borderColor: ['#fff', '#fff', '#fff', '#fff'],
            hoverBorderColor: ['#fff', '#fff', '#fff', '#fff'],
            borderWidth: 2,
            datalabels: {
                display: false
            }
        },
    ];
    public pieChartType: ChartType = 'pie';
    public pieChartLegend = true;
    public pieChartPlugins = [pluginOutLabels];

    public serviceChartOptions: ChartOptions = {
        responsive: true,
        aspectRatio: 1.6 / 1,
        scales: {
            xAxes: [{
                stacked: true,
                gridLines: {
                    display: false
                },
                ticks: {
                    fontFamily: this.chartFontFamily,
                    fontColor: this.chartFontColor
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Months',
                    fontFamily: this.chartFontFamily,
                    fontColor: this.chartFontColor,
                    fontSize: 18,
                    lineHeight: '24px',
                    padding: {
                        top: 8
                    }
                }
            }],
            yAxes: [{
                stacked: true,
                ticks: {
                    fontFamily: this.chartFontFamily,
                    fontColor: this.chartFontColor,
                    beginAtZero: true
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Amount',
                    fontFamily: this.chartFontFamily,
                    fontColor: this.chartFontColor,
                    fontSize: 18,
                    lineHeight: '24px',
                    padding: {
                        bottom: 8
                    }
                }
            }]
        },
        legend: {
            labels: {
                fontFamily: this.chartFontFamily,
                fontColor: this.chartFontColor,
                usePointStyle: true,
                padding: 16,
            },
            position: 'right'
        },
        tooltips: {
            bodyFontFamily: this.chartFontFamily,
            titleFontFamily: this.chartFontFamily,
            footerFontFamily: this.chartFontFamily,
        },
    };
    public serviceChartLabels: Label[] = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    public serviceChartType: ChartType = 'bar';
    public serviceChartLegend = true;

    public serviceChartData: ChartDataSets[] = [
        {
            data: [50997, 21682, 57050, 48703, 35099, 54152, 32265, 32901, 45204, 29687, 39193, 15532],
            label: 'Service 1',
            datalabels: {
                display: false
            },
            barPercentage: 0.65,
            backgroundColor: '#50B432',
            hoverBackgroundColor: '#50B432',
            borderWidth: 0
        },
        {
            data: [13896, 55417, 39921, 19505, 16163, 47971, 56964, 12697, 41882, 54992, 53327, 34802],
            label: 'Service 2',
            datalabels: {
                display: false
            },
            barPercentage: 0.65,
            backgroundColor: '#ED561B',
            hoverBackgroundColor: '#ED561B',
            borderWidth: 0
        },
        {
            data: [40268, 23800, 11801, 28116, 38686, 25190, 32182, 39239, 25311, 36890, 30499, 43052],
            label: 'Service 3',
            datalabels: {
                display: false
            },
            barPercentage: 0.65,
            backgroundColor: '#DDDF00',
            hoverBackgroundColor: '#DDDF00',
            borderWidth: 0
        },
        {
            data: [10954, 11663, 15196, 51202, 31608, 55597, 20345, 25677, 39977, 34211, 35072, 44999],
            label: 'Service 4',
            datalabels: {
                display: false
            },
            barPercentage: 0.65,
            backgroundColor: '#24CBE5',
            hoverBackgroundColor: '#24CBE5',
            borderWidth: 0
        },
        {
            data: [59888, 13154, 37561, 57729, 23464, 26654, 50687, 31297, 26874, 27606, 22382, 42379],
            label: 'Service 5',
            datalabels: {
                display: false
            },
            barPercentage: 0.65,
            backgroundColor: '#64E572',
            hoverBackgroundColor: '#64E572',
            borderWidth: 0
        },
        {
            data: [37112, 22575, 51783, 23657, 35325, 36296, 27800, 45022, 26718, 18000, 22859, 47969],
            label: 'Service 6',
            datalabels: {
                display: false
            },
            barPercentage: 0.65,
            backgroundColor: '#FF9655',
            hoverBackgroundColor: '#FF9655',
            borderWidth: 0
        },
        {
            data: [26552, 48115, 30912, 53240, 12309, 25705, 54274, 24695, 13399, 31661, 50056, 38279],
            label: 'Service 7',
            datalabels: {
                display: false
            },
            barPercentage: 0.65,
            backgroundColor: '#FFF263',
            hoverBackgroundColor: '#FFF263',
            borderWidth: 0
        },
        {
            data: [38770, 32075, 26157, 13616, 14870, 16688, 23566, 53534, 23306, 47416, 50957, 35013],
            label: 'Service 8',
            datalabels: {
                display: false
            },
            barPercentage: 0.65,
            backgroundColor: '#6AF9C4',
            hoverBackgroundColor: '#6AF9C4',
            borderWidth: 0
        },
        {
            data: [28486, 29921, 22583, 47424, 12554, 19553, 21151, 33162, 11668, 57532, 34908, 11285],
            label: 'Service 9',
            datalabels: {
                display: false
            },
            barPercentage: 0.65,
            backgroundColor: '#2F7ED8',
            hoverBackgroundColor: '#2F7ED8',
            borderWidth: 0
        },
        {
            data: [27689, 30685, 48224, 11887, 14518, 20344, 42632, 22672, 53987, 10507, 30483, 54297],
            label: 'Service 10',
            datalabels: {
                display: false
            },
            barPercentage: 0.65,
            backgroundColor: '#0D233A',
            hoverBackgroundColor: '#0D233A',
            borderWidth: 0
        },
        {
            data: [46805, 14372, 50466, 51190, 39885, 25306, 42766, 35674, 18939, 30163, 54817, 16677],
            label: 'Others',
            datalabels: {
                display: false
            },
            barPercentage: 0.65,
            backgroundColor: '#8BBC21',
            hoverBackgroundColor: '#8BBC21',
            borderWidth: 0
        }
    ];


    public departmentChartOptions: ChartOptions = {
        responsive: true,
        aspectRatio: 1.6 / 1,
        scales: {
            xAxes: [{
                stacked: true,
                gridLines: {
                    display: false
                },
                ticks: {
                    fontFamily: this.chartFontFamily,
                    fontColor: this.chartFontColor
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Months',
                    fontFamily: this.chartFontFamily,
                    fontColor: this.chartFontColor,
                    fontSize: 18,
                    lineHeight: '24px',
                    padding: {
                        top: 8
                    }
                }
            }],
            yAxes: [{
                stacked: true,
                ticks: {
                    fontFamily: this.chartFontFamily,
                    fontColor: this.chartFontColor,
                    beginAtZero: true
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Amount',
                    fontFamily: this.chartFontFamily,
                    fontColor: this.chartFontColor,
                    fontSize: 18,
                    lineHeight: '24px',
                    padding: {
                        bottom: 8
                    }
                }
            }]
        },
        legend: {
            labels: {
                fontFamily: this.chartFontFamily,
                fontColor: this.chartFontColor,
                usePointStyle: true,
                padding: 16
            },
            position: 'right'
        },
        tooltips: {
            bodyFontFamily: this.chartFontFamily,
            titleFontFamily: this.chartFontFamily,
            footerFontFamily: this.chartFontFamily,
        },
    };
    public departmentChartLabels: Label[] = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    public departmentChartType: ChartType = 'bar';
    public departmentChartLegend = true;

    public departmentChartData: ChartDataSets[] = [
        {
            data: [28774, 15989, 11207, 56104, 43270, 53818, 39571, 40135, 11890, 36934, 36104, 40559],
            label: 'Surgery',
            datalabels: {
                display: false
            },
            barPercentage: 0.65,
            backgroundColor: '#50B432',
            hoverBackgroundColor: '#50B432',
            borderWidth: 0
        },
        {
            data: [49726, 58678, 45748, 15392, 44697, 47132, 20787, 24328, 28692, 56278, 17681, 30592],
            label: 'Internal Medicine',
            datalabels: {
                display: false
            },
            barPercentage: 0.65,
            backgroundColor: '#ED561B',
            hoverBackgroundColor: '#ED561B',
            borderWidth: 0
        },
        {
            data: [23103, 48699, 30824, 55156, 59810, 28349, 27776, 13942, 27888, 55798, 13157, 33466],
            label: 'Plastic Surgery',
            datalabels: {
                display: false
            },
            barPercentage: 0.65,
            backgroundColor: '#DDDF00',
            hoverBackgroundColor: '#DDDF00',
            borderWidth: 0
        },
        {
            data: [30685, 17621, 40036, 31071, 24391, 51879, 40467, 11590, 55625, 39215, 31856, 27972],
            label: 'Iqama Issuance',
            datalabels: {
                display: false
            },
            barPercentage: 0.65,
            backgroundColor: '#24CBE5',
            hoverBackgroundColor: '#24CBE5',
            borderWidth: 0
        },
        {
            data: [52805, 19574, 31648, 33184, 50170, 52323, 15087, 32115, 44955, 30095, 48746, 58420],
            label: 'Oral/Maxillofacial',
            datalabels: {
                display: false
            },
            barPercentage: 0.65,
            backgroundColor: '#64E572',
            hoverBackgroundColor: '#64E572',
            borderWidth: 0
        },
        {
            data: [11329, 42319, 19131, 32189, 18350, 52880, 59508, 39122, 29197, 47286, 49290, 59098],
            label: 'Eye Care',
            datalabels: {
                display: false
            },
            barPercentage: 0.65,
            backgroundColor: '#FF9655',
            hoverBackgroundColor: '#FF9655',
            borderWidth: 0
        },
        {
            data: [44328, 21939, 15672, 59609, 34277, 55309, 47712, 59950, 14962, 51431, 15313, 48985],
            label: 'Cardiothoraci',
            datalabels: {
                display: false
            },
            barPercentage: 0.65,
            backgroundColor: '#FFF263',
            hoverBackgroundColor: '#FFF263',
            borderWidth: 0
        },
        {
            data: [20607, 46928, 18437, 42411, 25998, 55346, 44304, 10149, 14407, 13880, 31450, 53843],
            label: 'General Medical',
            datalabels: {
                display: false
            },
            barPercentage: 0.65,
            backgroundColor: '#6AF9C4',
            hoverBackgroundColor: '#6AF9C4',
            borderWidth: 0
        },
        {
            data: [30506, 45453, 35357, 23893, 58856, 37713, 14468, 21342, 28346, 25358, 59010, 42658],
            label: 'Home Health Care',
            datalabels: {
                display: false
            },
            barPercentage: 0.65,
            backgroundColor: '#2F7ED8',
            hoverBackgroundColor: '#2F7ED8',
            borderWidth: 0
        },
        {
            data: [16629, 26099, 40027, 23353, 54174, 35686, 42710, 55480, 54812, 26754, 51409, 55829],
            label: 'Renewal',
            datalabels: {
                display: false
            },
            barPercentage: 0.65,
            backgroundColor: '#0D233A',
            hoverBackgroundColor: '#0D233A',
            borderWidth: 0
        },
        {
            data: [39855, 15080, 25806, 14304, 26989, 10147, 56460, 17591, 13192, 17932, 15694, 13149],
            label: 'Others',
            datalabels: {
                display: false
            },
            barPercentage: 0.65,
            backgroundColor: '#8BBC21',
            hoverBackgroundColor: '#8BBC21',
            borderWidth: 0
        }
    ];



    public doctorChartOptions: ChartOptions = {
        responsive: true,
        aspectRatio: 1.6 / 1,
        scales: {
            xAxes: [{
                stacked: true,
                gridLines: {
                    display: false
                },
                ticks: {
                    fontFamily: this.chartFontFamily,
                    fontColor: this.chartFontColor
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Months',
                    fontFamily: this.chartFontFamily,
                    fontColor: this.chartFontColor,
                    fontSize: 18,
                    lineHeight: '24px',
                    padding: {
                        top: 8
                    }
                }
            }],
            yAxes: [{
                stacked: true,
                ticks: {
                    fontFamily: this.chartFontFamily,
                    fontColor: this.chartFontColor,
                    beginAtZero: true
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Amount',
                    fontFamily: this.chartFontFamily,
                    fontColor: this.chartFontColor,
                    fontSize: 18,
                    lineHeight: '24px',
                    padding: {
                        bottom: 8
                    }
                }
            }]
        },
        legend: {
            labels: {
                fontFamily: this.chartFontFamily,
                fontColor: this.chartFontColor,
                usePointStyle: true,
                padding: 16
            },
            position: 'right'
        },
        tooltips: {
            bodyFontFamily: this.chartFontFamily,
            titleFontFamily: this.chartFontFamily,
            footerFontFamily: this.chartFontFamily,
        },
    };
    public doctorChartLabels: Label[] = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    public doctorChartType: ChartType = 'bar';
    public doctorChartLegend = true;

    public doctorChartData: ChartDataSets[] = [
        {
            data: [18032, 31737, 57085, 15720, 43761, 30827, 57438, 38731, 26460, 46796, 36715, 29254],
            label: 'Edith Hunter',
            datalabels: {
                display: false
            },
            barPercentage: 0.65,
            backgroundColor: '#50B432',
            hoverBackgroundColor: '#50B432',
            borderWidth: 0
        },
        {
            data: [38697, 11809, 56832, 34395, 11119, 57750, 19970, 18624, 12062, 39198, 44011, 18486],
            label: 'Mina Pierce',
            datalabels: {
                display: false
            },
            barPercentage: 0.65,
            backgroundColor: '#ED561B',
            hoverBackgroundColor: '#ED561B',
            borderWidth: 0
        },
        {
            data: [13702, 33854, 37341, 20403, 42790, 27887, 39874, 45219, 43377, 11542, 58758, 17510],
            label: 'Lottie Ball',
            datalabels: {
                display: false
            },
            barPercentage: 0.65,
            backgroundColor: '#DDDF00',
            hoverBackgroundColor: '#DDDF00',
            borderWidth: 0
        },
        {
            data: [10845, 50672, 36084, 25463, 12407, 59791, 49850, 24481, 35056, 28345, 48143, 54782],
            label: 'Lou Jennings',
            datalabels: {
                display: false
            },
            barPercentage: 0.65,
            backgroundColor: '#24CBE5',
            hoverBackgroundColor: '#24CBE5',
            borderWidth: 0
        },
        {
            data: [22203, 25811, 19087, 57652, 43324, 56858, 22068, 55413, 48240, 54326, 24813, 29320],
            label: 'Derek Olson',
            datalabels: {
                display: false
            },
            barPercentage: 0.65,
            backgroundColor: '#64E572',
            hoverBackgroundColor: '#64E572',
            borderWidth: 0
        },
        {
            data: [59861, 48791, 28934, 41583, 25984, 17586, 19583, 32719, 13579, 15628, 27886, 45791],
            label: 'Alvin Sullivan',
            datalabels: {
                display: false
            },
            barPercentage: 0.65,
            backgroundColor: '#FF9655',
            hoverBackgroundColor: '#FF9655',
            borderWidth: 0
        },
        {
            data: [44228, 58584, 56679, 15865, 24026, 41615, 13969, 14888, 22632, 50378, 45098, 26984],
            label: 'Johanna Spencer',
            datalabels: {
                display: false
            },
            barPercentage: 0.65,
            backgroundColor: '#FFF263',
            hoverBackgroundColor: '#FFF263',
            borderWidth: 0
        },
        {
            data: [43062, 44672, 30568, 13382, 18820, 55633, 59018, 39746, 11941, 45417, 58572, 52172],
            label: 'Mildred Hill',
            datalabels: {
                display: false
            },
            barPercentage: 0.65,
            backgroundColor: '#6AF9C4',
            hoverBackgroundColor: '#6AF9C4',
            borderWidth: 0
        },
        {
            data: [41866, 21254, 24158, 47974, 30772, 43668, 44677, 12797, 53282, 43634, 10962, 52061],
            label: 'Luke Cooper',
            datalabels: {
                display: false
            },
            barPercentage: 0.65,
            backgroundColor: '#2F7ED8',
            hoverBackgroundColor: '#2F7ED8',
            borderWidth: 0
        },
        {
            data: [56869, 44386, 35456, 56195, 52751, 34595, 18567, 59794, 13277, 23259, 10150, 43816],
            label: 'Lulu Vasquez',
            datalabels: {
                display: false
            },
            barPercentage: 0.65,
            backgroundColor: '#0D233A',
            hoverBackgroundColor: '#0D233A',
            borderWidth: 0
        },
        {
            data: [11774, 17343, 31031, 51139, 46364, 22204, 42641, 54520, 55749, 38813, 20409, 47752],
            label: 'Mollie Ballard',
            datalabels: {
                display: false
            },
            barPercentage: 0.65,
            backgroundColor: '#8BBC21',
            hoverBackgroundColor: '#8BBC21',
            borderWidth: 0
        }
    ];


    public serviceTypeChartOptions: ChartOptions = {
        responsive: true,
        layout: {
            padding: 50
        },
        plugins: {
            legend: false,
            outlabels: {
                text: ' %l: %v ',
                stretch: 45,
                color: this.chartFontColor,
                backgroundColor: '#fff',
                valuePrecision: 5,
                font: {
                    resizable: true,
                    minSize: 12,
                    family: this.chartFontFamily,
                    maxSize: 18
                },
            }
        },
        tooltips: {
            bodyFontFamily: this.chartFontFamily,
            titleFontFamily: this.chartFontFamily,
            footerFontFamily: this.chartFontFamily,
        },
    };
    public serviceTypeChartLabels: Label[] = ['Laboratory', 'Medication', 'Radiology', 'Consultation', 'Procedure', 'Hospitlization', 'Dental', 'Supply', 'N/A'];
    public serviceTypeChartData: ChartDataSets[] = [
        {
            data: [1200, 1520, 500, 655, 244, 510, 358, 150, 1500],
            backgroundColor: ['#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4', '#2F7ED8', '#50B432'],
            hoverBackgroundColor: ['#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4', '#2F7ED8', '#50B432'],
            borderColor: ['#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff'],
            hoverBorderColor: ['#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff'],
            borderWidth: 2,
            datalabels: {
                display: false
            }
        },
    ];
    public serviceTypeChartType: ChartType = 'pie';
    public serviceTypeChartLegend = true;
    public serviceTypeChartPlugins = [pluginOutLabels];
    constructor(public sharedService: SharedServices) { }

    ngOnInit() {
    }

}
