import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgScrollbarModule, SmoothScrollModule } from 'ngx-scrollbar';
import { AuditTrailComponent } from 'src/app/modules/adminstration/audit-trail/audit-trail.component';
import { ProviderMappingComponent } from 'src/app/pages/provider-mapping/provider-mapping.component';
import { ProvidersConfigComponent } from 'src/app/pages/providers-config/providers-config.component';
import { RequestInterceptorService } from 'src/app/services/RequestInterceptorService/request-interceptor.service';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared.module';
import { ProviderContractComponent } from './provider-contract/provider-contract.component';
import { AddProviderContractDialogComponent } from './add-provider-contract-dialog/add-provider-contract-dialog.component';
import { SwitchProviderComponentComponent } from './switch-provider/switch-provider-component/switch-provider-component.component';
import { TransactionsLogComponent } from './transactions-log/transactions-log.component';
import { CertificateConfigurationComponent } from 'src/app/pages/certificate-configuration/certificate-configuration.component';
import { CreateProviderComponent } from './create-provider/create-provider.component';
import { NphiesAttachmentConfigurationComponent } from 'src/app/pages/nphies-attachment-configuration/nphies-attachment-configuration.component';
import { CancelPreviousClaimComponent } from './cancel-previous-claim/cancel-previous-claim.component';
import { FeedbackSurveyComponent } from './feedback-survey/feedback-survey.component';
import { FeedbackSurveyDetailsComponent } from './feedback-survey-details/feedback-survey-details.component';
import { FeedbackSurveySelectProviderComponent } from './feedback-survey-select-provider/feedback-survey-select-provider.component';
import { AddFeedbackDateDialogComponent } from './feedback-select-date/feedback-select-date.component';
import { FeedbackPreviewComponent } from './feedback-preview/feedback.preview.component';

@NgModule({
  declarations: [
    AuditTrailComponent,
    ProvidersConfigComponent,
    ProviderMappingComponent,
    ProviderContractComponent,
    AddProviderContractDialogComponent,
    SwitchProviderComponentComponent,
    TransactionsLogComponent,
    CreateProviderComponent,
    NphiesAttachmentConfigurationComponent,
    CancelPreviousClaimComponent,
    FeedbackSurveyComponent,
    FeedbackSurveyDetailsComponent,
    FeedbackSurveySelectProviderComponent,
    AddFeedbackDateDialogComponent,
    FeedbackPreviewComponent
  ],
  imports: [
    RouterModule.forChild([
      { path: '', redirectTo: 'auditLogs' },
      { path: 'auditLogs', component: AuditTrailComponent },
      { path: 'transactions', component: TransactionsLogComponent },
      { path: 'config/providers', component: ProvidersConfigComponent },
      { path: 'config/providerMapping', component: ProviderMappingComponent },
      { path: 'config/providers/:providerId', component: ProvidersConfigComponent },
      { path: 'config/payer-payment-contract', component: ProviderContractComponent },
      { path: 'switch-provider', component: SwitchProviderComponentComponent },
      { path: 'config/providerCertificate', component: CertificateConfigurationComponent },
      { path: 'config/createProvider', component: CreateProviderComponent },
      { path: 'config/nphies-attachment-configuration', component: NphiesAttachmentConfigurationComponent },
      { path: 'config/cancelPreviousClaim', component: CancelPreviousClaimComponent }
    ]),
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    NgScrollbarModule,
    SmoothScrollModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptorService, multi: true },
  ],
  entryComponents: [
    AddProviderContractDialogComponent,
    FeedbackSurveySelectProviderComponent,
    AddFeedbackDateDialogComponent
  ]
})
export class AdminstrationModule { }
