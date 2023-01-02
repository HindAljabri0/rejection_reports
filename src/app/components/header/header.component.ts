import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SharedServices } from '../../services/shared.services';
import { AuthService } from 'src/app/services/authService/authService.service';
import { Router } from '@angular/router';
import { DownloadService } from 'src/app/services/downloadService/download.service';
import { DownloadRequest } from 'src/app/models/downloadRequest';
import { MatMenuTrigger } from '@angular/material';
import { NotificationsService } from 'src/app/services/notificationService/notifications.service';
import { ReportsService } from 'src/app/services/reportsService/reports.service';
import { HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import { getUserPrivileges, initState, UserPrivileges } from 'src/app/store/mainStore.reducer';


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
        private downloadService: DownloadService,
        private notificationService: NotificationsService,
        private reportsService: ReportsService,
        private store: Store
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

    ngOnInit() {

        if (environment.showFreshChat) {
            this.showWhatsAppSupport = true;
            this.showFreshChatBox();
        }

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
        this.sharedServices.getProcessedCount();
        this.sharedServices.getCommunicationRequestCount();
        this.sharedServices.getRecentReconciliationCount();
        this.sharedServices.getClaimProcessedCount();
        this.sharedServices.getClaimCommunicationRequestCount();
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
        return this.userPrivileges.ProviderPrivileges.WASEEL_CLAIMS.isClaimUser || this.userPrivileges.ProviderPrivileges.NPHIES.isAdmin || this.userPrivileges.ProviderPrivileges.NPHIES.canAccessClaim;
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
            const splitedValue: string[] = value.split(':');

            if (splitedValue[0] === 'approval-notifications') {
                this.sharedServices.getProcessedCount();
            }

            if (splitedValue[0] === 'approval-communication-request-notification') {
                this.sharedServices.getCommunicationRequestCount();
            }

            if (splitedValue[0] === 'payment-reconciliation-notification') {
                this.sharedServices.getRecentReconciliationCount();
            }

            if (splitedValue[0] === 'claim-notifications') {
                this.sharedServices.getClaimProcessedCount();
            }

            if (splitedValue[0] === 'claim-communication-request-notification') {
                this.sharedServices.getClaimCommunicationRequestCount();
            }


        });
    }


    showFreshChatBox() {
        window['fcWidget'].init({
            token: '32afa4a2-e443-4a99-aa8b-67e3a6639fd2',
            host: 'https://wchat.freshchat.com'
        });
    }

    get hasNewProviderDownload() {
        return this.providerDownloads.some(download => download.downloadAttempts == '0' && download.progress == 100);
    }

    get hasNewAdminDownload() {
        return this.adminDownloads.some(download => download.downloadAttempts == '0' && download.progress == 100);
    }
}
