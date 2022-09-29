import { Component, OnInit, Type } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NonSubmittedClaimsComponent } from './components/non-submitted-claims/non-submitted-claims.component';
import { SubmittedClaimsComponent } from './components/submitted-claims/submitted-claims.component';
import { TopFiveRejectionsComponent } from './components/top-five-rejections/top-five-rejections.component';
import { GuidedTourService, GuidedTour } from 'ngx-guided-tour';
import { SharedServices } from 'src/app/services/shared.services';
import { ViewportScroller } from '@angular/common';
import { environment } from 'src/environments/environment';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ChangeLogDialogComponent } from 'src/app/components/change-log-dialog/change-log-dialog.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styles: []
})
export class DashboardComponent implements OnInit {

    dashboardTour: GuidedTour = {
        tourId: '1',
        skipCallback: (stepNumber) => {
            window.localStorage.setItem('onboarding-demo-done', 'true');            
        },
        completeCallback: () => {
            document.body.classList.remove('guided-tour-active');
            document.getElementsByTagName('html')[0].classList.remove('guided-tour-active');
            this.commen.showUploadsCenterChange.next(false);
            this.commen.showNotificationCenterChange.next(false);
            this.commen.showAnnouncementCenterChange.next(false);
            window.localStorage.setItem('onboarding-demo-done', 'true');            
        },
        steps: [
            {
                selector: '.sidebar',
                title: 'Sidebar',
                content: 'This is sidebar where you can navigate to other pages.',
                orientation: 'right',
                action: () => {
                    this.viewportScroller.scrollToPosition([0, 0]);
                }
            },
            {
                selector: '.advance-search',
                title: 'Easy to search',
                content: 'Search claim, member ID, invoice no., patient file no., policy no. etc. here.',
                orientation: 'bottom',
                action: () => {
                    this.viewportScroller.scrollToPosition([0, 0]);
                }
            },
            {
                selector: '.language-picker',
                title: 'Choose your language',
                content: 'Choose your preferred language here. It becomes easier for you to access system with your native language.',
                orientation: 'bottom',
                action: () => {
                    document.body.classList.add('rounded-tour-spotlight');
                    this.viewportScroller.scrollToPosition([0, 0]);
                },
                closeAction: () => {
                    document.body.classList.remove('rounded-tour-spotlight');
                }
            },
            {
                selector: '.uploads-btn',
                title: 'Uploads',
                content: 'Click here to view uploads.',
                orientation: 'bottom',
                action: () => {
                    document.body.classList.add('rounded-tour-spotlight');
                    this.viewportScroller.scrollToPosition([0, 0]);
                },
                closeAction: () => {
                    document.body.classList.remove('rounded-tour-spotlight');
                }
            },
            {
                selector: '.upload-history-list',
                title: 'Check your uploads',
                content: 'You can get list of your uploads over here.',
                orientation: 'left',
                action: () => {
                    this.commen.showUploadsCenterChange.next(true);
                    this.viewportScroller.scrollToPosition([0, 0]);
                },
                closeAction: () => {
                    this.commen.showUploadsCenterChange.next(false);
                }
            },
            {
                selector: '.notifications-btn',
                title: 'Notifications',
                content: 'Click here to view notifications.',
                orientation: 'bottom',
                action: () => {
                    document.body.classList.add('rounded-tour-spotlight');
                    this.viewportScroller.scrollToPosition([0, 0]);
                },
                closeAction: () => {
                    document.body.classList.remove('rounded-tour-spotlight');
                }
            },
            {
                selector: '.notification-list',
                title: 'Your notifications',
                content: 'Check your notifications here.',
                orientation: 'left',
                action: () => {
                    this.commen.showNotificationCenterChange.next(true);
                    this.viewportScroller.scrollToPosition([0, 0]);
                },
                closeAction: () => {
                    this.commen.showNotificationCenterChange.next(false);
                }
            },
            {
                selector: '.announcements-btn',
                title: 'Announcements',
                content: 'Click here to view announcements.',
                orientation: 'bottom',
                action: () => {
                    document.body.classList.add('rounded-tour-spotlight');
                    this.viewportScroller.scrollToPosition([0, 0]);
                },
                closeAction: () => {
                    document.body.classList.remove('rounded-tour-spotlight');
                }
            },
            {
                selector: '.announcement-list',
                title: 'Announcements for you',
                content: 'You get list of all announcements here.',
                orientation: 'left',
                action: () => {
                    this.commen.showAnnouncementCenterChange.next(true);
                    this.viewportScroller.scrollToPosition([0, 0]);
                },
                closeAction: () => {
                    this.commen.showAnnouncementCenterChange.next(false);
                    this.viewportScroller.scrollToPosition([0, 0]);
                }
            }
        ]
    };


    constructor(
        private tourService: GuidedTourService,
        private commen: SharedServices,
        private viewportScroller: ViewportScroller,
        private dialog: MatDialog
    ) { }

    dashboardSections: { label: string, key: Type<any>, index: string }[] = [
        { label: 'All Claims Before Submission', key: NonSubmittedClaimsComponent, index: '0' },
        { label: 'All Claims After Submission', key: SubmittedClaimsComponent, index: '1' },
        { label: 'Top 5 Rejections', key: TopFiveRejectionsComponent, index: '2' },
    ];

    ngOnInit() {
        const order = localStorage.getItem('defaultDashboardSectionsOrder');
        const newOrderedDashboard = [];
        if (order != null) {
            const splitedValues = order.split(',');
            if (splitedValues.length == this.dashboardSections.length) {
                splitedValues.forEach((index, j) => {
                    const i = Number.parseInt(index, 10);
                    if (Number.isInteger(i) && this.dashboardSections.length > i && i >= 0 && this.dashboardSections.length > j) {
                        newOrderedDashboard[j] = this.dashboardSections[i];
                    }
                });
                if (newOrderedDashboard.map(section =>
                    Number.parseInt(section.index, 10)).reduce((i, j) => i + j) == this.dashboardSections.map(section =>
                        Number.parseInt(section.index, 10)).reduce((i, j) => i + j) && newOrderedDashboard.length == this.dashboardSections.length) {
                    this.dashboardSections = newOrderedDashboard;
                }
            }
        }
        if (!window.localStorage.getItem('onboarding-demo-done') && (environment.name == 'dev' || environment.name == 'oci_qa')) {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.panelClass = ['primary-dialog'];
            dialogConfig.autoFocus = false;
            const dialogRef = this.dialog.open(ChangeLogDialogComponent, dialogConfig);
            dialogRef.afterClosed().subscribe(
                data => {
                    document.body.classList.add('guided-tour-active');
                    document.getElementsByTagName('html')[0].classList.add('guided-tour-active');
                    this.tourService.startTour(this.dashboardTour);
                }
            );
        }
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.dashboardSections, event.previousIndex, event.currentIndex);
        localStorage.setItem('defaultDashboardSectionsOrder', this.dashboardSections.map(section => section.index).toString());
    }

}
