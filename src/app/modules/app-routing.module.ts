import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { RouteCanActiveService } from '../services/routeCanActive/route-can-active.service';
import { SearchClaimsComponent } from '../pages/searchClaimsPage/search-claims.component';
import { NotificationsPageComponent } from '../pages/notifications-page/notifications-page.component';
import { AnnouncementsPageComponent } from '../pages/announcements-page/announcements-page.component';
import { LoginComponent } from '../pages/loginpage/login.component';
import { ClaimpageComponent } from '../pages/claimUploadignPage/claimpage.component';
import { UploadsHistoryComponent } from '../pages/uploads-history/uploads-history.component';
import { ReportsComponent } from '../pages/reports/reports-page.component';
import { GmReportsPageComponent } from '../pages/reports/globmed/gm-reports-page.component';
import { CleanClaimProgressReportComponent } from '../pages/clean-claim-progress-report/clean-claim-progress-report.component';
import { MainLayoutComponent } from '../main-layout/main-layout.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent },
      {
        path: '',
        component: MainLayoutComponent,
        children: [
          { path: '', component: DashboardComponent, canActivate: [RouteCanActiveService] },
          { path: ':providerId/claims', component: SearchClaimsComponent, canActivate: [RouteCanActiveService] },
          { path: ':providerId/notifications', component: NotificationsPageComponent, canActivate: [RouteCanActiveService] },
          { path: ':providerId/announcements', component: AnnouncementsPageComponent, canActivate: [RouteCanActiveService] },
          { path: 'upload', component: ClaimpageComponent, canActivate: [RouteCanActiveService] },
          { path: 'upload/history', component: UploadsHistoryComponent, canActivate: [RouteCanActiveService] },
          { path: 'summary', component: ClaimpageComponent, canActivate: [RouteCanActiveService] },
          { path: ':providerId/reports', component: ReportsComponent, canActivate: [RouteCanActiveService] },
          { path: ':providerId/globmed/reports', component: GmReportsPageComponent, canActivate: [RouteCanActiveService] },
          { path: 'clean-claim-progress-report', component: CleanClaimProgressReportComponent, canActivate: [RouteCanActiveService] },
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
            path: 'claims',
            loadChildren: () => import('./claim/claim.module').then(m => m.ClaimModule),
            canLoad: [RouteCanActiveService]
          },
          {
            path: 'reports/:providerId',
            loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule),
            canActivate: [RouteCanActiveService]
          }
        ]
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
