import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BeneficiariesSearchResult } from 'src/app/models/nphies/beneficiaryFullTextSearchResult';
import { ReplaySubject } from 'rxjs';
import { nationalities } from 'src/app/claim-module-components/store/claim.reducer';
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { SharedServices } from 'src/app/services/shared.services';
import { Location, DatePipe } from '@angular/common';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { ProviderNphiesApprovalService } from 'src/app/services/providerNphiesApprovalService/provider-nphies-approval.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AddEditVisionLensSpecificationsComponent } from '../add-preauthorization/add-edit-vision-lens-specifications/add-edit-vision-lens-specifications.component';
import { AddEditCareTeamModalComponent } from '../add-preauthorization/add-edit-care-team-modal/add-edit-care-team-modal.component';
import { AddEditDiagnosisModalComponent } from '../add-preauthorization/add-edit-diagnosis-modal/add-edit-diagnosis-modal.component';
import { ConfirmationAlertDialogComponent } from 'src/app/components/confirmation-alert-dialog/confirmation-alert-dialog.component';
import { AddEditPreauthorizationItemComponent } from '../add-edit-preauthorization-item/add-edit-preauthorization-item.component';
import { AddEditSupportingInfoModalComponent } from '../add-preauthorization/add-edit-supporting-info-modal/add-edit-supporting-info-modal.component';
import { NphiesClaimUploaderService } from 'src/app/services/nphiesClaimUploaderService/nphies-claim-uploader.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-claim-nphies',
  templateUrl: './create-claim-nphies.component.html',
  styles: []
})
export class CreateClaimNphiesComponent implements OnInit {

  beneficiarySearchController = new FormControl();
  beneficiariesSearchResult: BeneficiariesSearchResult[] = [];
  selectedBeneficiary: BeneficiariesSearchResult;
  selectedPlanId: string;
  selectedPlanIdError: string;

  filteredNations: ReplaySubject<{ Code: string, Name: string }[]> = new ReplaySubject<{ Code: string, Name: string }[]>(1);

  FormNphiesClaim: FormGroup = this.formBuilder.group({
    beneficiaryName: ['', Validators.required],
    beneficiaryId: ['', Validators.required],
    patientFileNumber: [''],
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
    prescriber: [''],
  });

  typeList = this.sharedDataService.claimTypeList;
  subTypeList = [];
  accidentTypeList = this.sharedDataService.accidentTypeList;

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
  IsPrescriberRequired = false;

  IsDateRequired = false;
  IsAccidentTypeRequired = false;

  today: Date;
  nationalities = nationalities;
  selectedCountry = '';

  hasErrorClaimInfo = false;

  claimId: number;
  uploadId: number;
  pageMode = 'CREATE';

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private sharedDataService: SharedDataService,
    private router: Router,
    private providerNphiesApprovalService: ProviderNphiesApprovalService,
    private dialog: MatDialog, private formBuilder: FormBuilder, private sharedServices: SharedServices, private datePipe: DatePipe,
    private providerNphiesSearchService: ProviderNphiesSearchService,
    private nphiesClaimUploaderService: NphiesClaimUploaderService) {
    this.today = new Date();
  }

  ngOnInit() {
    this.FormNphiesClaim.controls.dateOrdered.setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
    this.filteredNations.next(this.nationalities.slice());

    if (this.activatedRoute.snapshot.queryParams.claimId) {
      this.claimId = parseInt(this.activatedRoute.snapshot.queryParams.claimId);
    }

    if (this.activatedRoute.snapshot.queryParams.uploadId) {
      this.uploadId = parseInt(this.activatedRoute.snapshot.queryParams.uploadId);
    }

    if (this.claimId && this.uploadId) {
      this.pageMode = 'VIEW';
      this.getClaimDetails();
    }

  }

  filterNationality() {

    if (!this.nationalities) {
      return;
    }
    // get the search keyword
    let search = this.FormNphiesClaim.controls.nationalityFilterCtrl.value;
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

    this.Items = [];
    this.VisionSpecifications = [];
  }

  searchBeneficiaries() {
    // tslint:disable-next-line:max-line-length
    this.providerNphiesSearchService.beneficiaryFullTextSearch(this.sharedServices.providerId, this.FormNphiesClaim.controls.beneficiaryName.value).subscribe(event => {
      if (event instanceof HttpResponse) {
        const body = event.body;
        if (body instanceof Array) {
          this.beneficiariesSearchResult = body;
          if (name) {
            this.selectBeneficiary(this.selectedBeneficiary);
          }
        }
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {

      }
    });
  }

  selectBeneficiary(beneficiary: BeneficiariesSearchResult) {
    this.selectedBeneficiary = beneficiary;
    this.FormNphiesClaim.patchValue({
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
      this.FormNphiesClaim.controls.dateWritten.clearValidators();
      this.FormNphiesClaim.controls.dateWritten.updateValueAndValidity();
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
      dialogConfig.panelClass = ['primary-dialog'];
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
      type: this.FormNphiesClaim.controls.type.value ? this.FormNphiesClaim.controls.type.value.value : ''
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
      dialogConfig.panelClass = ['primary-dialog'];
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
      type: this.FormNphiesClaim.controls.type.value.value,
      dateOrdered: this.FormNphiesClaim.controls.dateOrdered.value
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
      dialogConfig.panelClass = ['primary-dialog'];
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
    // tslint:disable-next-line:max-line-length
    if (this.FormNphiesClaim.controls.date.value && !(this.FormNphiesClaim.controls.accidentType.value && this.FormNphiesClaim.controls.accidentType.value.value)) {
      this.FormNphiesClaim.controls.accidentType.setValidators([Validators.required]);
      this.FormNphiesClaim.controls.accidentType.updateValueAndValidity();
      this.IsAccidentTypeRequired = true;
      hasError = true;
    } else {
      this.FormNphiesClaim.controls.accidentType.clearValidators();
      this.FormNphiesClaim.controls.accidentType.updateValueAndValidity();
      this.IsAccidentTypeRequired = false;
    }
    // tslint:disable-next-line:max-line-length
    if (this.FormNphiesClaim.controls.accidentType.value && this.FormNphiesClaim.controls.accidentType.value.value && !this.FormNphiesClaim.controls.date.value) {
      this.FormNphiesClaim.controls.date.setValidators([Validators.required]);
      this.FormNphiesClaim.controls.date.updateValueAndValidity();
      this.IsDateRequired = true;
      hasError = true;
    } else {
      this.FormNphiesClaim.controls.date.clearValidators();
      this.FormNphiesClaim.controls.date.updateValueAndValidity();
      this.IsDateRequired = false;
    }

    if (this.FormNphiesClaim.controls.type.value && this.FormNphiesClaim.controls.type.value.value === 'vision') {
      if (this.FormNphiesClaim.controls.dateWritten.value && this.VisionSpecifications.length === 0) {
        this.FormNphiesClaim.controls.prescriber.setValidators([Validators.required]);
        this.FormNphiesClaim.controls.prescriber.updateValueAndValidity();
        this.IsLensSpecificationRequired = true;
        hasError = true;
      } else {
        this.FormNphiesClaim.controls.prescriber.clearValidators();
        this.FormNphiesClaim.controls.prescriber.updateValueAndValidity();
        this.IsLensSpecificationRequired = false;
      }

      if (!this.FormNphiesClaim.controls.dateWritten.value && this.VisionSpecifications.length > 0) {
        this.FormNphiesClaim.controls.dateWritten.setValidators([Validators.required]);
        this.FormNphiesClaim.controls.dateWritten.updateValueAndValidity();
        this.IsDateWrittenRequired = true;
        hasError = true;
      } else {
        this.FormNphiesClaim.controls.dateWritten.clearValidators();
        this.FormNphiesClaim.controls.dateWritten.updateValueAndValidity();
        this.IsDateWrittenRequired = false;
      }

      // tslint:disable-next-line:max-line-length
      if ((this.FormNphiesClaim.controls.dateWritten.value && !this.FormNphiesClaim.controls.prescriber.value) ||
        (this.VisionSpecifications.length > 0 && !this.FormNphiesClaim.controls.prescriber.value)) {
        this.FormNphiesClaim.controls.prescriber.setValidators([Validators.required]);
        this.FormNphiesClaim.controls.prescriber.updateValueAndValidity();
        this.IsPrescriberRequired = true;
        hasError = true;
      } else {
        this.FormNphiesClaim.controls.prescriber.clearValidators();
        this.FormNphiesClaim.controls.prescriber.updateValueAndValidity();
        this.IsPrescriberRequired = false;
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

    if (this.FormNphiesClaim.valid) {

      this.model = {};
      this.sharedServices.loadingChanged.next(true);
      this.model.beneficiaryId = this.FormNphiesClaim.controls.beneficiaryId.value;
      this.model.payerNphiesId = this.FormNphiesClaim.controls.insurancePlanId.value;
      this.model.patientFileNumber = 'Test';

      const now = new Date(Date.now());
      // tslint:disable-next-line:max-line-length
      this.model.provClaimNo = `${this.sharedServices.providerId}${now.getFullYear() % 100}${now.getMonth()}${now.getDate()}${now.getHours()}${now.getMinutes()}`;

      this.model.coverageType = this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === this.model.payerNphiesId)[0].coverageType;
      this.model.memberCardId = this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === this.model.payerNphiesId)[0].memberCardId;
      this.model.payerNphiesId = this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === this.model.payerNphiesId)[0].payerNphiesId;
      // tslint:disable-next-line:max-line-length
      this.model.relationWithSubscriber = this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === this.model.payerNphiesId)[0].relationWithSubscriber;

      const preAuthorizationModel: any = {};
      preAuthorizationModel.dateOrdered = this.datePipe.transform(this.FormNphiesClaim.controls.dateOrdered.value, 'yyyy-MM-dd');
      preAuthorizationModel.type = this.FormNphiesClaim.controls.type.value.value;
      preAuthorizationModel.subType = this.FormNphiesClaim.controls.subType.value.value;
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

      if (this.FormNphiesClaim.controls.accidentType.value.value) {
        const accidentModel: any = {};
        accidentModel.accidentType = this.FormNphiesClaim.controls.accidentType.value.value;
        accidentModel.streetName = this.FormNphiesClaim.controls.streetName.value;
        accidentModel.city = this.FormNphiesClaim.controls.city.value;
        accidentModel.state = this.FormNphiesClaim.controls.state.value;
        accidentModel.country = this.FormNphiesClaim.controls.country.value;
        accidentModel.date = this.datePipe.transform(this.FormNphiesClaim.controls.date.value, 'yyyy-MM-dd');
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

      if (this.FormNphiesClaim.controls.type.value && this.FormNphiesClaim.controls.type.value.value === 'vision') {
        this.model.visionPrescription = {};
        // tslint:disable-next-line:max-line-length
        this.model.visionPrescription.dateWritten = this.datePipe.transform(this.FormNphiesClaim.controls.dateWritten.value, 'yyyy-MM-dd');
        this.model.visionPrescription.prescriber = this.FormNphiesClaim.controls.prescriber.value;
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

      this.model.totalNet = 0;
      this.model.items.forEach((x) => {
        this.model.totalNet += x.net;
      });
      // console.log('Model', this.model);

      this.nphiesClaimUploaderService.createNphisClaim(this.sharedServices.providerId, this.model).subscribe(event => {
        if (event instanceof HttpResponse) {
          if (event.status === 200) {
            const body: any = event.body;
            if (body.isError) {
              this.showMessage('Error', body.message, 'alert', true, 'OK', body.errors);
            } else {
              this.reset();
              this.showMessage('Success', body.message, 'success', true, 'OK');
              this.router.navigateByUrl(`/claims/nphies-claim?claimId=${body.claimId}&uploadId=${body.uploadId}`);
            }
          }
          this.sharedServices.loadingChanged.next(false);
        }
      }, error => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 400) {
            this.showMessage(error.error.message, '', 'alert', true, 'OK', error.error.errors);
          } else if (error.status === 404) {
            const errors: any[] = [];
            if (error.error.errors) {
              error.error.errors.forEach(x => {
                errors.push(x);
              });
              this.showMessage(error.error.message, '', 'alert', true, 'OK', errors);
            } else {
              this.showMessage(error.error.message, '', 'alert', true, 'OK');
            }
          } else if (error.status === 500) {
            this.showMessage(error.error.message ? error.error.message : error.error.error, '', 'alert', true, 'OK');
          } else if (error.status === 503) {
            const errors: any[] = [];
            if (error.error.errors) {
              error.error.errors.forEach(x => {
                errors.push(x);
              });
              this.showMessage(error.error.message, '', 'alert', true, 'OK', errors);
            } else {
              this.showMessage(error.error.message, '', 'alert', true, 'OK');
            }
          }
          this.sharedServices.loadingChanged.next(false);
        }
      });
    }
  }

  showMessage(_mainMessage, _subMessage, _mode, _hideNoButton, _yesButtonText, _errors = null) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog'];
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
    this.FormNphiesClaim.reset();
    this.FormNphiesClaim.patchValue({
      insurancePlanId: '',
      type: '',
      subType: '',
      accidentType: '',
      country: ''
    });
    this.FormNphiesClaim.controls.dateOrdered.setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
    this.CareTeams = [];
    this.Diagnosises = [];
    this.VisionSpecifications = [];
    this.Items = [];
    this.isSubmitted = false;
  }

  get checkErrorClaimInfo() {
    if (this.isSubmitted && (!this.FormNphiesClaim.controls.beneficiaryName.value ||
      !this.FormNphiesClaim.controls.insurancePlanId.value ||
      !this.FormNphiesClaim.controls.dateOrdered.value ||
      !this.FormNphiesClaim.controls.type.value)) {

      // this.hasErrorClaimInfo = true;
      return true;
    } else {
      // this.hasErrorClaimInfo = false;
      return false;
    }
  }

  get checkErrorVision() {
    let hasError = false;
    // tslint:disable-next-line:max-line-length
    if (this.FormNphiesClaim.controls.type.value && this.FormNphiesClaim.controls.type.value.value === 'vision') {

      if (this.FormNphiesClaim.controls.dateWritten.value) {
        if (this.VisionSpecifications.length === 0) {
          this.IsLensSpecificationRequired = true;
          hasError = true;
        } else {
          this.IsLensSpecificationRequired = false;
        }

        if (!this.FormNphiesClaim.controls.prescriber.value) {
          this.FormNphiesClaim.controls.prescriber.setValidators([Validators.required]);
          this.FormNphiesClaim.controls.prescriber.updateValueAndValidity();
          this.IsPrescriberRequired = true;
          hasError = true;
        } else {
          this.FormNphiesClaim.controls.prescriber.clearValidators();
          this.FormNphiesClaim.controls.prescriber.updateValueAndValidity();
          this.IsPrescriberRequired = false;
        }
      }

      if (this.VisionSpecifications.length > 0) {
        if (!this.FormNphiesClaim.controls.dateWritten.value) {
          this.FormNphiesClaim.controls.dateWritten.setValidators([Validators.required]);
          this.FormNphiesClaim.controls.dateWritten.updateValueAndValidity();
          this.IsDateWrittenRequired = true;
          hasError = true;
        } else {
          this.FormNphiesClaim.controls.dateWritten.clearValidators();
          this.FormNphiesClaim.controls.dateWritten.updateValueAndValidity();
          this.IsDateWrittenRequired = false;
        }

        if (!this.FormNphiesClaim.controls.prescriber.value) {
          this.FormNphiesClaim.controls.prescriber.setValidators([Validators.required]);
          this.FormNphiesClaim.controls.prescriber.updateValueAndValidity();
          this.IsPrescriberRequired = true;
          hasError = true;
        } else {
          this.FormNphiesClaim.controls.prescriber.clearValidators();
          this.FormNphiesClaim.controls.prescriber.updateValueAndValidity();
          this.IsPrescriberRequired = false;
        }
      }

      if (this.FormNphiesClaim.controls.prescriber.value) {
        if (!this.FormNphiesClaim.controls.dateWritten.value) {
          this.FormNphiesClaim.controls.dateWritten.setValidators([Validators.required]);
          this.FormNphiesClaim.controls.dateWritten.updateValueAndValidity();
          this.IsDateWrittenRequired = true;
          hasError = true;
        } else {
          this.FormNphiesClaim.controls.dateWritten.clearValidators();
          this.FormNphiesClaim.controls.dateWritten.updateValueAndValidity();
          this.IsDateWrittenRequired = false;
        }

        if (this.VisionSpecifications.length === 0) {
          this.IsLensSpecificationRequired = true;
          hasError = true;
        } else {
          this.IsLensSpecificationRequired = false;
        }
      }

      if (!hasError) {
        this.IsLensSpecificationRequired = false;
        this.IsDateWrittenRequired = false;
        this.IsPrescriberRequired = false;
      }
    }
    return hasError;
  }

  getClaimDetails() {
    this.sharedServices.loadingChanged.next(true);
    // tslint:disable-next-line:max-line-length
    this.providerNphiesApprovalService.getNphisClaimDetails(this.sharedServices.providerId, this.claimId, this.uploadId).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          const body: any = event.body;
          this.setData(body);
        }

      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        console.log(error);
        this.sharedServices.loadingChanged.next(false);
      }
    });
  }

  setData(response) {

    this.FormNphiesClaim.controls.patientFileNumber.setValue(response.patientFileNumber);
    this.FormNphiesClaim.controls.dateOrdered.setValue(response.preAuthorizationInfo.dateOrdered);

    // tslint:disable-next-line:max-line-length
    this.FormNphiesClaim.controls.type.setValue(this.sharedDataService.claimTypeList.filter(x => x.value === response.preAuthorizationInfo.type)[0]);

    switch (response.preAuthorizationInfo.type) {
      case 'institutional':
        this.subTypeList = this.sharedDataService.subTypeList.filter(x => x.value === 'ip' || x.value === 'emr');
        break;
      case 'professional':
      case 'vision':
      case 'pharmacy':
      case 'oral':
        this.subTypeList = this.sharedDataService.subTypeList.filter(x => x.value === 'op');
        break;
    }

    if (response.preAuthorizationInfo.subType != null) {
      // tslint:disable-next-line:max-line-length
      this.FormNphiesClaim.controls.subType.setValue(this.sharedDataService.subTypeList.filter(x => x.value === response.preAuthorizationInfo.subType)[0]);
    }


    if (response.accident) {
      if (response.accident.accidentType) {
        // tslint:disable-next-line:max-line-length
        this.FormNphiesClaim.controls.accidentType.setValue(this.sharedDataService.accidentTypeList.filter(x => x.value === response.accident.accidentType)[0]);
      }
      if (response.accident.streetName) {
        this.FormNphiesClaim.controls.streetName.setValue(response.accident.streetName);
      }
      if (response.accident.city) {
        this.FormNphiesClaim.controls.city.setValue(response.accident.city);
      }
      if (response.accident.state) {
        this.FormNphiesClaim.controls.state.setValue(response.accident.state);
      }
      if (response.accident.country) {
        this.FormNphiesClaim.controls.country.setValue(response.accident.country);
      }
      // this.FormNphiesClaim.controls.countryName.setValue(response.beneficiary.beneficiaryName);
      if (response.accident.date) {
        this.FormNphiesClaim.controls.date.setValue(response.accident.date);
      }
    }

    if (response.visionPrescription) {
      this.FormNphiesClaim.controls.dateWritten.setValue(response.visionPrescription.dateWritten);
      this.FormNphiesClaim.controls.prescriber.setValue(response.visionPrescription.prescriber);
    }

    this.Diagnosises = response.diagnosis.map(x => {
      const model: any = {};
      model.sequence = x.sequence;
      model.diagnosisCode = x.diagnosisCode;
      model.diagnosisDescription = x.diagnosisDescription;
      model.type = x.type;
      model.onAdmission = x.onAdmission;
      // tslint:disable-next-line:max-line-length
      model.typeName = this.sharedDataService.diagnosisTypeList.filter(y => y.value === x.type)[0] ? this.sharedDataService.diagnosisTypeList.filter(y => y.value === x.type)[0].name : '';
      // tslint:disable-next-line:max-line-length
      model.onAdmissionName = this.sharedDataService.onAdmissionList.filter(y => y.value === x.onAdmission)[0] ? this.sharedDataService.onAdmissionList.filter(y => y.value === x.onAdmission)[0].name : '';
      return model;
    });

    this.SupportingInfo = response.supportingInfo.map(x => {
      const model: any = {};
      model.sequence = x.sequence;
      model.category = x.category;
      model.code = x.code;
      model.fromDate = x.fromDate;
      model.toDate = x.toDate;
      model.value = x.value;
      model.reason = x.reason;
      model.attachment = x.attachment;

      // tslint:disable-next-line:max-line-length
      model.categoryName = this.sharedDataService.categoryList.filter(y => y.value === x.category)[0] ? this.sharedDataService.categoryList.filter(y => y.value === x.category)[0].name : '';

      const codeList = this.sharedDataService.getCodeName(x.category);

      // tslint:disable-next-line:max-line-length
      if ((x.category === 'missingtooth' || x.category === 'reason-for-visit' || x.category === 'chief-complaint' || x.category === 'onset') && codeList) {
        if (x.category === 'chief-complaint' || x.category === 'onset') {
          // tslint:disable-next-line:max-line-length
          model.codeName = codeList.filter(y => y.diagnosisCode === x.code)[0] ? codeList.filter(y => y.diagnosisCode === x.code)[0].diagnosisDescription : '';
        } else {
          model.codeName = codeList.filter(y => y.value === x.code)[0] ? codeList.filter(y => y.value === x.code)[0].name : '';
        }
      }

      model.reasonName = this.sharedDataService.reasonList.filter(y => y.value === x.reason)[0];
      model.fromDateStr = this.datePipe.transform(x.fromDate, 'dd-MM-yyyy');
      model.toDateStr = this.datePipe.transform(x.toDate, 'dd-MM-yyyy');
      model.unit = this.sharedDataService.durationUnitList.filter(y => y.value === x.unit)[0];
      model.byteArray = x.attachment;
      return model;

    });

    this.CareTeams = response.careTeam.map(x => {
      const model: any = {};
      model.sequence = x.sequence;
      model.practitionerName = x.practitionerName;
      model.physicianCode = x.physicianCode;
      model.practitionerRole = x.practitionerRole;
      model.careTeamRole = x.careTeamRole;
      model.speciality = x.speciality;
      model.specialityCode = x.speciallityCode;
      // tslint:disable-next-line:max-line-length
      model.practitionerRoleName = this.sharedDataService.practitionerRoleList.filter(y => y.value === x.practitionerRole)[0] ? this.sharedDataService.practitionerRoleList.filter(y => y.value === x.practitionerRole)[0].name : '';
      // tslint:disable-next-line:max-line-length
      model.careTeamRoleName = this.sharedDataService.careTeamRoleList.filter(y => y.value === x.careTeamRole)[0] ? this.sharedDataService.careTeamRoleList.filter(y => y.value === x.careTeamRole)[0].name : '';
      return model;
    });

    if (response.visionPrescription) {
      this.VisionSpecifications = response.visionPrescription.map(x => {

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
        // tslint:disable-next-line:max-line-length
        model.productName = this.sharedDataService.productList.filter(y => y.value === x.product)[0] ? this.sharedDataService.productList.filter(y => y.value === x.product)[0].name : '';
        // tslint:disable-next-line:max-line-length
        model.lensDurationUnitName = this.sharedDataService.durationUnitList.filter(y => y.value === x.lensDurationUnit)[0] ? this.sharedDataService.durationUnitList.filter(y => y.value === x.lensDurationUnit)[0].name : '';
        // tslint:disable-next-line:max-line-length
        model.prismBaseName = this.sharedDataService.baseList.filter(y => y.value === x.prismBase)[0] ? this.sharedDataService.baseList.filter(y => y.value === x.prismBase)[0].name : '';
        return model;

      });
    }


    this.Items = response.items.map(x => {
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
      // tslint:disable-next-line:max-line-length
      model.typeName = this.sharedDataService.itemTypeList.filter(y => y.value === x.type)[0] ? this.sharedDataService.itemTypeList.filter(y => y.value === x.type)[0].name : '';
      return model;
    });

    this.setBeneficiary(response);
  }

  setBeneficiary(res) {
    // tslint:disable-next-line:max-line-length
    this.providerNphiesSearchService.beneficiaryFullTextSearch(this.sharedServices.providerId, res.beneficiary.beneficiaryName).subscribe(event => {
      if (event instanceof HttpResponse) {
        const body = event.body;
        if (body instanceof Array) {
          this.beneficiariesSearchResult = body;
          this.selectedBeneficiary = body[0];
          this.FormNphiesClaim.patchValue({
            beneficiaryName: res.beneficiary.beneficiaryName + ' (' + res.beneficiary.documentId + ')',
            beneficiaryId: res.beneficiary.beneficiaryId
          });
          this.FormNphiesClaim.controls.insurancePlanId.setValue(res.payerNphiesId.toString());
        }
        this.sharedServices.loadingChanged.next(false);
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {

      }
      this.sharedServices.loadingChanged.next(false);
    });
  }

  close() {
    this.location.go('/nphies/uploads');
  }
}
