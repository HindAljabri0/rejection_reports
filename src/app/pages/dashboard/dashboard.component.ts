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
import { FeedbackDialogComponent } from 'src/app/components/dialogs/feedback-dialog/feedback-dialog.component';
import { AuthService } from 'src/app/services/authService/authService.service';
import { FeedbackService } from 'src/app/components/dialogs/feedback-dialog/feedback.service.component';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { FeedbackClass } from 'src/app/components/dialogs/feedback-dialog/feedback.model.component';
import { BOOL_TYPE } from '@angular/compiler/src/output/output_ast';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styles: []
})
export class DashboardComponent implements OnInit {

    submitted: boolean = false;
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
        private dialog: MatDialog,
        private authService: AuthService,
        private _feedbackservice: FeedbackService,

    ) { }

    dashboardSections: { label: string, key: Type<any>, index: string }[] = [
        { label: 'All Claims Before Submission', key: NonSubmittedClaimsComponent, index: '0' },
        { label: 'All Claims After Submission', key: SubmittedClaimsComponent, index: '1' },
        { label: 'Top 5 Rejections', key: TopFiveRejectionsComponent, index: '2' },
    ];

    async ngOnInit() {
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


        let ProviderId = this.authService.getProviderId();
        let userName = this.commen.authService.getAuthUsername();

        let feedbackable = await this.userCanSubmitFeedback(ProviderId, userName);

        if (feedbackable) {
            
            const dialogConfig = new MatDialogConfig();
            dialogConfig.panelClass = ['dialog-lg'];
            dialogConfig.autoFocus = false;
            const dialogRef = this.dialog.open(FeedbackDialogComponent, dialogConfig);
        }
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.dashboardSections, event.previousIndex, event.currentIndex);
        localStorage.setItem('defaultDashboardSectionsOrder', this.dashboardSections.map(section => section.index).toString());
    }

    // async feedbackIsSubmitted(providerId: string, userName: string) {

    //     let data: any;

    //     //get all feedbacks with by the pId and the uName
    //     const event = await this._feedbackservice.getFeedback(providerId, userName).toPromise();
    //     if (event instanceof HttpResponse) {

    //         const body = event.body;
    //         data = body;
    //     } else if (event instanceof HttpErrorResponse) {
    //         console.log("httpErrorResponse: " + event.error);
    //     }

    //     return data;
    // }

    // async isValidDate(){

    //     let data: any;

    //     const event = await this._feedbackservice.isValidDate().toPromise();
    //     if (event instanceof HttpResponse) {
    //         const body = event.body;
    //         data = body;
    //     } else if (event instanceof HttpErrorResponse) {

    //         console.log("httpErrorResponse: " + event.error);
    //     }

    //     return data;
    // }

    async userCanSubmitFeedback(privderId: string, userName:string){
        let feedbackable: any;

       const event = await this._feedbackservice.UserFeedbackable(privderId, userName).toPromise();
       if (event instanceof HttpResponse) {
        const body = event.body;
        feedbackable = body;
        if (body instanceof Boolean) {
            feedbackable = body;
      }}
      console.log("\nFeedback validation api response is:\n" + feedbackable+"\n");
            return feedbackable;
    }

}
