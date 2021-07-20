import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { Store } from '@ngrx/store';
import { getPaginationControl } from 'src/app/claim-module-components/store/claim.reducer';
import { CreditReportService } from 'src/app/services/creditReportService/creditReport.service';
import { Subscription } from 'rxjs';
import { SummaryType } from 'src/app/models/allCreditSummaryDetailsModels/summaryType';
import { ActivatedRoute } from '@angular/router';
import { AppropriatenessCareModel } from 'src/app/models/allCreditSummaryDetailsModels/deduction/apprCareness';
import { InvalidMembershipModel } from 'src/app/models/allCreditSummaryDetailsModels/batchDiffrence/invalidMembership';
import { DiffrenceInComputationModel } from 'src/app/models/allCreditSummaryDetailsModels/batchDiffrence/diffInComputattion';
import { ClaimNotReceivedModel } from 'src/app/models/allCreditSummaryDetailsModels/batchDiffrence/claNotReceived';
import { InvalidServiceCodeModel } from 'src/app/models/allCreditSummaryDetailsModels/batchDiffrence/invalidServiceCode';
import { LateSubmissionModel } from 'src/app/models/allCreditSummaryDetailsModels/batchDiffrence/lateSubmission';
import { SubTotalBatchDiffrenceModel } from 'src/app/models/allCreditSummaryDetailsModels/batchDiffrence/subTotalBatchDiff';
import { TechnicalContractualModel } from 'src/app/models/allCreditSummaryDetailsModels/deduction/technicalContractual';
import { FollowUpPeriodModel } from 'src/app/models/allCreditSummaryDetailsModels/deduction/followUpPeriod';
import { ChargesOfManagementModel } from 'src/app/models/allCreditSummaryDetailsModels/deduction/chargesOfManagement';
import { FinallySettledModel } from 'src/app/models/allCreditSummaryDetailsModels/deduction/finallySettledModel';
import { PriceBilledAgreedModel } from 'src/app/models/allCreditSummaryDetailsModels/deduction/priceBilledAgreed';
import { WaitingPeriodModel } from 'src/app/models/allCreditSummaryDetailsModels/deduction/waitingPeriod';
import { InsurancePolicyModel } from 'src/app/models/allCreditSummaryDetailsModels/deduction/insurancePolicy';
import { ServicePeriodModel } from 'src/app/models/allCreditSummaryDetailsModels/deduction/servicePeriod';
import { PolicyComplainceModel } from 'src/app/models/allCreditSummaryDetailsModels/deduction/policyCompliance';
import { PreAuthorizationModel } from 'src/app/models/allCreditSummaryDetailsModels/deduction/preAuthorization';
import { RequirePolicyModel } from 'src/app/models/allCreditSummaryDetailsModels/deduction/requirePolicy';
import { AuthorizationRequestModel } from 'src/app/models/allCreditSummaryDetailsModels/deduction/authorizationRequest';
import { UnwantedVariationModel } from 'src/app/models/allCreditSummaryDetailsModels/deduction/unwantedVariation';
import { PharmacyBenefitManagementModel } from 'src/app/models/allCreditSummaryDetailsModels/deduction/pharmacyBenefitManagement';
import { SubtotalDeductionModel } from 'src/app/models/allCreditSummaryDetailsModels/deduction/subtotalDeduction';
import { PresentNetBilledModel } from 'src/app/models/allCreditSummaryDetailsModels/statementSummary/presentNetBilled';
import { BatchDiffrenceModel } from 'src/app/models/allCreditSummaryDetailsModels/statementSummary/batchDiff';
import { DiscountDiffrenceModel } from 'src/app/models/allCreditSummaryDetailsModels/statementSummary/discountDiff';
import { DeductibleDiffrenceModel } from 'src/app/models/allCreditSummaryDetailsModels/statementSummary/deductibleDiff';
import { DeductionModel } from 'src/app/models/allCreditSummaryDetailsModels/statementSummary/deduction';
import { PendingModel } from 'src/app/models/allCreditSummaryDetailsModels/statementSummary/pending';
import { GrandTotalRejectionAmountModel } from 'src/app/models/allCreditSummaryDetailsModels/statementSummary/grandTotRejAmount';
import { ApprovedPayModel } from 'src/app/models/allCreditSummaryDetailsModels/statementSummary/apprToPay';
import { ConsultattionManagementModel } from 'src/app/models/allCreditSummaryDetailsModels/deduction/consultationManagement';
import { CancelPreAuthorizationModel } from 'src/app/models/allCreditSummaryDetailsModels/deduction/cancelPreAuthorization';

@Component({
  selector: 'app-bupa-rejection-upload-details',
  templateUrl: './credit-report-summary-details.component.html',
  styles: []
})
export class CreditReportSummaryDetailsComponent implements OnInit, OnDestroy {

  public chartOneLabels: Label[] = ['Rejection Medical Reasons Breakdown', 'Rejection Medical Reasons Breakdown'];
  public chartOneData: ChartDataSets[] = [
    {
      data: [66, 34],
      borderWidth: 0,
      backgroundColor: ['#DB53D1', '#2D47D6'],
      hoverBackgroundColor: ['#DB53D1', '#2D47D6']
    }
  ];
  public chartOneType: ChartType = 'doughnut';
  public chartOneOptions: ChartOptions = {
    responsive: true,
    legend: {
      display: false
    },
    aspectRatio: 1,
    cutoutPercentage: 75,
    plugins: {
      datalabels: {
        display: false
      }
    },
    tooltips: {
      enabled: false
    }
  };
  paginationControl: {
    currentIndex: number;
    size: number;
  };
  private subscription = new Subscription();

  invalidMembershipModel: InvalidMembershipModel[];
  diffrenceInComputationModel: DiffrenceInComputationModel[];
  claimNotReceivedModel: ClaimNotReceivedModel[];
  invalidServiceCodeModel: InvalidServiceCodeModel[];
  lateSubmissionModel: LateSubmissionModel[];
  subtotalBatchDiffrenceModel: SubTotalBatchDiffrenceModel[];
  appropriateCareModel: AppropriatenessCareModel[];
  technicalContractualModel: TechnicalContractualModel;
  followUpPeriodModel: FollowUpPeriodModel[];
  managentModel: ConsultattionManagementModel[];
  finallySettledModel: FinallySettledModel[];
  priceShortFillModel: PriceBilledAgreedModel[];
  waitingPeriodModel: WaitingPeriodModel[];
  insurancePolicyModel: InsurancePolicyModel[];
  serviceProvidedModel: ServicePeriodModel[];
  policyComplianceModel: PolicyComplainceModel[];
  preAuthorizationModel: PreAuthorizationModel[];
  requirePolicyModel: RequirePolicyModel[];
  authRequestModel: AuthorizationRequestModel[];
  cancelPreAuthorizationModel: CancelPreAuthorizationModel[];
  unwantedVariationModel: UnwantedVariationModel[];
  pharmecyBenefitModel: PharmacyBenefitManagementModel[];
  subTotalDeductionModel: SubtotalDeductionModel[];
  presentedNetBillModel: PresentNetBilledModel[];
  batchDiffrenceModel: BatchDiffrenceModel[];
  discountDiffrenceModel: DiscountDiffrenceModel[];
  deductionDiffrenceModel: DeductibleDiffrenceModel[];
  deductionModel: DeductionModel[];
  pendingModel: PendingModel[];
  grandTotalRejectionAmountModel: GrandTotalRejectionAmountModel[];
  approvedToPayModel: ApprovedPayModel[];
  columnsName = ['Claim ID', 'Bupa No', 'File No', 'Inv No', 'Group Name', 'Diagnosis', 'Service Description', 'Treatment Date',
    'Amt Shortfall Reason', 'Total Claimed Amt', 'Total SF Amt', 'VAT Rej. Amt'];
  summaryType: number;
  labelName: string;
  detailsConfig: any[] = [];
  summaryKeys: any = [];
  batchId: string;
  payerId: string;
  constructor(private store: Store, private creditReportService: CreditReportService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.summaryType = parseFloat(params['summaryType']);
      this.batchId = params['batchId'];
      this.payerId = params['payerId'];
    });

    // const datas = [{
    //   claimId: 149630342,
    //   bupaNo: 17948606,
    //   fileNo: 4421,
    //   invNo: 3881675,
    //   groupName: 'TATWEER FOR BUILDINGS',
    //   diagnosis: 'K29.9 - Gastritis and duodenitis, Gastroduodenitis, unspecif',
    //   serviceDescription: 'Lipid Profile / SGPT / Total Bilirubin / H. Pylory ag Stool / US Abdomen / AST (SGOT)',
    //   treatmentDate: new Date('13/01/2020'),
    //   amtShrotFallReason: '458.25 Early as per given data / condition',
    //   totalClaimedAmt: 536.49,
    //   totalSfAmt: 22.92,
    //   vatRejAmt: 458.25
    // }];
    const keyDatas = this.checkConfigType([]);

    if (keyDatas !== undefined) {
      this.summaryKeys = Object.keys(keyDatas[0]);
    }

    this.detailsConfig = this.creditReportService.detailsConfig;
    const data = this.detailsConfig.find(ele => ele.type === this.summaryType);
    this.labelName = data.label;

    this.store.select(getPaginationControl).subscribe(control => {
      this.paginationControl = control;
    });
    this.getCreditReportSummaryDetailsData();
  }

  checkConfigType(data) {
    switch (this.summaryType) {
      case SummaryType.invalMem:
        return this.invalidMembershipModel = data;
      case SummaryType.diffInCom:
        return this.diffrenceInComputationModel = data;
      case SummaryType.claNotRec:
        return this.claimNotReceivedModel = data;
      case SummaryType.invaSouCod:
        return this.invalidServiceCodeModel = data;
      case SummaryType.lateSub:
        return this.lateSubmissionModel = data;
      case SummaryType.subTotBatDiff:
        return this.subtotalBatchDiffrenceModel = data;
      case SummaryType.approCare:
        return this.appropriateCareModel = data;
      case SummaryType.techContr:
        return this.technicalContractualModel = data;
      case SummaryType.followUpPeriod:
        return this.followUpPeriodModel = data;
      case SummaryType.management:
        return this.managentModel = data;
      case SummaryType.finSettled:
        return this.finallySettledModel = data;
      case SummaryType.priceShortFall:
        return this.priceShortFillModel = data;
      case SummaryType.waitingPeriod:
        return this.waitingPeriodModel = data;
      case SummaryType.insPolicy:
        return this.insurancePolicyModel = data;
      case SummaryType.serProvided:
        return this.serviceProvidedModel = data;
      case SummaryType.poliCompi:
        return this.policyComplianceModel = data;
      case SummaryType.preAuth:
        return this.preAuthorizationModel = data;
      case SummaryType.reqPolicy:
        return this.requirePolicyModel = data;
      case SummaryType.authRequest:
        return this.authRequestModel = data;
      case SummaryType.preAuthorization:
        return this.cancelPreAuthorizationModel = data;
      case SummaryType.unwanTedVar:
        return this.unwantedVariationModel = data;
      case SummaryType.pharmecyBen:
        return this.pharmecyBenefitModel = data;
      case SummaryType.subTotDed:
        return this.subTotalDeductionModel = data;
      case SummaryType.presentNetBill:
        return this.presentedNetBillModel = data;
      case SummaryType.batcDiff:
        return this.batchDiffrenceModel = data;
      case SummaryType.disDiff:
        return this.discountDiffrenceModel = data;
      case SummaryType.dedDiff:
        return this.deductionDiffrenceModel = data;
      case SummaryType.deduct:
        return this.deductionModel = data;
      case SummaryType.pending:
        return this.pendingModel = data;
      case SummaryType.grTotRejAm:
        return this.grandTotalRejectionAmountModel = data;
      case SummaryType.approPay:
        return this.approvedToPayModel = data;
    }
  }
  getCreditReportSummaryDetailsData() {
    const batchId = '0';
    this.subscription.add(this.creditReportService.getCreditReportsList(batchId).subscribe((res: any) => {
      if (res.body !== undefined) {
        const data = JSON.stringify(res.body);
        const keyDatas = this.checkConfigType(data);
        this.summaryKeys = Object.keys(keyDatas[0]);
      }
    }, err => {
      console.log(err);
    }));
  }

  goToFirstPage() {
    if (this.paginationControl != null && this.paginationControl.currentIndex != 0) {


      if (this.paginationControl != null && this.paginationControl.currentIndex != 0) {

      }
    }
  }
  goToNextPage() {
    if (this.paginationControl != null && this.paginationControl.currentIndex + 1 < this.paginationControl.size) {

    }
  }
  goToLastPage() {
    if (this.paginationControl != null && this.paginationControl.currentIndex != this.paginationControl.size - 1) {
    }
  }
  goToPrePage() {
    if (this.paginationControl != null && this.paginationControl.currentIndex != 0) {
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get stype() {
    return SummaryType;
  }

}

