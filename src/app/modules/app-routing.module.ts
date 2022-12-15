import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { RouteCanActiveService } from '../services/routeCanActive/route-can-active.service';
import { SearchClaimsComponent } from '../pages/searchClaimsPage/search-claims.component';
import { NotificationsPageComponent } from '../pages/notifications-page/notifications-page.component';
import { AnnouncementsPageComponent } from '../pages/announcements-page/announcements-page.component';
import { LoginComponent } from '../pages/loginpage/login.component';
import { LoginWithTokenComponent } from '../pages/loginpage-with-token/login-with-token.component';
import { ClaimpageComponent } from '../pages/claimUploadignPage/claimpage.component';
import { UploadsHistoryComponent } from '../pages/uploads-history/uploads-history.component';
import { ReportsComponent } from '../pages/reports/reports-page.component';
import { GmReportsPageComponent } from '../pages/reports/globmed/gm-reports-page.component';
import { MainLayoutComponent } from '../main-layout/main-layout.component';
import { UploadsPageComponent } from '../pages/uploads-page/uploads-page.component';
import { MainClaimPageComponent } from '../claim-module-components/main-claim-page/main-claim-page.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: 'login', component: LoginComponent },
            { path: 'loginWithToken', component: LoginWithTokenComponent },
            {
                path: '',
                component: MainLayoutComponent,
                children: [
                    { path: '', component: DashboardComponent, canActivate: [RouteCanActiveService] },
                    { path: ':providerId/claims', component: SearchClaimsComponent, canActivate: [RouteCanActiveService] },
                    { path: 'claims/:id', component: MainClaimPageComponent, canActivate: [RouteCanActiveService] },
                    { path: ':providerId/notifications', component: NotificationsPageComponent, canActivate: [RouteCanActiveService] },
                    { path: ':providerId/announcements', component: AnnouncementsPageComponent, canActivate: [RouteCanActiveService] },
                    { path: 'upload', component: ClaimpageComponent, canActivate: [RouteCanActiveService] },
                    { path: 'uploads', component: UploadsPageComponent, canActivate: [RouteCanActiveService] },
                    { path: 'upload/history', component: UploadsHistoryComponent, canActivate: [RouteCanActiveService] },
                    { path: 'summary', component: ClaimpageComponent, canActivate: [RouteCanActiveService] },
                    { path: ':providerId/reports', component: ReportsComponent, canActivate: [RouteCanActiveService] },
                    { path: ':providerId/globmed/reports', component: GmReportsPageComponent, canActivate: [RouteCanActiveService] },
                    {
                        path: 'tawuniya-gss',
                        loadChildren: () => import('./tawuniya-gss/tawuniya-gss.module').then(m => m.TawuniyaGssModule),
                        canLoad: [RouteCanActiveService]
                    },
                    {
                        path: 'configurations',
                        loadChildren: () => import('./configurations/configurations.module').then(m => m.ConfigurationsModule),
                        canLoad: [RouteCanActiveService]
                    },
                    {
                        path: 'administration',
                        loadChildren: () => import('./adminstration/adminstration.module').then(m => m.AdminstrationModule),
                        canLoad: [RouteCanActiveService]
                    },
                    {
                        path: ':providerId/claims',
                        loadChildren: () => import('./claim/claim.module').then(m => m.ClaimModule),
                        canActivate: [RouteCanActiveService]
                    },

                    {
                        path: 'reports',
                        loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule),
                        canActivate: [RouteCanActiveService]
                    },
                    {
                        path: 'reports/:providerId',
                        loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule),
                        canActivate: [RouteCanActiveService]
                    },
                    {
                        path: ':providerId/reports',
                        loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule),
                        canActivate: [RouteCanActiveService]
                    },
                    {
                        path: 'collection-management',
                        loadChildren: () =>
                            import('./collection-management/collection-management.module').then(m => m.CollectionManagementModule),
                        canActivate: [RouteCanActiveService]
                    },
                    {
                        path: 'nphies',
                        loadChildren: () => import('./nphies/nphies.module').then(m => m.NphiesModule),
                        canActivate: [RouteCanActiveService]
                    },
                    {
                        path: 'contract-management',
                        loadChildren: () =>
                            import('./contract-management/contract-management.module').then(m => m.ContractManagementModule),
                        canActivate: [RouteCanActiveService]
                    },
                    {
                        path: 'policy-management',
                        loadChildren: () => import('./policy-management/policy-management.module').then(m => m.PolicyManagementModule),
                        canActivate: [RouteCanActiveService]
                    },
                    {
                        path: 'billing-management',
                        loadChildren: () => import('./billing-management/billing-management.module').then(m => m.BillingManagementModule),
                        canActivate: [RouteCanActiveService]
                    },
                    {
                        path: 'review',
                        loadChildren: () => import('./claim-review/claim-review.module').then(m => m.ClaimReviewModule),
                        canActivate: [RouteCanActiveService]
                    },
                    { path: '**', component: DashboardComponent, canActivate: [RouteCanActiveService] },
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
