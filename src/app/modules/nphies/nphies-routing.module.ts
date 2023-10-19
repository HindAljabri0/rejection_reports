import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BeneficiaryComponent } from './beneficiary/beneficiary.component';
import { AddPreauthorizationComponent } from './add-preauthorization/add-preauthorization.component';
import { EligibilityTransactionsComponent } from './eligibility-transactions/eligibility-transactions.component';
import { EligibilityComponent } from './eligibility/eligibility.component';
import { InsurancePlanComponent } from './insurance-plan/insurance-plan.component';
import { PreauthorizationTransactionsComponent } from './preauthorization-transactions/preauthorization-transactions.component';
import { PaymentReconciliationComponent } from './payment-reconciliation/payment-reconciliation.component';
import { PaymentReconciliationDetailsComponent } from './payment-reconciliation-details/payment-reconciliation-details.component';
import { SearchBeneficiaryComponent } from './search-beneficiary/search-beneficiary.component';
import { NphiesUploadsComponent } from './nphies-uploads/nphies-uploads.component';
import { UploadClaimComponent } from './upload-claim/upload-claim.component';
import { UploadsHistoryComponent } from './uploads-history/uploads-history.component';
import { NphiesConfigurationsComponent } from './nphies-configurations/nphies-configurations.component';
import { UploadBeneficiaryComponent } from './upload-beneficiary/upload-beneficiary.component';
import { PhysiciansComponent } from './physicians/physicians.component';
import { PricelistComponent } from './pricelist/pricelist.component';
import { PricelistDetailsComponent } from './pricelist-details/pricelist-details.component';
import { PreparePreAuthForClaimComponent } from './prepare-pre-auth-for-claim/prepare-pre-auth-for-claim.component';
import { ConvertPreAuthToClaimComponent } from './convert-pre-auth-to-claim/convert-pre-auth-to-claim.component';
import { DaysOfSupplyUploadComponent } from './days-of-supply-upload/days-of-supply-upload.component';
import { MedicationDaysUploadComponent } from './medication-days-upload/medication-days-upload.component';
import { SwitchGroupProviderComponent } from './switch-group-provider/switch-group-provider.component';
import { AdvancePreauthTransactionsComponent } from './advance-preauth-transactions/advance-preauth-transactions.component';
import { AttachmentsReportComponent } from './attachments-report/attachments-report.component';
import { AddPrescriptionComponent } from './add-prescription/add-prescription.component';
import { PrescriptionTransactionsComponent } from './prescription-transactions/prescription-transactions.component';
import { ExtractClaimsComponent } from './extract-claims/extract-claims.component';
import { UploadBeneficiaryInquireCchiComponent } from './upload-beneficiary-inquire-cchi/upload-beneficiary-inquire-cchi.component';
import { BeneficiaryUploadsSummaryComponent } from './beneficiary-uploads-summary/beneficiary-uploads-summary.component';
import { AddCNHIPreauthorizationComponent } from './add-preauth-cnhi/add-preauth-cnhi.component';

const routes: Routes = [
    { path: 'eligibility', component: EligibilityComponent },
    { path: 'eligibility-transactions', component: EligibilityTransactionsComponent },
    { path: 'beneficiary/upload', component: UploadBeneficiaryComponent },
    { path: 'beneficiary/upload-cchi', component: UploadBeneficiaryInquireCchiComponent },
    { path: 'beneficiary/upload-summary', component: BeneficiaryUploadsSummaryComponent },
    { path: 'beneficiary/:beneficiaryId/edit', component: BeneficiaryComponent },
    { path: 'beneficiary/:beneficiaryId', component: BeneficiaryComponent },
    { path: 'beneficiary/add', component: BeneficiaryComponent },
    { path: 'add-preauthorization', component: AddPreauthorizationComponent },
    { path: 'add-cnhi-preauthorization', component: AddCNHIPreauthorizationComponent },
    { path: 'preauthorization-transactions', component: PreauthorizationTransactionsComponent },
    { path: 'add-prescription', component: AddPrescriptionComponent },
    { path: 'prescription-transactions', component: PrescriptionTransactionsComponent },
    { path: 'advance-preauth-transactions', component: AdvancePreauthTransactionsComponent },
    { path: 'insurance-plans', component: InsurancePlanComponent },
    { path: 'payment-reconciliation', component: PaymentReconciliationComponent },
    { path: 'payment-reconciliation-details/:reconciliationId', component: PaymentReconciliationDetailsComponent },
    { path: 'beneficiary', component: SearchBeneficiaryComponent },
    { path: 'uploads', component: NphiesUploadsComponent },
    { path: 'upload-claim', component: UploadClaimComponent },
    { path: 'upload/history', component: UploadsHistoryComponent },
    { path: 'summary', component: UploadClaimComponent },
    { path: 'configurations', component: NphiesConfigurationsComponent },
    { path: 'physicians', component: PhysiciansComponent },
    { path: 'pricelist', component: PricelistComponent },
    { path: 'pricelist-details', component: PricelistDetailsComponent },
    { path: 'prepare-pre-auth-for-claim', component: PreparePreAuthForClaimComponent },
    { path: 'convert-pre-auth-to-claim', component: ConvertPreAuthToClaimComponent },
    { path: 'days-of-supply-upload', component: DaysOfSupplyUploadComponent },
    { path: 'medication-days-upload', component: MedicationDaysUploadComponent },
    { path: 'switch-group-provider', component: SwitchGroupProviderComponent },
    { path: 'attachments-report', component: AttachmentsReportComponent },
    { path: 'extract-claims', component: ExtractClaimsComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NphiesRoutingModule { }
