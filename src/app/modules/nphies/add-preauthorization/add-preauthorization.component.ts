import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AddEditPreauthorizationItemComponent } from '../add-edit-preauthorization-item/add-edit-preauthorization-item.component';
import { AddEditCareTeamModalComponent } from './add-edit-care-team-modal/add-edit-care-team-modal.component';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SharedServices } from 'src/app/services/shared.services';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BeneficiariesSearchResult } from 'src/app/models/nphies/beneficiaryFullTextSearchResult';
import { DatePipe } from '@angular/common';
import { AddEditDiagnosisModalComponent } from './add-edit-diagnosis-modal/add-edit-diagnosis-modal.component';
import { AddEditSupportingInfoModalComponent } from './add-edit-supporting-info-modal/add-edit-supporting-info-modal.component';
import { ProviderNphiesApprovalService } from 'src/app/services/providerNphiesApprovalService/provider-nphies-approval.service';
import { ConfirmationAlertDialogComponent } from 'src/app/components/confirmation-alert-dialog/confirmation-alert-dialog.component';
import { AddEditVisionLensSpecificationsComponent } from './add-edit-vision-lens-specifications/add-edit-vision-lens-specifications.component';

@Component({
  selector: 'app-add-preauthorization',
  templateUrl: './add-preauthorization.component.html',
  styles: []
})
export class AddPreauthorizationComponent implements OnInit {

  beneficiarySearchController = new FormControl();
  beneficiariesSearchResult: BeneficiariesSearchResult[] = [];
  selectedBeneficiary: BeneficiariesSearchResult;
  selectedPlanId: string;
  selectedPlanIdError: string;

  FormPreAuthorization: FormGroup = this.formBuilder.group({
    beneficiaryName: ['', Validators.required],
    beneficiaryId: ['', Validators.required],
    insurancePlanId: ['', Validators.required],
    dateOrdered: ['', Validators.required],
    type: ['', Validators.required],
    subType: [''],
    accidentType: ['', Validators.required],
    streetName: [''],
    city: [''],
    state: [''],
    country: [''],
    date: ['', Validators.required],
    dateWritten: ['', Validators.required],
    // prescriber: ['', Validators.required],
  });

  VisionSpecifications = [];
  SupportingInfo = [];
  CareTeams = [];
  Diagnosises = [];
  Items = [];

  model: any = {};

  isSubmitted = false;
  constructor(
    private dialog: MatDialog, private formBuilder: FormBuilder, private sharedServices: SharedServices, private datePipe: DatePipe,
    private beneficiaryService: ProvidersBeneficiariesService, private providerNphiesApprovalService: ProviderNphiesApprovalService) {

  }

  ngOnInit() {

  }

  searchBeneficiaries() {
    // tslint:disable-next-line:max-line-length
    this.beneficiaryService.beneficiaryFullTextSearch(this.sharedServices.providerId, this.FormPreAuthorization.controls.beneficiaryName.value).subscribe(event => {
      if (event instanceof HttpResponse) {
        const body = event.body;
        if (body instanceof Array) {
          this.beneficiariesSearchResult = body;
        }
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {

      }
    });
  }

  selectBeneficiary(beneficiary: BeneficiariesSearchResult) {
    const primaryPlanIndex = beneficiary.plans.findIndex(plan => plan.primary);
    if (primaryPlanIndex !== -1) {
      this.selectedPlanId = beneficiary.plans[primaryPlanIndex].planId;
    }
    this.selectedBeneficiary = beneficiary;
    this.FormPreAuthorization.patchValue({
      beneficiaryName: beneficiary.name + ' (' + beneficiary.documentId + ')',
      beneficiaryId: beneficiary.id
    });
  }

  isPlanExpired(date: Date) {
    if (date != null) {
      if (!(date instanceof Date)) {
        date = new Date(date);
      }
      return date.getTime() > Date.now() ? ' (Active)' : ' (Expired)';
    }
    return '';
  }

  openAddEditVisionLensDialog(visionSpecification: any = null) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog', 'dialog-xl'];
    dialogConfig.data = {
      // tslint:disable-next-line:max-line-length
      Sequence: (visionSpecification !== null) ? visionSpecification.sequence : (this.VisionSpecifications.length === 0 ? 1 : (this.VisionSpecifications[this.VisionSpecifications.length - 1].sequence + 1)),
      item: visionSpecification
    };

    const dialogRef = this.dialog.open(AddEditVisionLensSpecificationsComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.VisionSpecifications.find(x => x.sequence === result.sequence)) {
          this.VisionSpecifications.map(x => {
            if (x.sequence === result.sequence) {
              x.product = result.product;
              x.productName = result.productName;
              x.eye = result.eye;
              x.sphere = result.sphere;
              x.cyclinder = result.cyclinder;
              x.axis = result.axis;
              x.prismAmount = result.prismAmount;
              x.prismBase = result.prismBase;
              x.multifocalPower = result.multifocalPower;
              x.lensePower = result.lensePower;
              x.lenseBackCurve = result.lenseBackCurve;
              x.lenseDiameter = result.lenseDiameter;
              x.lenseDuration = result.lenseDuration;
              x.lenseColor = result.lenseColor;
              x.lenseBrand = result.lenseBrand;
              x.prismBaseName = result.prismBaseName;
              x.lenseNote = result.lenseNote;
            }
          });
        } else {
          this.VisionSpecifications.push(result);
        }
      }
    });
  }

  deleteVisionLens(index: number) {
    this.VisionSpecifications.splice(index, 1);
  }

  openAddEditCareTeam(careTeam: any = null) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog', 'dialog-xl'];
    dialogConfig.data = {
      // tslint:disable-next-line:max-line-length
      Sequence: (careTeam !== null) ? careTeam.sequence : (this.CareTeams.length === 0 ? 1 : (this.CareTeams[this.CareTeams.length - 1].sequence + 1)),
      item: careTeam
    };

    const dialogRef = this.dialog.open(AddEditCareTeamModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.CareTeams.find(x => x.sequence === result.sequence)) {
          this.CareTeams.map(x => {
            if (x.sequence === result.sequence) {
              x.practitionerName = result.practitionerName;
              x.physicianCode = result.physicianCode;
              x.practitionerRole = result.practitionerRole;
              x.careTeamRole = result.careTeamRole;
              x.speciality = result.speciality;
              x.speciallityCode = result.practitionerName;
              x.practitionerRoleName = result.practitionerRoleName;
              x.careTeamRoleName = result.careTeamRoleName;
            }
          });
        } else {
          this.CareTeams.push(result);
        }
      }
    });
  }

  deleteCareTeam(sequence: number, index: number) {

    if (this.Items.find(x => x.careTeamSequence.find(y => y === sequence))) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = ['primary-dialog', 'dialog-xl'];
      dialogConfig.data = {
        // tslint:disable-next-line:max-line-length
        mainMessage: 'Are you sure you want to delete this Care Team?',
        subMessage: 'This care team is referenced in some of the Items',
        mode: 'warning',
        hideNoButton: false
      };

      const dialogRef = this.dialog.open(ConfirmationAlertDialogComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.Items.find(x => x.careTeamSequence.splice(x.careTeamSequence.indexOf(sequence), 1));
          this.CareTeams.splice(index, 1);
        }
      });
    } else {
      this.CareTeams.splice(index, 1);
    }
  }

  openAddEditDiagnosis(diagnosis: any = null) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog', 'dialog-xl'];
    dialogConfig.data = {
      // tslint:disable-next-line:max-line-length
      Sequence: (diagnosis !== null) ? diagnosis.sequence : (this.Diagnosises.length === 0 ? 1 : (this.Diagnosises[this.Diagnosises.length - 1].sequence + 1)),
      item: diagnosis
    };

    const dialogRef = this.dialog.open(AddEditDiagnosisModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.Diagnosises.find(x => x.sequence === result.sequence)) {
          this.Diagnosises.map(x => {
            if (x.sequence === result.sequence) {
              x.diagnosisDescription = result.diagnosisDescription;
              x.type = result.type;
              x.onAdmission = result.onAdmission;
              x.diagnosisCode = result.diagnosisCode;
              x.typeName = result.typeName;
              x.onAdmissionName = result.onAdmissionName;
            }
          });
        } else {
          this.Diagnosises.push(result);
        }
      }
    });
  }

  deleteDiagnosis(index: number) {
    this.Diagnosises.splice(index, 1);
  }

  openAddEditItemDialog(itemModel: any = null) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog', 'dialog-xl'];
    dialogConfig.data = {
      // tslint:disable-next-line:max-line-length
      Sequence: (itemModel !== null) ? itemModel.sequence : (this.Items.length === 0 ? 1 : (this.Items[this.Items.length - 1].sequence + 1)),
      item: itemModel,
      careTeams: this.CareTeams,
      diagnosises: this.Diagnosises,
      supportingInfos: this.SupportingInfo,
      type: this.FormPreAuthorization.controls.type.value
    };

    const dialogRef = this.dialog.open(AddEditPreauthorizationItemComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.Items.find(x => x.sequence === result.sequence)) {
          this.Items.map(x => {
            if (x.sequence === result.sequence) {
              x.type = result.type;
              x.typeName = result.typeName,
                x.itemCode = result.itemCode;
              x.itemDescription = result.itemDescription;
              x.nonStandardCode = result.nonStandardCode;
              x.isPackage = result.isPackage;
              x.quantity = result.quantity;
              x.unitPrice = result.unitPrice;
              x.discount = result.discount;
              x.factor = result.factor;
              x.taxPercent = result.taxPercent;
              x.patientSharePercent = result.patientSharePercent;
              x.tax = result.tax;
              x.net = result.net;
              x.patientShare = result.patientShare;
              x.payerShare = result.payerShare;
              x.startDate = result.startDate;
              x.supportingInfoSequence = result.supportingInfoSequence;
              x.bnvm = result.careTeamSequence;
              x.diagnosisSequence = result.diagnosisSequence;
            }
          });
        } else {
          this.Items.push(result);
        }
      }
    });
  }

  deleteItem(index: number) {
    this.Items.splice(index, 1);
  }

  openAddEditSupportInfoDialog(supportInfoModel: any = null) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog', 'dialog-xl'];
    dialogConfig.data = {
      // tslint:disable-next-line:max-line-length
      Sequence: (supportInfoModel !== null) ? supportInfoModel.sequence : (this.SupportingInfo.length === 0 ? 1 : (this.SupportingInfo[this.SupportingInfo.length - 1].sequence + 1)),
      item: supportInfoModel
    };

    const dialogRef = this.dialog.open(AddEditSupportingInfoModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.SupportingInfo.find(x => x.sequence === result.sequence)) {
          this.SupportingInfo.map(x => {
            if (x.sequence === result.sequence) {
              x.category = result.category;
              x.code = result.code;
              x.fromDate = result.fromDate;
              x.toDate = result.toDate;
              x.value = result.value;
              x.reason = result.reason;
              x.attachment = result.attachment;
              x.codeName = result.codeName;
              x.reasonName = result.reasonName;
              x.fromDateStr = result.fromDateStr;
              x.toDateStr = result.toDateStr;
              x.unit = result.unit;
              x.byteArray = result.byteArray;
            }
          });
        } else {
          this.SupportingInfo.push(result);
        }
      }
    });
  }

  deleteSupportingInfo(index: number) {
    this.SupportingInfo.splice(index, 1);
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.FormPreAuthorization.valid) {
      this.model = {};
      this.sharedServices.loadingChanged.next(true);
      this.model.beneficiaryId = this.FormPreAuthorization.controls.beneficiaryId.value;
      this.model.insurancePlanId = this.FormPreAuthorization.controls.insurancePlanId.value;

      const preAuthorizationModel: any = {};
      preAuthorizationModel.dateOrdered = this.datePipe.transform(this.FormPreAuthorization.controls.dateOrdered.value, 'yyyy-MM-dd');
      preAuthorizationModel.type = this.FormPreAuthorization.controls.type.value;
      preAuthorizationModel.subType = this.FormPreAuthorization.controls.subType.value;
      this.model.preAuthorizationInfo = preAuthorizationModel;

      this.model.supportingInfo = this.SupportingInfo.map(x => {
        const model: any = {};
        model.sequence = x.sequence;
        model.category = x.category;
        model.code = x.code;
        model.fromDate = x.fromDate;
        model.toDate = x.toDate;
        model.value = x.value;
        model.reason = x.reason;
        model.attachment = x.byteArray;
        return model;
      });

      this.model.diagnosis = this.Diagnosises.map(x => {
        const model: any = {};
        model.sequence = x.sequence;
        model.diagnosisDescription = x.diagnosisDescription;
        model.type = x.type;
        model.onAdmission = x.onAdmission;
        model.diagnosisCode = x.diagnosisCode;
        return model;
      });

      const accidentModel: any = {};
      accidentModel.accidentType = this.FormPreAuthorization.controls.accidentType.value;
      accidentModel.streetName = this.FormPreAuthorization.controls.streetName.value;
      accidentModel.city = this.FormPreAuthorization.controls.city.value;
      accidentModel.state = this.FormPreAuthorization.controls.state.value;
      accidentModel.country = this.FormPreAuthorization.controls.country.value;
      accidentModel.date = this.datePipe.transform(this.FormPreAuthorization.controls.date.value, 'yyyy-MM-dd');
      this.model.accident = accidentModel;

      this.model.careTeam = this.CareTeams.map(x => {
        const model: any = {};
        model.sequence = x.sequence;
        model.practitionerName = x.practitionerName;
        model.physicianCode = x.physicianCode;
        model.practitionerRole = x.practitionerRole;
        model.careTeamRole = x.careTeamRole;
        model.speciality = x.speciality;
        model.specialityCode = x.speciallityCode;
        return model;
      });

      debugger
      if (this.FormPreAuthorization.controls.type.value === 'vision') {
        this.model.visionPrescription = {};
        // tslint:disable-next-line:max-line-length
        this.model.visionPrescription.dateWritten = this.datePipe.transform(this.FormPreAuthorization.controls.dateWritten.value, 'yyyy-MM-dd');
        // this.model.visionPrescription.prescriber = this.FormPreAuthorization.controls.prescriber.value;
        this.model.visionPrescription.lensSpecifications = this.VisionSpecifications.map(x => {
          const model: any = {};
          model.sequence = x.sequence;
          model.product = x.product;
          model.eye = x.eye;
          model.sphere = x.sphere;
          model.cyclinder = x.cyclinder;
          model.axis = x.axis;
          model.prismAmount = x.prismAmount;
          model.prismBase = x.prismBase;
          model.multifocalPower = x.multifocalPower;
          model.lensePower = x.lensePower;
          model.lenseBackCurve = x.lenseBackCurve;
          model.lenseDiameter = x.lenseDiameter;
          model.lenseDuration = x.lenseDuration;
          model.lenseColor = x.lenseColor;
          model.lenseBrand = x.lenseBrand;
          model.lenseNote = x.model;
          return model;
        });
      }

      this.model.items = this.Items.map(x => {
        const model: any = {};
        model.sequence = x.sequence;
        model.type = x.type;
        model.itemCode = x.itemCode;
        model.itemDescription = x.itemDescription;
        model.nonStandardCode = x.nonStandardCode;
        model.isPackage = x.isPackage;
        model.quantity = x.quantity;
        model.unitPrice = x.unitPrice;
        model.discount = x.discount;
        model.factor = x.factor;
        model.taxPercent = x.taxPercent;
        model.patientSharePercent = x.patientSharePercent;
        model.tax = x.tax;
        model.net = x.net;
        model.patientShare = x.patientShare;
        model.payerShare = x.payerShare;
        model.startDate = x.startDate;
        model.supportingInfoSequence = x.supportingInfoSequence;
        model.careTeamSequence = x.careTeamSequence;
        model.diagnosisSequence = x.diagnosisSequence;
        return model;
      });

      console.log('Model', this.model);
      this.providerNphiesApprovalService.sendApprovalRequest(this.sharedServices.providerId, this.model).subscribe(event => {
        if (event instanceof HttpResponse) {
          if (event.status === 200) {
            const body: any = event.body;
            if (body.status === 'OK') {
              if (body.errors && body.errors.length > 0) {
                const errors: any[] = [];
                body.errors.forEach(err => {
                  if (err.code && err.code.coding && err.code.coding.length > 0) {
                    err.code.coding.forEach(codeObj => {
                      errors.push(codeObj.code + ' : ' + codeObj.display);
                    });
                  }
                });
                this.showMessage('Error', body.message, 'alert', true, 'OK', errors);
              } else {
                this.showMessage('Success', body.message, 'success', true, 'OK');
              }
            }
          }
          this.sharedServices.loadingChanged.next(false);
        }
      }, error => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 400) {
            this.showMessage('Error', error.error.message, 'alert', true, 'OK', error.error.errors);
          } else if (error.status === 404) {
            this.showMessage('Error', error.error.message, 'alert', true, 'OK');
          } else if (error.status === 500) {
            this.showMessage('Error', error.error.message, 'alert', true, 'OK');
          }
          this.sharedServices.loadingChanged.next(false);
        }
      });
    }
  }

  showMessage(_mainMessage, _subMessage, _mode, _hideNoButton, _yesButtonText, _errors = null) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog', 'dialog-xl'];
    dialogConfig.data = {
      // tslint:disable-next-line:max-line-length
      mainMessage: _mainMessage,
      subMessage: _subMessage,
      mode: _mode,
      hideNoButton: _hideNoButton,
      yesButtonText: _yesButtonText,
      errors: _errors
    };
    const dialogRef = this.dialog.open(ConfirmationAlertDialogComponent, dialogConfig);
  }

}
