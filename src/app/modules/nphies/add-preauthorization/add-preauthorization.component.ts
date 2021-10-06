import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, ErrorStateMatcher } from '@angular/material';
import { AddEditPreauthorizationItemComponent } from '../add-edit-preauthorization-item/add-edit-preauthorization-item.component';
import { AddEditCareTeamModalComponent } from './add-edit-care-team-modal/add-edit-care-team-modal.component';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SharedServices } from 'src/app/services/shared.services';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BeneficiariesSearchResult } from 'src/app/models/nphies/beneficiaryFullTextSearchResult';
import { DatePipe } from '@angular/common';
import { AddEditDiagnosisModalComponent } from './add-edit-diagnosis-modal/add-edit-diagnosis-modal.component';
import { AddEditSupportingInfoModalComponent } from './add-edit-supporting-info-modal/add-edit-supporting-info-modal.component';
import { ProviderNphiesApprovalService } from 'src/app/services/providerNphiesApprovalService/provider-nphies-approval.service';
import { ConfirmationAlertDialogComponent } from 'src/app/components/confirmation-alert-dialog/confirmation-alert-dialog.component';
// tslint:disable-next-line:max-line-length
import { AddEditVisionLensSpecificationsComponent } from './add-edit-vision-lens-specifications/add-edit-vision-lens-specifications.component';
import * as moment from 'moment';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { nationalities } from 'src/app/claim-module-components/store/claim.reducer';
import { ReplaySubject } from 'rxjs';
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';

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

  filteredNations: ReplaySubject<{ Code: string, Name: string }[]> = new ReplaySubject<{ Code: string, Name: string }[]>(1);

  FormPreAuthorization: FormGroup = this.formBuilder.group({
    beneficiaryName: ['', Validators.required],
    beneficiaryId: ['', Validators.required],
    insurancePlanId: ['', Validators.required],
    dateOrdered: ['', Validators.required],
    type: ['', Validators.required],
    subType: [''],
    accidentType: [''],
    streetName: [''],
    city: [''],
    state: [''],
    country: [''],
    countryName: [''],
    date: [''],
    dateWritten: [''],
    // prescriber: ['', Validators.required],
  });

  typeList = this.sharedDataService.claimTypeList;
  //  [
  //   { value: 'institutional', name: 'Institutional' },
  //   { value: 'oral', name: 'Dental' },
  //   { value: 'pharmacy', name: 'Pharmacy' },
  //   { value: 'professional', name: 'Professional' },
  //   { value: 'vision', name: 'Optical' },
  // ];

  subTypeList = [];

  accidentTypeList = this.sharedDataService.accidentTypeList;
  // [
  //   { value: 'MVA', name: 'Motor vehicle accident' },
  //   { value: 'SCHOOL', name: 'School Accident' },
  //   { value: 'SPT', name: 'Sporting Accident' },
  //   { value: 'WPA', name: 'Workplace accident' },
  // ];

  VisionSpecifications = [];
  SupportingInfo = [];
  CareTeams = [];
  Diagnosises = [];
  Items = [];

  model: any = {};
  detailsModel: any = {};

  isSubmitted = false;
  IsLensSpecificationRequired = false;
  IsDiagnosisRequired = false;
  IsCareTeamRequired = false;
  IsItemRequired = false;
  IsDateWrittenRequired = false;

  IsDateRequired = false;
  IsAccidentTypeRequired = false;
  IsJSONPosted = false;

  today: Date;
  nationalities = nationalities;
  selectedCountry = '';

  constructor(
    private sharedDataService: SharedDataService,
    private dialog: MatDialog, private formBuilder: FormBuilder, private sharedServices: SharedServices, private datePipe: DatePipe,
    private providerNphiesSearchService: ProviderNphiesSearchService,
    private providerNphiesApprovalService: ProviderNphiesApprovalService) {
    this.today = new Date();
  }

  ngOnInit() {
    this.FormPreAuthorization.controls.dateOrdered.setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
    this.filteredNations.next(this.nationalities.slice());
  }

  filterNationality() {

    if (!this.nationalities) {
      return;
    }
    // get the search keyword
    let search = this.FormPreAuthorization.controls.nationalityFilterCtrl.value;
    if (!search) {
      this.filteredNations.next(this.nationalities.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the nations
    this.filteredNations.next(
      this.nationalities.filter(nation => nation.Name.toLowerCase().indexOf(search) > -1)
    );
  }

  onTypeChange($event) {
    switch ($event.value && $event.value.value) {
      case 'institutional':
        this.subTypeList = [
          { value: 'ip', name: 'InPatient' },
          { value: 'emr', name: 'Emergency' },
        ];
        break;
      case 'professional':
      case 'vision':
      case 'pharmacy':
      case 'oral':
        this.subTypeList = [
          { value: 'op', name: 'OutPatient' },
        ];
        break;
    }
  }

  searchBeneficiaries() {
    // tslint:disable-next-line:max-line-length
    this.providerNphiesSearchService.beneficiaryFullTextSearch(this.sharedServices.providerId, this.FormPreAuthorization.controls.beneficiaryName.value).subscribe(event => {
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
              x.cylinder = result.cylinder;
              x.axis = result.axis;
              x.prismAmount = result.prismAmount;
              x.prismBase = result.prismBase;
              x.multifocalPower = result.multifocalPower;
              x.lensPower = result.lensPower;
              x.lensBackCurve = result.lensBackCurve;
              x.lensDiameter = result.lensDiameter;
              x.lensDuration = result.lensDuration;
              x.lensDurationUnit = result.lensDurationUnit;
              x.lensDurationUnitName = result.lensDurationUnitName;
              x.lensColor = result.lensColor;
              x.lensBrand = result.lensBrand;
              x.prismBaseName = result.prismBaseName;
              x.lensNote = result.lensNote;
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
    if (this.VisionSpecifications.length === 0) {
      this.FormPreAuthorization.controls.dateWritten.clearValidators();
      this.FormPreAuthorization.controls.dateWritten.updateValueAndValidity();
      this.IsDateWrittenRequired = false;
    }
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
              x.speciallityCode = result.speciallityCode;
              x.practitionerRoleName = result.practitionerRoleName;
              x.careTeamRoleName = result.careTeamRoleName;
            }
          });
        } else {
          this.CareTeams.push(result);
          this.checkCareTeamValidation();
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
          this.Items.filter(x => x.careTeamSequence.find(y => y === sequence)).forEach(z => {
            z.careTeamSequence.splice(z.careTeamSequence.indexOf(sequence), 1);
          });
          this.CareTeams.splice(index, 1);
          this.checkCareTeamValidation();
        }
      });
    } else {
      this.CareTeams.splice(index, 1);
      this.checkCareTeamValidation();
    }
  }

  openAddEditDiagnosis(diagnosis: any = null) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog', 'dialog-xl'];
    dialogConfig.data = {
      // tslint:disable-next-line:max-line-length
      Sequence: (diagnosis !== null) ? diagnosis.sequence : (this.Diagnosises.length === 0 ? 1 : (this.Diagnosises[this.Diagnosises.length - 1].sequence + 1)),
      item: diagnosis,
      itemTypes: this.Diagnosises.map(x => {
        return x.type;
      }),
      type: this.FormPreAuthorization.controls.type.value ? this.FormPreAuthorization.controls.type.value.value : ''
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
          this.checkDiagnosisValidation();
        }
      }
    });
  }

  deleteDiagnosis(sequence: number, index: number) {

    if (this.Items.find(x => x.diagnosisSequence.find(y => y === sequence))) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = ['primary-dialog', 'dialog-xl'];
      dialogConfig.data = {
        // tslint:disable-next-line:max-line-length
        mainMessage: 'Are you sure you want to delete this Diagnosis?',
        subMessage: 'This diagnosis is referenced in some of the Items',
        mode: 'warning',
        hideNoButton: false
      };

      const dialogRef = this.dialog.open(ConfirmationAlertDialogComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.Items.filter(x => x.diagnosisSequence.find(y => y === sequence)).forEach(z => {
            z.diagnosisSequence.splice(z.diagnosisSequence.indexOf(sequence), 1);
          });
          this.Diagnosises.splice(index, 1);
          this.checkDiagnosisValidation();
        }
      });
    } else {
      this.Diagnosises.splice(index, 1);
      this.checkDiagnosisValidation();
    }
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
      type: this.FormPreAuthorization.controls.type.value.value,
      dateOrdered: this.FormPreAuthorization.controls.dateOrdered.value
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
              x.careTeamSequence = result.careTeamSequence;
              x.diagnosisSequence = result.diagnosisSequence;
            }
          });
        } else {
          this.Items.push(result);
          this.checkItemValidation();
        }
      }
    });
  }

  deleteItem(index: number) {
    this.Items.splice(index, 1);
    this.checkItemValidation();
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
              x.categoryName = result.categoryName;
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

  deleteSupportingInfo(sequence: number, index: number) {

    if (this.Items.find(x => x.supportingInfoSequence.find(y => y === sequence))) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = ['primary-dialog', 'dialog-xl'];
      dialogConfig.data = {
        // tslint:disable-next-line:max-line-length
        mainMessage: 'Are you sure you want to delete this Supporting Info?',
        subMessage: 'This supporting info is referenced in some of the Items',
        mode: 'warning',
        hideNoButton: false
      };

      const dialogRef = this.dialog.open(ConfirmationAlertDialogComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.Items.filter(x => x.supportingInfoSequence.find(y => y === sequence)).forEach(z => {
            z.supportingInfoSequence.splice(z.supportingInfoSequence.indexOf(sequence), 1);
          });
          this.SupportingInfo.splice(index, 1);
        }
      });
    } else {
      this.SupportingInfo.splice(index, 1);
    }
  }

  checkCareTeamValidation() {
    if (this.CareTeams.length === 0) {
      this.IsCareTeamRequired = true;
    } else {
      this.IsCareTeamRequired = false;
    }
  }

  checkDiagnosisValidation() {
    if (this.Diagnosises.length === 0) {
      this.IsDiagnosisRequired = true;
    } else {
      this.IsDiagnosisRequired = false;
    }
  }

  checkItemValidation() {
    if (this.Items.length === 0) {
      this.IsItemRequired = true;
    } else {
      this.IsItemRequired = false;
    }
  }

  checkItemCareTeams() {
    if (this.Items.length > 0) {
      if (this.Items.find(x => (x.careTeamSequence && x.careTeamSequence.length === 0))) {
        this.showMessage('Error', 'All Items must have atleast one care team', 'alert', true, 'OK');
        return false;
      } else {
        return true;
      }
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    let hasError = false;
    if (this.FormPreAuthorization.controls.date.value && !(this.FormPreAuthorization.controls.accidentType.value && this.FormPreAuthorization.controls.accidentType.value.value)) {
      this.FormPreAuthorization.controls.accidentType.setValidators([Validators.required]);
      this.FormPreAuthorization.controls.accidentType.updateValueAndValidity();
      this.IsAccidentTypeRequired = true;
      hasError = true;
    } else {
      this.FormPreAuthorization.controls.accidentType.clearValidators();
      this.FormPreAuthorization.controls.accidentType.updateValueAndValidity();
      this.IsAccidentTypeRequired = false;
    }

    if (this.FormPreAuthorization.controls.accidentType.value && this.FormPreAuthorization.controls.accidentType.value.value && !this.FormPreAuthorization.controls.date.value) {
      this.FormPreAuthorization.controls.date.setValidators([Validators.required]);
      this.FormPreAuthorization.controls.date.updateValueAndValidity();
      this.IsDateRequired = true;
      hasError = true;
    } else {
      this.FormPreAuthorization.controls.date.clearValidators();
      this.FormPreAuthorization.controls.date.updateValueAndValidity();
      this.IsDateRequired = false;
    }

    if (this.FormPreAuthorization.controls.type.value && this.FormPreAuthorization.controls.type.value.value === 'vision') {
      if (this.FormPreAuthorization.controls.dateWritten.value && this.VisionSpecifications.length === 0) {
        this.IsLensSpecificationRequired = true;
        hasError = true;
      } else {
        this.IsLensSpecificationRequired = false;
      }

      if (!this.FormPreAuthorization.controls.dateWritten.value && this.VisionSpecifications.length > 0) {
        this.FormPreAuthorization.controls.dateWritten.setValidators([Validators.required]);
        this.FormPreAuthorization.controls.dateWritten.updateValueAndValidity();
        this.IsDateWrittenRequired = true;
        hasError = true;
      } else {
        this.FormPreAuthorization.controls.dateWritten.clearValidators();
        this.FormPreAuthorization.controls.dateWritten.updateValueAndValidity();
        this.IsDateWrittenRequired = false;
      }
    }

    if (this.CareTeams.length === 0 || this.Diagnosises.length === 0 || this.Items.length === 0) {
      hasError = true;
    }

    this.checkCareTeamValidation();
    this.checkDiagnosisValidation();
    this.checkItemValidation();

    if (!this.checkItemCareTeams()) {
      hasError = true;
    }

    if (hasError) {
      return;
    }

    if (this.FormPreAuthorization.valid) {

      this.model = {};
      this.sharedServices.loadingChanged.next(true);
      this.model.beneficiaryId = this.FormPreAuthorization.controls.beneficiaryId.value;
      this.model.payerNphiesId = this.FormPreAuthorization.controls.insurancePlanId.value;

      this.model.coverageType = this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === this.model.payerNphiesId)[0].coverageType;
      this.model.memberCardId = this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === this.model.payerNphiesId)[0].memberCardId;
      this.model.payerNphiesId = this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === this.model.payerNphiesId)[0].payerNphiesId;
      this.model.relationWithSubscriber = this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === this.model.payerNphiesId)[0].relationWithSubscriber;

      const preAuthorizationModel: any = {};
      preAuthorizationModel.dateOrdered = this.datePipe.transform(this.FormPreAuthorization.controls.dateOrdered.value, 'yyyy-MM-dd');
      preAuthorizationModel.type = this.FormPreAuthorization.controls.type.value.value;
      preAuthorizationModel.subType = this.FormPreAuthorization.controls.subType.value.value;
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

      if (this.FormPreAuthorization.controls.accidentType.value.value) {
        const accidentModel: any = {};
        accidentModel.accidentType = this.FormPreAuthorization.controls.accidentType.value.value;
        accidentModel.streetName = this.FormPreAuthorization.controls.streetName.value;
        accidentModel.city = this.FormPreAuthorization.controls.city.value;
        accidentModel.state = this.FormPreAuthorization.controls.state.value;
        accidentModel.country = this.FormPreAuthorization.controls.country.value;
        accidentModel.date = this.datePipe.transform(this.FormPreAuthorization.controls.date.value, 'yyyy-MM-dd');
        this.model.accident = accidentModel;
      }

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

      if (this.FormPreAuthorization.controls.type.value && this.FormPreAuthorization.controls.type.value.value === 'vision') {
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
          model.cylinder = x.cylinder;
          model.axis = x.axis;
          model.prismAmount = x.prismAmount;
          model.prismBase = x.prismBase;
          model.multifocalPower = x.multifocalPower;
          model.lensPower = x.lensPower;
          model.lensBackCurve = x.lensBackCurve;
          model.lensDiameter = x.lensDiameter;
          model.lensDuration = x.lensDuration;
          model.lensDurationUnit = x.lensDurationUnit;
          model.lensColor = x.lensColor;
          model.lensBrand = x.lensBrand;
          model.lensNote = x.model;
          return model;
        });
      }

      this.model.items = this.Items.map(x => {
        if (x.careTeamSequence && x.careTeamSequence.length > 0) {
          const model: any = {};
          model.sequence = x.sequence;
          model.type = x.type;
          model.itemCode = x.itemCode.toString();
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
        }
      }).filter(x => x !== undefined);

      console.log('Model', this.model);
      this.IsJSONPosted = true;
      this.prepareDetailsModel();
      this.sharedServices.loadingChanged.next(false);

      // this.providerNphiesApprovalService.sendApprovalRequest(this.sharedServices.providerId, this.model).subscribe(event => {
      //   if (event instanceof HttpResponse) {
      //     if (event.status === 200) {
      //       const body: any = event.body;
      //       if (body.status === 'OK') {
      //         if (body.outcome.toString().toLowerCase() === 'error') {
      //           const errors: any[] = [];

      //           if (body.disposition) {
      //             errors.push(body.disposition);
      //           }

      //           if (body.errors && body.errors.length > 0) {
      //             body.errors.forEach(err => {
      //               err.coding.forEach(codex => {
      //                 errors.push(codex.code + ' : ' + codex.display);
      //               });
      //             });
      //           }

      //           this.showMessage(body.message, '', 'alert', true, 'OK', errors);

      //         } else {
      //           this.IsJSONPosted = true;
      //           this.prepareDetailsModel(body);
      //           this.showMessage('Success', body.message, 'success', true, 'OK');
      //         }
      //       }
      //     }
      //     this.sharedServices.loadingChanged.next(false);
      //   }
      // }, error => {
      //   if (error instanceof HttpErrorResponse) {
      //     if (error.status === 400) {
      //       this.showMessage(error.error.message, '', 'alert', true, 'OK', error.error.errors);
      //     } else if (error.status === 404) {
      //       const errors: any[] = [];
      //       if (error.error.errors) {
      //         error.error.errors.forEach(x => {
      //           errors.push(x);
      //         });
      //         this.showMessage(error.error.message, '', 'alert', true, 'OK', errors);
      //       } else {
      //         this.showMessage(error.error.message, '', 'alert', true, 'OK');
      //       }
      //     } else if (error.status === 500) {
      //       this.showMessage(error.error.message ? error.error.message : error.error.error, '', 'alert', true, 'OK');
      //     } else if (error.status === 503) {
      //       const errors: any[] = [];
      //       if (error.error.errors) {
      //         error.error.errors.forEach(x => {
      //           errors.push(x);
      //         });
      //         this.showMessage(error.error.message, '', 'alert', true, 'OK', errors);
      //       } else {
      //         this.showMessage(error.error.message, '', 'alert', true, 'OK');
      //       }
      //     }
      //     this.sharedServices.loadingChanged.next(false);
      //   }
      // });
    }
  }

  prepareDetailsModel(body: any = null) {
    this.detailsModel = {};
    this.detailsModel.beneficiaryId = this.FormPreAuthorization.controls.beneficiaryId.value;
    this.detailsModel.beneficiaryName = this.FormPreAuthorization.controls.beneficiaryName.value;
    this.detailsModel.payerNphiesId = this.FormPreAuthorization.controls.insurancePlanId.value;

    this.detailsModel.coverageType = this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === this.detailsModel.payerNphiesId)[0].coverageType;
    this.detailsModel.memberCardId = this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === this.detailsModel.payerNphiesId)[0].memberCardId;
    this.detailsModel.relationWithSubscriber = this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === this.detailsModel.payerNphiesId)[0].relationWithSubscriber;

    if (body) {
      this.detailsModel.disposition = body.disposition;
      this.detailsModel.outgoingTransactionId = body.outgoingTransactionId;
      this.detailsModel.transactionLogDate = body.transactionLogDate;
      this.detailsModel.outcome = body.outcome;
    }

    this.detailsModel.nphiesPayerId = this.FormPreAuthorization.controls.insurancePlanId.value;

    const preAuthorizationModel: any = {};
    preAuthorizationModel.dateOrdered = this.datePipe.transform(this.FormPreAuthorization.controls.dateOrdered.value, 'dd-MM-yyyy');
    preAuthorizationModel.type = this.FormPreAuthorization.controls.type.value.value;
    preAuthorizationModel.typeName = this.FormPreAuthorization.controls.type.value.name;
    preAuthorizationModel.subType = this.FormPreAuthorization.controls.subType.value.value;
    preAuthorizationModel.subTypeName = this.FormPreAuthorization.controls.subType.value.name;
    this.detailsModel.preAuthorizationInfo = preAuthorizationModel;

    const accidentModel: any = {};
    accidentModel.accidentType = this.FormPreAuthorization.controls.accidentType.value.value;
    accidentModel.accidentTypeName = this.FormPreAuthorization.controls.accidentType.value.name;
    accidentModel.streetName = this.FormPreAuthorization.controls.streetName.value;
    accidentModel.city = this.FormPreAuthorization.controls.city.value;
    accidentModel.state = this.FormPreAuthorization.controls.state.value;
    accidentModel.country = this.FormPreAuthorization.controls.country.value;
    accidentModel.date = this.datePipe.transform(this.FormPreAuthorization.controls.date.value, 'dd-MM-yyyy');
    this.detailsModel.accident = accidentModel;

    if (this.FormPreAuthorization.controls.type.value && this.FormPreAuthorization.controls.type.value.value === 'vision') {
      this.detailsModel.visionPrescription = {};
      // tslint:disable-next-line:max-line-length
      this.detailsModel.visionPrescription.dateWritten = this.datePipe.transform(this.FormPreAuthorization.controls.dateWritten.value, 'dd-MM-yyyy');
      // this.detailsModel.visionPrescription.prescriber = this.FormPreAuthorization.controls.prescriber.value;
      this.detailsModel.visionPrescription.lensSpecifications = this.VisionSpecifications;
    }

    this.detailsModel.careTeam = this.CareTeams;
    this.detailsModel.supportingInfo = this.SupportingInfo;
    this.detailsModel.diagnosis = this.Diagnosises;
    this.detailsModel.items = this.Items.map(x => {
      if (x.careTeamSequence && x.careTeamSequence.length > 0) {
        return x;
      }
    }).filter(x => x !== undefined);
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

  reset() {
    this.model = {};
    this.detailsModel = {};
    this.FormPreAuthorization.reset();
    this.FormPreAuthorization.patchValue({
      insurancePlanId: '',
      type: '',
      subType: '',
      accidentType: '',
      country: ''
    });
    this.CareTeams = [];
    this.Diagnosises = [];
    this.SupportingInfo = [];
    this.VisionSpecifications = [];
    this.Items = [];
    this.isSubmitted = false;
    this.IsJSONPosted = false;
  }

}
