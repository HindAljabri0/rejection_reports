import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedServices } from 'src/app/services/shared.services';
import { BupaRejectionReportModel } from 'src/app/models/bupaRejectionReport';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { BupaRejectionConfirmDialogComponent } from '../bupa-rejection-confirm-dialog/bupa-rejection-confirm-dialog.component';
import { PercentPipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';

@Component({
  selector: 'app-bupa-rejection-report',
  templateUrl: './bupa-rejection-report.component.html',
  styles: []
})
export class BupaRejectionReportComponent implements OnInit {

  isLoading = false;
  bupaRejectionReportData: BupaRejectionReportModel = new BupaRejectionReportModel();
  minFractionDigits = '.2';
  subTotalBatchDiffrence = ['invalidMembership', 'diffInComputation', 'claimsNotReceived', 'invalidServiceCode', 'lateSubmission'];
  subTotalBatchVatDiffrence = ['invalidMembershipVat', 'diffInComputationVat', 'claimsNotReceivedVat', 'invalidServiceCodeVat', 'lateSubmissionVat'];
  subTotalDedeuction = ['appropriatenessOfCare', 'technicalContractual', 'priceListShortFallOrBilled', 'policyCompliance', 'preAuthorization', 'unwarrantedVariations', 'pharmacyBenefitManagement'];
  subTotalVatDeduction = ['appropriatenessOfCareVat', 'technicalContractualVat', 'priceListShortFallOrBilledVat', 'policyComplianceVat', 'preAuthorizationVat', 'unwarrantedVariationsVat', 'pharmacyBenefitManagementVat']
  constructor(private dialog: MatDialog, private percent: PercentPipe, private dialogService: DialogService) {
  }

  ngOnInit() {
  }

  controlClick(e) {
    e.currentTarget.querySelector('.form-control').focus();
  }

  saveClick(form: NgForm) {
    this.checkAllValuesHundredPercentBelow();
    this.bupaRejectionReportData.payerId = 319;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog'];
    dialogConfig.autoFocus = false;

    if (this.checkAllValuesHundredPercentBelow()) {
      this.dialogService.openMessageDialog(new MessageDialogData('', 'Please provide correct data as percentage cannot be greater than 100%', true));
      return;
    }

    const dialogRef = this.dialog.open(BupaRejectionConfirmDialogComponent, { panelClass: ['primary-dialog'], autoFocus: false, data: this.bupaRejectionReportData });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clearAllFields(form);
      }
    }, error => {

    });
  }
  checkAllValuesHundredPercentBelow() {
    let isPercentageHundredAbove = false;
    const allInputPercentageKeys = Object.keys(this.bupaRejectionReportData).filter(ele => ele.includes('Percent'));
    for (let item of allInputPercentageKeys) {
      const value = Number(this.bupaRejectionReportData[item].replace('%', ''));
      if (value > 100) {
        isPercentageHundredAbove = true;
        break;
      }
    }
    return isPercentageHundredAbove;
  }

  updatePercentageCalculation(item) {
    if (item !== "") {
      let isVatCalculation = item.indexOf("Vat") !== -1;
      let grandTotal = isVatCalculation ? this.bupaRejectionReportData.grandTotalRejectionVat : this.bupaRejectionReportData.grandTotalRejection;
      this.bupaRejectionReportData[item + 'Percent'] = grandTotal > 0 ? this.percent.transform(this.bupaRejectionReportData[item] / grandTotal, this.minFractionDigits) : 0;
    }

    this.bupaRejectionReportData.subTotalBatchDiff = this.calculateAllTotals(this.subTotalBatchDiffrence).toFixed(2);
    this.bupaRejectionReportData.subTotalBatchDiffVat = this.calculateAllTotals(this.subTotalBatchVatDiffrence).toFixed(2);
    this.bupaRejectionReportData.subTotalDeductions = this.calculateAllTotals(this.subTotalDedeuction).toFixed(2);
    this.bupaRejectionReportData.subTotalDeductionsVat = this.calculateAllTotals(this.subTotalVatDeduction).toFixed(2);

    this.bupaRejectionReportData.subTotalBatchDiffPercent = this.bupaRejectionReportData.grandTotalRejection === null ? (0).toString() : (this.bupaRejectionReportData.subTotalBatchDiff / this.bupaRejectionReportData.grandTotalRejection).toFixed(2).toString();
    this.bupaRejectionReportData.subTotalBatchDiffVatPercent = this.bupaRejectionReportData.grandTotalRejectionVat === null ? (0).toString() : (this.bupaRejectionReportData.subTotalBatchDiffVat / this.bupaRejectionReportData.grandTotalRejectionVat).toFixed(2).toString();

    this.bupaRejectionReportData.subTotalDeductionsPercent = this.bupaRejectionReportData.grandTotalRejection === null ? (0).toString() : (this.bupaRejectionReportData.subTotalDeductions / this.bupaRejectionReportData.grandTotalRejection).toFixed(2).toString();
    this.bupaRejectionReportData.subTotalDeductionsVatPercent = this.bupaRejectionReportData.grandTotalRejectionVat === null ? (0).toString() : (this.bupaRejectionReportData.subTotalDeductionsVat / this.bupaRejectionReportData.grandTotalRejectionVat).toFixed(2).toString();

  }

  calculateAllTotals(keys) {
    let sum = 0;
    keys.map((ele) => {
      sum += this.bupaRejectionReportData[ele];
    });
    return sum;
  }

  updateVatCalculation() {
    let grandTotalVat = this.bupaRejectionReportData.grandTotalRejectionVat = this.bupaRejectionReportData.batchDifferenceVat + this.bupaRejectionReportData.discountDifferenceVat + this.bupaRejectionReportData.deductibleDifferenceVat + this.bupaRejectionReportData.deductionVat + this.bupaRejectionReportData.pendingVat;
    if (this.bupaRejectionReportData.presentedNetBilledVat !== 0 && this.bupaRejectionReportData.presentedNetBilledVat !== null) {
      this.bupaRejectionReportData.approvedToPayVatPercent = this.percent.transform(this.bupaRejectionReportData.approvedToPayVat / this.bupaRejectionReportData.presentedNetBilledVat, this.minFractionDigits);
      this.bupaRejectionReportData.grandTotalRejectionVatPercent = this.percent.transform(this.bupaRejectionReportData.grandTotalRejectionVat / this.bupaRejectionReportData.presentedNetBilledVat, this.minFractionDigits);
    }
    if (grandTotalVat !== 0) {
      this.bupaRejectionReportData.diffInComputationVatPercent = this.percent.transform(this.bupaRejectionReportData.diffInComputationVat / grandTotalVat, this.minFractionDigits);
      this.bupaRejectionReportData.claimsNotReceivedVatPercent = this.percent.transform(this.bupaRejectionReportData.claimsNotReceivedVat / grandTotalVat, this.minFractionDigits);
      this.bupaRejectionReportData.invalidServiceCodeVatPercent = this.percent.transform(this.bupaRejectionReportData.invalidServiceCodeVat / grandTotalVat, this.minFractionDigits);
      this.bupaRejectionReportData.subTotalBatchDiffVatPercent = this.percent.transform(this.bupaRejectionReportData.subTotalBatchDiffVat / grandTotalVat, this.minFractionDigits);
      this.bupaRejectionReportData.appropriatenessOfCareVatPercent = this.percent.transform(this.bupaRejectionReportData.appropriatenessOfCareVat / grandTotalVat, this.minFractionDigits);
      this.bupaRejectionReportData.technicalContractualVatPercent = this.percent.transform(this.bupaRejectionReportData.technicalContractualVat / grandTotalVat, this.minFractionDigits);
      this.bupaRejectionReportData.consultInWithinFreeFollowUpVatPercent = this.percent.transform(this.bupaRejectionReportData.consultInWithinFreeFollowUpVat / grandTotalVat, this.minFractionDigits);
      this.bupaRejectionReportData.chargesServicesIncludedVatPercent = this.percent.transform(this.bupaRejectionReportData.chargesServicesIncludedVat / grandTotalVat, this.minFractionDigits);
      this.bupaRejectionReportData.duplicateRepeatedBillingOrFinallySettledVatPercent = this.percent.transform(this.bupaRejectionReportData.duplicateRepeatedBillingOrFinallySettledVat / grandTotalVat, this.minFractionDigits);
      this.bupaRejectionReportData.priceListShortFallOrBilledVatPercent = this.percent.transform(this.bupaRejectionReportData.priceListShortFallOrBilledVat / grandTotalVat, this.minFractionDigits);
      this.bupaRejectionReportData.policyComplianceVatPercent = this.percent.transform(this.bupaRejectionReportData.policyComplianceVat / grandTotalVat, this.minFractionDigits);
      this.bupaRejectionReportData.notCoveredByEffInsurancePolicyVatPercent = this.percent.transform(this.bupaRejectionReportData.notCoveredByEffInsurancePolicyVat / grandTotalVat, this.minFractionDigits);
      this.bupaRejectionReportData.outOfValidityByEffInsurancePolicyVatPercent = this.percent.transform(this.bupaRejectionReportData.outOfValidityByEffInsurancePolicyVat / grandTotalVat, this.minFractionDigits);
      this.bupaRejectionReportData.notPartOfPreAuthReqVatPercent = this.percent.transform(this.bupaRejectionReportData.notPartOfPreAuthReqVat / grandTotalVat, this.minFractionDigits);
      this.bupaRejectionReportData.alreadyRejectedCancelledAtPreAuthRequestVatPercent = this.percent.transform(this.bupaRejectionReportData.alreadyRejectedCancelledAtPreAuthRequestVat / grandTotalVat, this.minFractionDigits);
      this.bupaRejectionReportData.unwarrantedVariationsVatPercent = this.percent.transform(this.bupaRejectionReportData.unwarrantedVariationsVat / grandTotalVat, this.minFractionDigits);
      this.bupaRejectionReportData.pharmacyBenefitManagementVatPercent = this.percent.transform(this.bupaRejectionReportData.pharmacyBenefitManagementVat / grandTotalVat, this.minFractionDigits);
      this.bupaRejectionReportData.subTotalDeductionsVatPercent = this.percent.transform(this.bupaRejectionReportData.subTotalDeductionsVat / grandTotalVat, this.minFractionDigits);
      this.bupaRejectionReportData.presentedNetBilledVatPercent = this.bupaRejectionReportData.presentedNetBilledVat > 0 ? '100%' : '';
      this.bupaRejectionReportData.batchDifferenceVatPercent = this.percent.transform(this.bupaRejectionReportData.batchDifferenceVat / grandTotalVat, this.minFractionDigits);
      this.bupaRejectionReportData.discountDifferenceVatPercent = this.percent.transform(this.bupaRejectionReportData.discountDifferenceVat / grandTotalVat, this.minFractionDigits);
      this.bupaRejectionReportData.deductibleDifferenceVatPercent = this.percent.transform(this.bupaRejectionReportData.deductibleDifferenceVat / grandTotalVat, this.minFractionDigits);
      this.bupaRejectionReportData.deductionVatPercent = this.percent.transform(this.bupaRejectionReportData.deductionVat / grandTotalVat, this.minFractionDigits);
      this.bupaRejectionReportData.pendingVatPercent = this.percent.transform(this.bupaRejectionReportData.pendingVat / grandTotalVat, this.minFractionDigits);
      // this.bupaRejectionReportData.approvedToPayVatPercent =this.percent.transform(this.bupaRejectionReportData.approvedToPayVat / grandTotalVat,this.minFractionDigits);
      this.bupaRejectionReportData.preAuthorizationVatPercent = this.percent.transform(this.bupaRejectionReportData.preAuthorizationVat / grandTotalVat, this.minFractionDigits);
      this.bupaRejectionReportData.ageGenderMismatchVatPercent = this.percent.transform(this.bupaRejectionReportData.ageGenderMismatchVat / grandTotalVat, this.minFractionDigits);
      this.bupaRejectionReportData.requiresPreAuthRequestPerPolicyVatPercent = this.percent.transform(this.bupaRejectionReportData.requiresPreAuthRequestPerPolicyVat / grandTotalVat, this.minFractionDigits);
      this.bupaRejectionReportData.invalidMembershipVatPercent = this.percent.transform(this.bupaRejectionReportData.invalidMembershipVat / grandTotalVat, this.minFractionDigits);
    }
  }

  updateBillCalculation(item = null) {
    let grandTotal = this.bupaRejectionReportData.grandTotalRejection = this.bupaRejectionReportData.batchDifference + this.bupaRejectionReportData.discountDifference + this.bupaRejectionReportData.deductibleDifference + this.bupaRejectionReportData.deduction + this.bupaRejectionReportData.pending;
    if (this.bupaRejectionReportData.presentedNetBilled !== 0 && this.bupaRejectionReportData.presentedNetBilled !== null) {
      this.bupaRejectionReportData.approvedToPayPercent = this.percent.transform(this.bupaRejectionReportData.approvedToPay / this.bupaRejectionReportData.presentedNetBilled, this.minFractionDigits);
      this.bupaRejectionReportData.grandTotalRejectionPercent = this.percent.transform(this.bupaRejectionReportData.grandTotalRejection / this.bupaRejectionReportData.presentedNetBilled, this.minFractionDigits);
    }
    if (grandTotal !== 0) {
      this.bupaRejectionReportData.diffInComputationPercent = this.percent.transform(this.bupaRejectionReportData.diffInComputation / grandTotal, this.minFractionDigits);
      this.bupaRejectionReportData.claimsNotReceivedPercent = this.percent.transform(this.bupaRejectionReportData.claimsNotReceived / grandTotal, this.minFractionDigits);
      this.bupaRejectionReportData.invalidServiceCodePercent = this.percent.transform(this.bupaRejectionReportData.invalidServiceCode / grandTotal, this.minFractionDigits);
      this.bupaRejectionReportData.subTotalBatchDiffPercent = this.percent.transform(this.bupaRejectionReportData.subTotalBatchDiff / grandTotal, this.minFractionDigits);
      this.bupaRejectionReportData.appropriatenessOfCarePercent = this.percent.transform(this.bupaRejectionReportData.appropriatenessOfCare / grandTotal, this.minFractionDigits);
      this.bupaRejectionReportData.technicalContractualPercent = this.percent.transform(this.bupaRejectionReportData.technicalContractual / grandTotal, this.minFractionDigits);
      this.bupaRejectionReportData.consultInWithinFreeFollowUpPercent = this.percent.transform(this.bupaRejectionReportData.consultInWithinFreeFollowUp / grandTotal, this.minFractionDigits);
      this.bupaRejectionReportData.chargesServicesIncludedPercent = this.percent.transform(this.bupaRejectionReportData.chargesServicesIncluded / grandTotal, this.minFractionDigits);
      this.bupaRejectionReportData.duplicateRepeatedBillingOrFinallySettledPercent = this.percent.transform(this.bupaRejectionReportData.duplicateRepeatedBillingOrFinallySettled / grandTotal, this.minFractionDigits);
      this.bupaRejectionReportData.priceListShortFallOrBilledPercent = this.percent.transform(this.bupaRejectionReportData.priceListShortFallOrBilled / grandTotal, this.minFractionDigits);
      this.bupaRejectionReportData.policyCompliancePercent = this.percent.transform(this.bupaRejectionReportData.policyCompliance / grandTotal, this.minFractionDigits);
      this.bupaRejectionReportData.notCoveredByEffInsurancePolicyPercent = this.percent.transform(this.bupaRejectionReportData.notCoveredByEffInsurancePolicy / grandTotal, this.minFractionDigits);
      this.bupaRejectionReportData.outOfValidityByEffInsurancePolicyPercent = this.percent.transform(this.bupaRejectionReportData.outOfValidityByEffInsurancePolicy / grandTotal, this.minFractionDigits);
      this.bupaRejectionReportData.notPartOfPreAuthReqPercent = this.percent.transform(this.bupaRejectionReportData.notPartOfPreAuthReq / grandTotal, this.minFractionDigits);
      this.bupaRejectionReportData.alreadyRejectedCancelledAtPreAuthRequestPercent = this.percent.transform(this.bupaRejectionReportData.alreadyRejectedCancelledAtPreAuthRequest / grandTotal, this.minFractionDigits);
      this.bupaRejectionReportData.unwarrantedVariationsPercent = this.percent.transform(this.bupaRejectionReportData.unwarrantedVariations / grandTotal, this.minFractionDigits);
      this.bupaRejectionReportData.pharmacyBenefitManagementPercent = this.percent.transform(this.bupaRejectionReportData.pharmacyBenefitManagement / grandTotal, this.minFractionDigits);
      this.bupaRejectionReportData.subTotalDeductionsPercent = this.percent.transform(this.bupaRejectionReportData.subTotalDeductions / grandTotal, this.minFractionDigits);
      this.bupaRejectionReportData.presentedNetBilledPercent = this.bupaRejectionReportData.presentedNetBilled > 0 ? '100%' : '';
      this.bupaRejectionReportData.batchDifferencePercent = this.percent.transform(this.bupaRejectionReportData.batchDifference / grandTotal, this.minFractionDigits);
      this.bupaRejectionReportData.discountDifferencePercent = this.percent.transform(this.bupaRejectionReportData.discountDifference / grandTotal, this.minFractionDigits);
      this.bupaRejectionReportData.deductibleDifferencePercent = this.percent.transform(this.bupaRejectionReportData.deductibleDifference / grandTotal, this.minFractionDigits);
      this.bupaRejectionReportData.deductionPercent = this.percent.transform(this.bupaRejectionReportData.deduction / grandTotal, this.minFractionDigits);
      this.bupaRejectionReportData.pendingPercent = this.percent.transform(this.bupaRejectionReportData.pending / grandTotal, this.minFractionDigits);
      this.bupaRejectionReportData.preAuthorizationPercent = this.percent.transform(this.bupaRejectionReportData.preAuthorization / grandTotal, this.minFractionDigits);
      this.bupaRejectionReportData.ageGenderMismatchPercent = this.percent.transform(this.bupaRejectionReportData.ageGenderMismatch / grandTotal, this.minFractionDigits);
      this.bupaRejectionReportData.requiresPreAuthRequestPerPolicyPercent = this.percent.transform(this.bupaRejectionReportData.requiresPreAuthRequestPerPolicy / grandTotal, this.minFractionDigits);
      this.bupaRejectionReportData.invalidMembershipPercent = this.percent.transform(this.bupaRejectionReportData.invalidMembership / grandTotal, this.minFractionDigits);
    }
  }

  clearAllFields(form: NgForm) {
    form.resetForm();
    setTimeout(() => {
      this.bupaRejectionReportData = new BupaRejectionReportModel();
    })
  }
}
