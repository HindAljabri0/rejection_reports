import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SharedServices } from '../../services/shared.services';
import { AuthService } from 'src/app/services/authService/authService.service';
import { Router } from '@angular/router';
import { DownloadService } from 'src/app/services/downloadService/download.service';
import { DownloadRequest } from 'src/app/models/downloadRequest';
import { MatDialog, MatMenuTrigger } from '@angular/material';
import { NotificationsService } from 'src/app/services/notificationService/notifications.service';
import { ReportsService } from 'src/app/services/reportsService/reports.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import { getUserPrivileges, initState, UserPrivileges } from 'src/app/store/mainStore.reducer';
import { SettingsService } from 'src/app/services/settingsService/settings.service';
import { AnnountmentDialogComponent } from '../annountment-dialog/annountment-dialog.component';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { error } from 'console';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styles: []
})
export class HeaderComponent implements OnInit {
    collapsed = true;
    userName: string;
    authUsername: string;
    providerName: string;
    providerId: string;
    globalNotificationVisible = true;
    englishMessage = null;
    arabicMessage = null;
    startDateAlert = null;
    endDateAlert = null;
    isClaimsEnabled = true;
    deactivateReason = null;



    @Input() activeLanguageLabel: string;

    @Input() languageList;

    notificationIconClasses = 'mat-icon-button mat-button-base ';

    thereIsActiveDownloads = false;
    providerDownloads: DownloadRequest[] = [];
    adminDownloads: DownloadRequest[] = [];
    watchingProcessed = false;
    showWhatsAppSupport = false;

    userPrivileges: UserPrivileges = initState.userPrivileges;

    @ViewChild('downloadMenuTriggerButton', { static: false, read: MatMenuTrigger }) downloadMenuRef: MatMenuTrigger;


    constructor(
        private sharedServices: SharedServices,
        public router: Router,
        public authService: AuthService,
        private settingsService: SettingsService,
        private downloadService: DownloadService,
        private notificationService: NotificationsService,
        private reportsService: ReportsService,
        private store: Store,
        private dialog: MatDialog,
        private notificationsService: NotificationsService,
        private adminService: AdminService
    ) {
        this.sharedServices.unReadNotificationsCountChange.subscribe(count => {
            this.setNewNotificationIndecater(count > 0);
        });
        this.authService.isUserNameUpdated.subscribe((isUpdated) => {
            if (isUpdated) {
                this.getUserData();
                this.sharedServices.getNotifications();
                this.sharedServices.getUploads();
                this.sharedServices.getAnnouncements();
            }
        }
        );
        this.store.select(getUserPrivileges).subscribe(privileges => { this.userPrivileges = privileges; this.fetchDownloads(); });
    }

    getUserData() {
        this.authService.evaluateUserPrivileges();
        this.userName = this.authService.getUserName();
        this.authUsername = this.authService.getAuthUsername();
        this.providerName = this.authService.getProviderName();
        this.providerId = this.authService.getProviderId();
    }

    get loading(): boolean {
        return this.sharedServices.loading;
    }

    get hasAnyNphiesPrivilege() {
        const keys = Object.keys(this.userPrivileges.ProviderPrivileges.NPHIES);
        return keys.some(key => this.userPrivileges.ProviderPrivileges.NPHIES[key]);
    }



    ngOnInit() {
        console.log(this.sharedServices.providerId)
        this.checkClaimsEnabled();
        if (this.sharedServices.providerId != '101' && localStorage.getItem('hasDisplayedAnnouncementDialogue') != "true") {
            this.getAnnouncements();

        }
        this.getAlertMessage();
        // if (environment.showFreshChat) {
        //     this.showWhatsAppSupport = true;
        //     this.showFreshChatBox();
        // }

        this.getUserData();






        //to check why they put this in here
        /*if (//!this.userPrivileges.ProviderPrivileges.NPHIES.isAdmin &&

            !this.userPrivileges.ProviderPrivileges.RCM.isAdmin &&
            //!this.userPrivileges.ProviderPrivileges.WASEEL_CLAIMS.isAdmin &&
            !this.userPrivileges.ProviderPrivileges.Contract_Bill.isAdmin &&
            !this.userPrivileges.WaseelPrivileges.RCM.isAdmin) {
            this.sharedServices.getProcessedCount();
            this.sharedServices.getCommunicationRequestCount();
            this.sharedServices.getRecentReconciliationCount();
            this.sharedServices.getClaimProcessedCount();
            this.sharedServices.getClaimCommunicationRequestCount();
        }*/
        this.sharedServices.getNotificationByWeekCount();
        //}

        // this.watchPreAuthorizationChanges();

        this.downloadService.providerDownloads.subscribe(downloads => {
            this.providerDownloads.unshift(...downloads);
            setTimeout(() => this.downloadMenuRef.openMenu(), 500);
        });
        this.downloadService.adminDownloads.subscribe(downloads => {
            this.adminDownloads.unshift(...downloads);
            setTimeout(() => this.downloadMenuRef.openMenu(), 500);
        });

        this.fetchDownloads();
    }

    fetchDownloads() {
        if (this.isProvider && this.providerId) {
            this.reportsService.getAllDownloadsForProvider(this.providerId, null, null).subscribe(downloads => {
                this.providerDownloads = [];
                if (downloads instanceof HttpResponse) {
                    this.providerDownloads = downloads.body['content'] as DownloadRequest[];
                }
            });
        }
        // tslint:disable-next-line:max-line-length
        if (this.userPrivileges.WaseelPrivileges.isPAM || (this.userPrivileges.WaseelPrivileges.RCM.isAdmin || this.userPrivileges.WaseelPrivileges.RCM.scrubbing.isDoctor || this.userPrivileges.WaseelPrivileges.RCM.scrubbing.isCoder)) {
            this.reportsService.getAllDownloadsForProvider(this.authUsername, null, null).subscribe(downloads => {
                this.adminDownloads = [];
                if (downloads instanceof HttpResponse) {
                    this.adminDownloads = downloads.body['content'] as DownloadRequest[];
                }
            });
        }
    }

    get isThereAreActiveDownloads() {
        return this.providerDownloads.length > 0 || this.adminDownloads.length > 0;
    }

    get isProvider() {
        return this.userPrivileges.ProviderPrivileges.WASEEL_CLAIMS.isClaimUser || this.userPrivileges.ProviderPrivileges.NPHIES.isAdmin || this.userPrivileges.ProviderPrivileges.NPHIES.canAccessClaim || this.userPrivileges.ProviderPrivileges.NPHIES.canAccessViewClaim;
    }
    setNewNotificationIndecater(show: boolean) {
        if (show) {
            this.notificationIconClasses = 'mat-icon-button mat-button-base hasNotifications';
        } else {
            this.notificationIconClasses = 'mat-icon-button mat-button-base ';
        }
    }

    toggleAnnouncementCenter() {
        this.sharedServices.showAnnouncementCenterChange.next(!this.sharedServices.showAnnouncementCenter);
    }

    toggleNotificationCenter() {
        this.sharedServices.showNotificationCenterChange.next(!this.sharedServices.showNotificationCenter);
    }

    toggleUploadHistoryCenter() {
        this.sharedServices.showUploadsCenterChange.next(!this.sharedServices.showUploadsCenter);
    }

    logout() {

        this.authService.loginOut().subscribe(response => {

            if (response instanceof HttpResponse) {
                //console.log(JSON.stringify(response));
            }
        });

        this.authService.logout();
    }

    toggleSearch() {
        document.body.classList.toggle('search-visible');
    }

    toggleNav() {
        document.body.classList.toggle('nav-open');
        document.getElementsByTagName('html')[0].classList.toggle('nav-open');
    }

    watchPreAuthorizationChanges() {
        if (this.watchingProcessed) { return; }

        this.watchingProcessed = true;

        this.notificationService.startWatchingMessages(this.sharedServices.providerId, 'nphies');
        this.notificationService._messageWatchSources['nphies'].subscribe(value => {

            value = value.replace(`"`, '').replace(`"`, '');

            this.sharedServices.getNotificationByWeekCount();

        });
    }


    // showFreshChatBox() {
    //     window['fcWidget'].init({
    //         token: '32afa4a2-e443-4a99-aa8b-67e3a6639fd2',
    //         host: 'https://wchat.freshchat.com'
    //     });
    // }


    get hasNewProviderDownload() {
        return this.providerDownloads.some(download => download.downloadAttempts == '0' && download.progress == 100);
    }

    get hasNewAdminDownload() {
        return this.adminDownloads.some(download => download.downloadAttempts == '0' && download.progress == 100);
    }

    showGlobalNotificationVisible() {
        this.globalNotificationVisible = true;
        document.body.classList.add('global-notification-on');
    }

    hideGlobalNotificationVisible() {
        this.globalNotificationVisible = false;
        document.body.classList.remove('global-notification-on');
    }

    getAlertMessage() {
        this.settingsService.getAlert().subscribe(event => {

            if (event instanceof HttpResponse) {
                this.englishMessage = event.body['englishMessage'] as String;
                this.arabicMessage = event.body['arabicMessage'] as String;
                let alrtUrl = this.englishMessage.match(/(https:)[a-zA-Z\/0-9\.\-/%_]*(.(xlsx|pdf|))/);
                if (alrtUrl != null) {
                    this.englishMessage = this.englishMessage.replace(alrtUrl[0], `<a href='${alrtUrl[0]}'
                    target="_blank" > <span style='color:#87ceeb; text-decoration: underline'>Click Here</span> </a>`)
                    if (this.arabicMessage != null) {
                        this.arabicMessage = this.arabicMessage + `<a href='${alrtUrl[0]}'
                        target="_blank" > <span style='color:#87ceeb; text-decoration: underline'>اضغط هنا</span></a>`;
                    }
                }
                this.startDateAlert = new Date(event.body['startDate']).getTime();
                this.endDateAlert = new Date(event.body['endDate']).getTime();
            }
        }, errorEvent => {
            if (errorEvent instanceof HttpErrorResponse) {
                console.log(errorEvent.error);
            }
        });
    }


    get isShowAlert() {
        var dateToday = new Date().getTime();
        let alert = this.startDateAlert <= dateToday && this.endDateAlert >= dateToday;
        if (alert) {
            this.showGlobalNotificationVisible();
        } else {
            this.hideGlobalNotificationVisible();
        }

        return alert;
    }

    getAnnouncements() {
        console.log(this.sharedServices.providerId)
        let AnnouncementsInfo = [];

        this.notificationsService.getAnnouncementsByProvider(this.sharedServices.providerId).subscribe(event => {
            if (event instanceof HttpResponse) {

                AnnouncementsInfo = event.body["content"];
                if (AnnouncementsInfo.length > 0) {
                    localStorage.setItem('hasDisplayedAnnouncementDialogue', "true");
                    this.dialog.open(AnnountmentDialogComponent, {

                        panelClass: ['primary-dialog'],
                        data: { AnnouncementsInfo: AnnouncementsInfo },
                        autoFocus: false

                    })
                }
            }
        }, error => {
            console.log(error.message)
        })
    }

    get isClaimsEnabledSubmit(){
        this.isClaimsEnabled = localStorage.getItem("isClaimsEnabled") == "0" ? false : true;
        if (!this.isClaimsEnabled) {
            this.showGlobalNotificationVisible();
        }
        return this.isClaimsEnabled;
    }
checkClaimsEnabled(){

    if (!this.isClaimsEnabledSubmit) {
        
        this.adminService.getDeactivateReason(this.sharedServices.providerId).subscribe(event => {
            if (event instanceof HttpResponse) {
                this.deactivateReason = event.body as string;
                if (this.deactivateReason == null || this.deactivateReason == "") {
                    this.deactivateReason = 'Disconnected due to nonpayment. Please connect to waseel system administrative for further process.';
                }

             
            }
        }, error => {
            console.log(error)
        })
    }
}
}

