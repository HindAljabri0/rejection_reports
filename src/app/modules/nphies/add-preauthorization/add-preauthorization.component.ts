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
import { AddEditItemDetailsModalComponent } from '../add-edit-item-details-modal/add-edit-item-details-modal.component';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';

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
    payee: ['', Validators.required],
    payeeType: ['', Validators.required],
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
    eligibilityOfflineDate: [''],
    eligibilityOfflineId: [''],
    eligibilityResponseId: ['']
  });

  typeList = this.sharedDataService.claimTypeList;
  payeeTypeList = this.sharedDataService.payeeTypeList;
  payeeList = [];
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
  // IsCareTeamRequired = false;
  IsItemRequired = false;
  IsDateWrittenRequired = false;
  IsPrescriberRequired = false;

  IsDateRequired = false;
  IsAccidentTypeRequired = false;
  IsJSONPosted = false;

  today: Date;
  nationalities = nationalities;
  selectedCountry = '';

  currentOpenItem: number = null;

  constructor(
    private sharedDataService: SharedDataService,
    private dialogService: DialogService,
    private dialog: MatDialog, private formBuilder: FormBuilder, private sharedServices: SharedServices, private datePipe: DatePipe,
    private providerNphiesSearchService: ProviderNphiesSearchService,
    private providersBeneficiariesService: ProvidersBeneficiariesService,
    private providerNphiesApprovalService: ProviderNphiesApprovalService) {
    this.today = new Date();
  }

  ngOnInit() {
    this.getPayees();
    this.FormPreAuthorization.controls.dateOrdered.setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
    this.filteredNations.next(this.nationalities.slice());
  }

  getPayees() {
    this.sharedServices.loadingChanged.next(true);
    this.providersBeneficiariesService.getPayees().subscribe(event => {
      if (event instanceof HttpResponse) {
        this.sharedServices.loadingChanged.next(false);
        if (event.body != null && event.body instanceof Array) {
          this.payeeList = event.body;
          // tslint:disable-next-line:max-line-length
          this.FormPreAuthorization.controls.payeeType.setValue(this.sharedDataService.payeeTypeList.filter(x => x.value === 'provider')[0]);
          this.onPayeeTypeChange();
        }
      }
    }, err => {
      if (err instanceof HttpErrorResponse) {
        console.log("Error");
        this.sharedServices.loadingChanged.next(false);
      }
    });
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

  onPayeeTypeChange() {
    if (this.FormPreAuthorization.controls.payeeType.value && this.FormPreAuthorization.controls.payeeType.value.value === 'provider') {
      // tslint:disable-next-line:max-line-length
      this.FormPreAuthorization.controls.payee.setValue(this.payeeList.filter(x => x.cchiid === this.sharedServices.cchiId)[0] ? this.payeeList.filter(x => x.cchiid === this.sharedServices.cchiId)[0].nphiesId : '');
    }
    this.FormPreAuthorization.controls.payeeType.disable();
    this.FormPreAuthorization.controls.payee.disable();
  }

  onTypeChange($event) {
    if ($event.value) {
      switch ($event.value.value) {
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

      this.VisionSpecifications = [];
      this.Items = [];
      this.Diagnosises = [];
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
    dialogConfig.panelClass = ['primary-dialog'];
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
              x.qualificationCode = result.speciallityCode;
              x.practitionerRoleName = result.practitionerRoleName;
              x.careTeamRoleName = result.careTeamRoleName;
            }
          });
        } else {
          this.CareTeams.push(result);
          // this.checkCareTeamValidation();
        }
      }
    });
  }

  deleteCareTeam(sequence: number, index: number) {

    if (this.Items.find(x => x.careTeamSequence && x.careTeamSequence.find(y => y === sequence))) {
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
          // this.checkCareTeamValidation();
        }
      });
    } else {
      this.CareTeams.splice(index, 1);
      // this.checkCareTeamValidation();
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

    if (this.Items.find(x => x.diagnosisSequence && x.diagnosisSequence.find(y => y === sequence))) {
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
          this.updateSequenceNames();
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
              x.display = result.display;
              x.isPackage = result.isPackage;
              x.bodySite = result.bodySite;
              x.bodySiteName = result.bodySiteName;
              x.subSite = result.subSite;
              x.subSiteName = result.subSiteName;
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
              x.startDateStr = result.startDateStr;
              x.supportingInfoSequence = result.supportingInfoSequence;
              x.careTeamSequence = result.careTeamSequence;
              x.diagnosisSequence = result.diagnosisSequence;

              if (x.supportingInfoSequence) {
                x.supportingInfoNames = '';
                x.supportingInfoSequence.forEach(s => {
                  x.supportingInfoNames += ', [' + this.SupportingInfo.filter(y => y.sequence === s)[0].categoryName + ']';
                });
                x.supportingInfoNames = x.supportingInfoNames.slice(2, x.supportingInfoNames.length);
              } else {
                x.supportingInfoNames = '';
              }

              if (x.careTeamSequence) {
                x.careTeamNames = '';
                x.careTeamSequence.forEach(s => {
                  x.careTeamNames += ', [' + this.CareTeams.filter(y => y.sequence === s)[0].practitionerName + ']';
                });
                x.careTeamNames = x.careTeamNames.slice(2, x.careTeamNames.length);
              } else {
                x.careTeamNames = '';
              }

              if (x.diagnosisSequence) {
                x.diagnosisNames = '';
                x.diagnosisSequence.forEach(s => {
                  x.diagnosisNames += ', [' + this.Diagnosises.filter(y => y.sequence === s)[0].diagnosisCode + ']';
                });
                x.diagnosisNames = x.diagnosisNames.slice(2, x.diagnosisNames.length);
              } else {
                x.diagnosisNames = '';
              }

              if (x.isPackage === 2) {
                x.itemDetails = [];
              }

            }
          });
        } else {
          this.Items.push(result);
          this.Items.filter((x, i) => {
            if (i === this.Items.length - 1) {

              if (x.supportingInfoSequence) {
                x.supportingInfoNames = '';
                x.supportingInfoSequence.forEach(s => {
                  x.supportingInfoNames += ', [' + this.SupportingInfo.filter(y => y.sequence === s)[0].categoryName + ']';
                });
                x.supportingInfoNames = x.supportingInfoNames.slice(2, x.supportingInfoNames.length);
              }

              if (x.careTeamSequence) {
                x.careTeamNames = '';
                x.careTeamSequence.forEach(s => {
                  x.careTeamNames += ', [' + this.CareTeams.filter(y => y.sequence === s)[0].practitionerName + ']';
                });
                x.careTeamNames = x.careTeamNames.slice(2, x.careTeamNames.length);
              }

              if (x.diagnosisSequence) {
                x.diagnosisNames = '';
                x.diagnosisSequence.forEach(s => {
                  x.diagnosisNames += ', [' + this.Diagnosises.filter(y => y.sequence === s)[0].diagnosisCode + ']';
                });
                x.diagnosisNames = x.diagnosisNames.slice(2, x.diagnosisNames.length);
              }
            }
          });
          this.checkItemValidation();
        }
      }
    });
  }

  deleteItem(index: number) {
    this.Items.splice(index, 1);
    this.checkItemValidation();
  }

  openAddEditItemDetailsDialog(itemSequence: number, itemModel: any = null) {

    const item = this.Items.filter(x => x.sequence === itemSequence)[0];

    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog', 'dialog-xl'];
    dialogConfig.data = {
      // tslint:disable-next-line:max-line-length
      Sequence: (itemModel !== null) ? itemModel.sequence : (item.itemDetails.length === 0 ? 1 : (item.itemDetails[item.itemDetails.length - 1].sequence + 1)),
      item: itemModel,
      type: this.FormPreAuthorization.controls.type.value.value
    };

    const dialogRef = this.dialog.open(AddEditItemDetailsModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.Items.find(x => x.sequence === itemSequence)) {
          this.Items.map(x => {
            if (x.sequence === itemSequence) {
              if (x.itemDetails.find(y => y.sequence === result.sequence)) {
                x.itemDetails.map(y => {
                  if (y.sequence === result.sequence) {
                    y.type = result.type;
                    y.typeName = result.typeName,
                      y.itemCode = result.itemCode;
                    y.itemDescription = result.itemDescription;
                    y.nonStandardCode = result.nonStandardCode;
                    y.display = result.display;
                  }
                });
              } else {
                x.itemDetails.push(result);
              }
            }
          });

        }
      }
    });
  }

  deleteItemDetails(itemSequence: number, index: number) {
    if (this.Items.find(x => x.sequence === itemSequence)) {
      this.Items.map(x => {
        if (x.sequence === itemSequence) {
          x.itemDetails.splice(index, 1);
        }
      });
    }
  }

  openAddEditSupportInfoDialog(supportInfoModel: any = null) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog'];
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
              x.attachmentName = result.attachmentName;
              x.attachmentType = result.attachmentType;
              x.attachmentDate = result.attachmentDate;
              x.attachmentDateStr = result.attachmentDateStr;
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

    if (this.Items.find(x => x.supportingInfoSequence && x.supportingInfoSequence.find(y => y === sequence))) {
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
          this.updateSequenceNames();
        }
      });
    } else {
      this.SupportingInfo.splice(index, 1);
    }
  }

  // checkCareTeamValidation() {
  //   if (this.CareTeams.length === 0) {
  //     this.IsCareTeamRequired = true;
  //   } else {
  //     this.IsCareTeamRequired = false;
  //   }
  // }



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
      if (this.FormPreAuthorization.controls.type.value && this.FormPreAuthorization.controls.type.value.value === 'pharmacy') {
        return true;
      } else if (this.FormPreAuthorization.controls.type.value && this.FormPreAuthorization.controls.type.value.value !== 'pharmacy') {
        if (this.Items.find(x => (x.careTeamSequence && x.careTeamSequence.length === 0))) {
          this.dialogService.showMessage('Error', 'All Items must have atleast one care team', 'alert', true, 'OK');
          return false;
        } else {
          return true;
        }
      }

    }
  }

  checkItemsCodeForSupportingInfo() {
    // tslint:disable-next-line:max-line-length
    if (this.Items.length > 0 && this.Items.filter(x => x.type === 'medicationCode').length > 0 && (this.SupportingInfo.filter(x => x.category === 'days-supply').length === 0)) {
      // tslint:disable-next-line:max-line-length
      this.dialogService.showMessage('Error', 'Days-Supply is required in Supporting Info if any medication-code is used', 'alert', true, 'OK');
      return false;
    } else {
      return true;
    }
  }

  updateSequenceNames() {
    this.Items.forEach(x => {
      if (x.supportingInfoSequence) {
        x.supportingInfoNames = '';
        x.supportingInfoSequence.forEach(s => {
          x.supportingInfoNames += ', [' + this.SupportingInfo.filter(y => y.sequence === s)[0].categoryName + ']';
        });
        x.supportingInfoNames = x.supportingInfoNames.slice(2, x.supportingInfoNames.length);
      } else {
        x.supportingInfoNames = '';
      }

      if (x.careTeamSequence) {
        x.careTeamNames = '';
        x.careTeamSequence.forEach(s => {
          x.careTeamNames += ', [' + this.CareTeams.filter(y => y.sequence === s)[0].practitionerName + ']';
        });
        x.careTeamNames = x.careTeamNames.slice(2, x.careTeamNames.length);
      } else {
        x.careTeamNames = '';
      }

      if (x.diagnosisSequence) {
        x.diagnosisNames = '';
        x.diagnosisSequence.forEach(s => {
          x.diagnosisNames += ', [' + this.Diagnosises.filter(y => y.sequence === s)[0].diagnosisCode + ']';
        });
        x.diagnosisNames = x.diagnosisNames.slice(2, x.diagnosisNames.length);
      } else {
        x.diagnosisNames = '';
      }
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    let hasError = false;
    // tslint:disable-next-line:max-line-length
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
    // tslint:disable-next-line:max-line-length
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
        this.FormPreAuthorization.controls.prescriber.setValidators([Validators.required]);
        this.FormPreAuthorization.controls.prescriber.updateValueAndValidity();
        this.IsLensSpecificationRequired = true;
        hasError = true;
      } else {
        this.FormPreAuthorization.controls.prescriber.clearValidators();
        this.FormPreAuthorization.controls.prescriber.updateValueAndValidity();
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

      // tslint:disable-next-line:max-line-length
      if ((this.FormPreAuthorization.controls.dateWritten.value && !this.FormPreAuthorization.controls.prescriber.value) ||
        (this.VisionSpecifications.length > 0 && !this.FormPreAuthorization.controls.prescriber.value)) {
        this.FormPreAuthorization.controls.prescriber.setValidators([Validators.required]);
        this.FormPreAuthorization.controls.prescriber.updateValueAndValidity();
        this.IsPrescriberRequired = true;
        hasError = true;
      } else {
        this.FormPreAuthorization.controls.prescriber.clearValidators();
        this.FormPreAuthorization.controls.prescriber.updateValueAndValidity();
        this.IsPrescriberRequired = false;
      }
    }

    if (this.Diagnosises.length === 0 || this.Items.length === 0) {
      hasError = true;
    }

    // this.checkCareTeamValidation();
    this.checkDiagnosisValidation();
    this.checkItemValidation();

    if (!this.checkItemCareTeams()) {
      hasError = true;
    }

    if (!this.checkItemsCodeForSupportingInfo()) {
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
      // tslint:disable-next-line:max-line-length
      this.model.relationWithSubscriber = this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === this.model.payerNphiesId)[0].relationWithSubscriber;

      const preAuthorizationModel: any = {};
      preAuthorizationModel.dateOrdered = this.datePipe.transform(this.FormPreAuthorization.controls.dateOrdered.value, 'yyyy-MM-dd');
      if (this.FormPreAuthorization.controls.payeeType.value && this.FormPreAuthorization.controls.payeeType.value.value === 'provider') {
        // tslint:disable-next-line:max-line-length
        preAuthorizationModel.payeeId = this.payeeList.filter(x => x.cchiid === this.sharedServices.cchiId)[0] ? this.payeeList.filter(x => x.cchiid === this.sharedServices.cchiId)[0].nphiesId : '';
      } else {
        preAuthorizationModel.payeeId = this.FormPreAuthorization.controls.payee.value;
      }

      preAuthorizationModel.payeeType = this.FormPreAuthorization.controls.payeeType.value.value;
      preAuthorizationModel.type = this.FormPreAuthorization.controls.type.value.value;
      preAuthorizationModel.subType = this.FormPreAuthorization.controls.subType.value.value;

      // tslint:disable-next-line:max-line-length
      preAuthorizationModel.eligibilityOfflineDate = this.datePipe.transform(this.FormPreAuthorization.controls.eligibilityOfflineDate.value, 'yyyy-MM-dd');
      preAuthorizationModel.eligibilityOfflineId = this.FormPreAuthorization.controls.eligibilityOfflineId.value;
      preAuthorizationModel.eligibilityResponseId = this.FormPreAuthorization.controls.eligibilityResponseId.value;

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
        // model.attachment = this.sharedServices._base64ToArrayBuffer(x.byteArray);
        model.attachment = x.byteArray;
        model.attachmentName = x.attachmentName;
        model.attachmentType = x.attachmentType;
        model.attachmentDate = x.attachmentDate;
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
        model.qualificationCode = x.speciallityCode;
        return model;
      });

      if (this.FormPreAuthorization.controls.type.value && this.FormPreAuthorization.controls.type.value.value === 'vision') {
        if (this.FormPreAuthorization.controls.prescriber.value) {
          this.model.visionPrescription = {};
          // tslint:disable-next-line:max-line-length
          this.model.visionPrescription.dateWritten = this.datePipe.transform(this.FormPreAuthorization.controls.dateWritten.value, 'yyyy-MM-dd');
          this.model.visionPrescription.prescriber = this.FormPreAuthorization.controls.prescriber.value;
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
            model.lensNote = x.lensNote;
            return model;
          });
        }
      }

      this.model.items = this.Items.map(x => {
        // tslint:disable-next-line:max-line-length
        if ((this.FormPreAuthorization.controls.type.value && this.FormPreAuthorization.controls.type.value.value !== 'pharmacy') && x.careTeamSequence && x.careTeamSequence.length > 0) {
          const model: any = {};
          model.sequence = x.sequence;
          model.type = x.type;
          model.itemCode = x.itemCode.toString();
          model.itemDescription = x.itemDescription;
          model.nonStandardCode = x.nonStandardCode;
          model.nonStandardDesc = x.display;
          model.isPackage = x.isPackage;
          model.bodySite = x.bodySite;
          model.subSite = x.subSite;
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

          model.itemDetails = x.itemDetails.map(y => {
            const dmodel: any = {};
            dmodel.sequence = y.sequence;
            dmodel.type = y.type;
            dmodel.code = y.itemCode.toString();
            dmodel.description = y.itemDescription;
            dmodel.nonStandardCode = y.nonStandardCode;
            dmodel.nonStandardDesc = y.display;
            return dmodel;
          });

          return model;
        } else if (this.FormPreAuthorization.controls.type.value && this.FormPreAuthorization.controls.type.value.value === 'pharmacy') {
          const model: any = {};
          model.sequence = x.sequence;
          model.type = x.type;
          model.itemCode = x.itemCode.toString();
          model.itemDescription = x.itemDescription;
          model.nonStandardCode = x.nonStandardCode;
          model.nonStandardDesc = x.display;
          model.isPackage = x.isPackage;
          model.bodySite = x.bodySite;
          model.subSite = x.subSite;
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

          model.itemDetails = x.itemDetails.map(y => {
            const dmodel: any = {};
            dmodel.sequence = y.sequence;
            dmodel.type = y.type;
            dmodel.code = y.itemCode.toString();
            dmodel.description = y.itemDescription;
            dmodel.nonStandardCode = y.nonStandardCode;
            dmodel.nonStandardDesc = y.display;
            return dmodel;
          });

          return model;
        }
      }).filter(x => x !== undefined);

      this.model.totalNet = 0;
      this.model.items.forEach((x) => {
        this.model.totalNet += x.net;
      });

      console.log('Model', this.model);

      this.providerNphiesApprovalService.sendApprovalRequest(this.sharedServices.providerId, this.model).subscribe(event => {
        if (event instanceof HttpResponse) {
          if (event.status === 200) {
            const body: any = event.body;
            if (body.status === 'OK') {
              if (body.outcome.toString().toLowerCase() === 'error') {
                const errors: any[] = [];

                if (body.disposition) {
                  errors.push(body.disposition);
                }

                if (body.errors && body.errors.length > 0) {
                  body.errors.forEach(err => {
                    err.coding.forEach(codex => {
                      errors.push(codex.code + ' : ' + codex.display);
                    });
                  });
                }
                this.sharedServices.loadingChanged.next(false);
                this.dialogService.showMessage(body.message, '', 'alert', true, 'OK', errors);

              } else {
                this.dialogService.showMessage('Success', body.message, 'success', true, 'OK');
                this.getTransactionDetails(body.approvalRequestId, body.approvalResponseId);
              }
            }
          }
        }
      }, error => {
        this.sharedServices.loadingChanged.next(false);
        if (error instanceof HttpErrorResponse) {
          if (error.status === 400) {
            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', error.error.errors);
          } else if (error.status === 404) {
            const errors: any[] = [];
            if (error.error.errors) {
              error.error.errors.forEach(x => {
                errors.push(x);
              });
              this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', errors);
            } else {
              this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK');
            }
          } else if (error.status === 500) {
            this.dialogService.showMessage(error.error.message ? error.error.message : error.error.error, '', 'alert', true, 'OK');
          } else if (error.status === 503) {
            const errors: any[] = [];
            if (error.error.errors) {
              error.error.errors.forEach(x => {
                errors.push(x);
              });
              this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', errors);
            } else {
              this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK');
            }
          }
        }
      });
    }
  }

  getTransactionDetails(requestId = null, responseId = null) {
    this.sharedServices.loadingChanged.next(true);
    // tslint:disable-next-line:max-line-length
    this.providerNphiesApprovalService.getTransactionDetails(this.sharedServices.providerId, requestId, responseId).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          const body: any = event.body;
          this.detailsModel = body;
          this.IsJSONPosted = true;
        }
        this.sharedServices.loadingChanged.next(false);
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          if (error.error && error.error.errors) {
            // tslint:disable-next-line:max-line-length
            this.dialogService.showMessage('Error', (error.error && error.error.message) ? error.error.message : ((error.error && !error.error.message) ? error.error : (error.error ? error.error : error.message)), 'alert', true, 'OK', error.error.errors);
          } else {
            // tslint:disable-next-line:max-line-length
            this.dialogService.showMessage('Error', (error.error && error.error.message) ? error.error.message : ((error.error && !error.error.message) ? error.error : (error.error ? error.error : error.message)), 'alert', true, 'OK');
          }
        } else if (error.status === 404) {
          this.dialogService.showMessage('Error', error.error.message ? error.error.message : error.error.error, 'alert', true, 'OK');
        } else if (error.status === 500) {
          this.dialogService.showMessage('Error', error.error.message, 'alert', true, 'OK');
        }
        this.sharedServices.loadingChanged.next(false);
      }
    });
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
    this.CareTeams = [];
    this.Diagnosises = [];
    this.SupportingInfo = [];
    this.VisionSpecifications = [];
    this.Items = [];
    this.isSubmitted = false;
    this.IsJSONPosted = false;
  }

  get IsCareTeamRequired() {
    if (this.isSubmitted) {
      // tslint:disable-next-line:max-line-length
      if (!this.FormPreAuthorization.controls.type.value || (this.FormPreAuthorization.controls.type.value && this.FormPreAuthorization.controls.type.value.value !== 'pharmacy')) {
        if (this.CareTeams.length === 0) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  }

}
