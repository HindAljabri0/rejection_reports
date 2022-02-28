import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BeneficiariesSearchResult } from 'src/app/models/nphies/beneficiaryFullTextSearchResult';
import { Observable, ReplaySubject } from 'rxjs';
import { nationalities } from 'src/app/claim-module-components/store/claim.reducer';
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SharedServices } from 'src/app/services/shared.services';
import { Location, DatePipe } from '@angular/common';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { ProviderNphiesApprovalService } from 'src/app/services/providerNphiesApprovalService/provider-nphies-approval.service';
import { HttpResponse, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { AddEditVisionLensSpecificationsComponent } from '../add-preauthorization/add-edit-vision-lens-specifications/add-edit-vision-lens-specifications.component';
import { AddEditCareTeamModalComponent } from '../add-preauthorization/add-edit-care-team-modal/add-edit-care-team-modal.component';
import { AddEditDiagnosisModalComponent } from '../add-preauthorization/add-edit-diagnosis-modal/add-edit-diagnosis-modal.component';
import { ConfirmationAlertDialogComponent } from 'src/app/components/confirmation-alert-dialog/confirmation-alert-dialog.component';
import { AddEditPreauthorizationItemComponent } from '../add-edit-preauthorization-item/add-edit-preauthorization-item.component';
import { AddEditSupportingInfoModalComponent } from '../add-preauthorization/add-edit-supporting-info-modal/add-edit-supporting-info-modal.component';
import { NphiesClaimUploaderService } from 'src/app/services/nphiesClaimUploaderService/nphies-claim-uploader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AddEditItemDetailsModalComponent } from '../add-edit-item-details-modal/add-edit-item-details-modal.component';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import * as moment from 'moment';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { AddCommunicationDialogComponent } from '../add-communication-dialog/add-communication-dialog.component';
import { AttachmentViewDialogComponent } from 'src/app/components/dialogs/attachment-view-dialog/attachment-view-dialog.component';
import { AttachmentViewData } from 'src/app/components/dialogs/attachment-view-dialog/attachment-view-data';

@Component({
    selector: 'app-create-claim-nphies',
    templateUrl: './create-claim-nphies.component.html',
    styles: []
})
export class CreateClaimNphiesComponent implements OnInit {
    errorMessage = null;
    beneficiarySearchController = new FormControl();
    beneficiariesSearchResult: BeneficiariesSearchResult[] = [];
    selectedBeneficiary: BeneficiariesSearchResult;
    selectedPlanId: string;
    selectedPlanIdError: string;
    isLoading = false;
    filteredNations: ReplaySubject<{ Code: string, Name: string }[]> = new ReplaySubject<{ Code: string, Name: string }[]>(1);

    FormNphiesClaim: FormGroup = this.formBuilder.group({
        beneficiaryName: ['', Validators.required],
        beneficiaryId: ['', Validators.required],
        patientFileNumber: [''],
        insurancePlanId: ['', Validators.required],
        preAuthRefNo: [''],
        dateOrdered: ['', Validators.required],
        payee: ['', Validators.required],
        payeeType: ['', Validators.required],
        type: ['', Validators.required],
        subType: [''],
        eligibilityOfflineId: [''],
        eligibilityOfflineDate: [''],
        eligibilityResponseId: [''],
        preAuthOfflineDate: [''],
        // preAuthResponseId: [''],
        accidentType: [''],
        streetName: [''],
        city: [''],
        state: [''],
        country: [''],
        countryName: [''],
        date: [''],
        dateWritten: [''],
        prescriber: [''],
        status: [''],
        encounterClass: [''],
        serviceType: [''],
        priority: [''],
        startDate: [''],
        periodEnd: [''],
        origin: [''],
        adminSource: [''],
        reAdmission: [''],
        dischargeDispotion: [''],
        serviceProvider: ['']
    });

    typeList = this.sharedDataService.claimTypeList;
    payeeTypeList = this.sharedDataService.payeeTypeList;
    payeeList = [];
    subTypeList = [];
    accidentTypeList = this.sharedDataService.accidentTypeList;
    encounterStatusList = this.sharedDataService.encounterStatusList;
    encounterClassList = this.sharedDataService.encounterClassList;
    encounterServiceTypeList = this.sharedDataService.encounterServiceTypeList;
    encounterPriorityList = this.sharedDataService.encounterPriorityList;
    encounterAdminSourceList = this.sharedDataService.encounterAdminSourceList;
    encounterReAdmissionList = this.sharedDataService.encounterReAdmissionList;
    encounterDischargeDispositionList = this.sharedDataService.encounterDischargeDispositionList;
    beneficiaryTypeList = this.sharedDataService.beneficiaryTypeList;

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
    IsItemRequired = false;
    IsDateWrittenRequired = false;
    IsPrescriberRequired = false;

    IsDateRequired = false;
    IsAccidentTypeRequired = false;

    today: Date;
    nationalities = nationalities;
    selectedCountry = '';

    IsStatusRequired = false;
    IsClassRequired = false;
    IsServiceProviderRequired = false;

    hasErrorClaimInfo = false;

    claimId: number;
    uploadId: number;
    responseId: number;
    pageMode = '';
    currentOpenItem: number = null;
    otherDataModel: any = {};

    communications = [];

    constructor(

        private activatedRoute: ActivatedRoute,
        private location: Location,
        private dialogService: DialogService,
        private sharedDataService: SharedDataService,
        private sharedService: SharedServices,
        private router: Router,
        private providerNphiesApprovalService: ProviderNphiesApprovalService,
        private dialog: MatDialog, private formBuilder: FormBuilder, private sharedServices: SharedServices, private datePipe: DatePipe,
        private providerNphiesSearchService: ProviderNphiesSearchService,
        private providersBeneficiariesService: ProvidersBeneficiariesService,
        private nphiesClaimUploaderService: NphiesClaimUploaderService) {
        this.today = new Date();
    }

    ngOnInit() {
        if (this.activatedRoute.snapshot.queryParams.claimId) {
            // this.isLoading = true;
            // tslint:disable-next-line:radix
            this.claimId = parseInt(this.activatedRoute.snapshot.queryParams.claimId);

        } else {

            this.pageMode = 'CREATE';
            this.isLoading = false;

        }

        if (this.activatedRoute.snapshot.queryParams.uploadId) {
            // tslint:disable-next-line:radix
            this.uploadId = parseInt(this.activatedRoute.snapshot.queryParams.uploadId);
        }

        if (this.activatedRoute.snapshot.queryParams.claimResponseId) {
            // tslint:disable-next-line:radix
            this.responseId = parseInt(this.activatedRoute.snapshot.queryParams.claimResponseId);
        }

        this.getPayees();
        this.FormNphiesClaim.controls.dateOrdered.setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
        this.filteredNations.next(this.nationalities.slice());

    }

    toEditMode() {
        this.pageMode = true ? 'EDIT' : 'ReSubmit';
        this.selectedBeneficiary = {
            documentId: this.otherDataModel.beneficiary.documentId,
            documentType: this.otherDataModel.beneficiary.documentType,
            id: this.otherDataModel.beneficiary.id,
            name: this.otherDataModel.beneficiary.beneficiaryName,
            plans: [{
                payerNphiesId: this.otherDataModel.payerNphiesId,
                payerName: this.otherDataModel.insurer,
                memberCardId: this.otherDataModel.memberCardId,
                planId: null,
                payerId: null,
                coverageType: this.otherDataModel.insurancePlan,
                expiryDate: null,
                primary: null,
                relationWithSubscriber: this.otherDataModel.relationWithSubscriber
            }]
        };
        this.FormNphiesClaim.patchValue({
            beneficiaryName: this.otherDataModel.beneficiary.beneficiaryName + ' (' + this.otherDataModel.beneficiary.documentId + ')',
            beneficiaryId: this.otherDataModel.beneficiary.id
        });
        this.FormNphiesClaim.controls.insurancePlanId.setValue(this.otherDataModel.payerNphiesId.toString());
        this.enableControls();
    }

    cancelEdit() {
        this.pageMode = 'VIEW';
        this.disableControls();
    }

    getPayees() {
        this.sharedServices.loadingChanged.next(true);
        this.providersBeneficiariesService.getPayees().subscribe(event => {
            if (event instanceof HttpResponse) {
                if (event.body != null && event.body instanceof Array) {
                    this.payeeList = event.body;
                    this.FormNphiesClaim.controls.payeeType.setValue(this.sharedDataService.payeeTypeList.filter(x => x.value === 'provider')[0]);
                    this.onPayeeTypeChange();
                    if (this.claimId && this.uploadId) {
                        this.pageMode = 'VIEW';
                        if (this.responseId) {
                            this.getCommunications();
                        }
                        this.disableControls();
                        this.getClaimDetails();
                    } else {
                        this.isLoading = false;
                        this.sharedServices.loadingChanged.next(false);
                    }
                } else {
                    this.isLoading = false;
                    this.sharedServices.loadingChanged.next(false);
                }
            }
        }, err => {
            if (err instanceof HttpErrorResponse) {
                console.log('Error');
                this.isLoading = false;
                //  this.errorMessage=err.message
                this.sharedServices.loadingChanged.next(false);
            }
        });
    }

    disableControls() {
        this.FormNphiesClaim.controls.beneficiaryName.disable();
        this.FormNphiesClaim.controls.beneficiaryId.disable();
        this.FormNphiesClaim.controls.patientFileNumber.disable();
        this.FormNphiesClaim.controls.insurancePlanId.disable();
        this.FormNphiesClaim.controls.dateOrdered.disable();
        this.FormNphiesClaim.controls.payeeType.disable();
        this.FormNphiesClaim.controls.payee.disable();
        this.FormNphiesClaim.controls.type.disable();
        this.FormNphiesClaim.controls.subType.disable();
        this.FormNphiesClaim.controls.accidentType.disable();
        this.FormNphiesClaim.controls.streetName.disable();
        this.FormNphiesClaim.controls.city.disable();
        this.FormNphiesClaim.controls.state.disable();
        this.FormNphiesClaim.controls.country.disable();
        this.FormNphiesClaim.controls.countryName.disable();
        this.FormNphiesClaim.controls.date.disable();
        // this.FormNphiesClaim.controls.dateWritten.disable();
        // this.FormNphiesClaim.controls.prescriber.disable();
        this.FormNphiesClaim.controls.status.disable();
        this.FormNphiesClaim.controls.encounterClass.disable();
        this.FormNphiesClaim.controls.serviceType.disable();
        this.FormNphiesClaim.controls.priority.disable();
        this.FormNphiesClaim.controls.startDate.disable();
        this.FormNphiesClaim.controls.periodEnd.disable();
        this.FormNphiesClaim.controls.origin.disable();
        this.FormNphiesClaim.controls.adminSource.disable();
        this.FormNphiesClaim.controls.reAdmission.disable();
        this.FormNphiesClaim.controls.dischargeDispotion.disable();
        this.FormNphiesClaim.controls.serviceProvider.disable();
        this.FormNphiesClaim.controls.eligibilityOfflineId.disable();
        this.FormNphiesClaim.controls.eligibilityOfflineDate.disable();
        this.FormNphiesClaim.controls.eligibilityResponseId.disable();
        this.FormNphiesClaim.controls.preAuthOfflineDate.disable();
        // this.FormNphiesClaim.controls.preAuthResponseId.disable();
    }

    enableControls() {
        this.FormNphiesClaim.controls.beneficiaryName.disable();
        this.FormNphiesClaim.controls.beneficiaryId.disable();
        this.FormNphiesClaim.controls.patientFileNumber.enable();
        this.FormNphiesClaim.controls.insurancePlanId.disable();
        this.FormNphiesClaim.controls.dateOrdered.enable();
        this.FormNphiesClaim.controls.payeeType.enable();
        this.FormNphiesClaim.controls.payee.enable();
        this.FormNphiesClaim.controls.type.disable();
        this.FormNphiesClaim.controls.subType.disable();
        this.FormNphiesClaim.controls.accidentType.enable();
        this.FormNphiesClaim.controls.streetName.enable();
        this.FormNphiesClaim.controls.city.enable();
        this.FormNphiesClaim.controls.state.enable();
        this.FormNphiesClaim.controls.country.enable();
        this.FormNphiesClaim.controls.countryName.enable();
        this.FormNphiesClaim.controls.date.enable();
        this.FormNphiesClaim.controls.dateWritten.enable();
        this.FormNphiesClaim.controls.prescriber.enable();
        this.FormNphiesClaim.controls.status.enable();
        this.FormNphiesClaim.controls.encounterClass.enable();
        this.FormNphiesClaim.controls.serviceType.enable();
        this.FormNphiesClaim.controls.priority.enable();
        this.FormNphiesClaim.controls.startDate.enable();
        this.FormNphiesClaim.controls.periodEnd.enable();
        this.FormNphiesClaim.controls.origin.enable();
        this.FormNphiesClaim.controls.adminSource.enable();
        this.FormNphiesClaim.controls.reAdmission.enable();
        this.FormNphiesClaim.controls.dischargeDispotion.enable();
        this.FormNphiesClaim.controls.serviceProvider.enable();
        this.FormNphiesClaim.controls.eligibilityOfflineId.enable();
        this.FormNphiesClaim.controls.eligibilityOfflineDate.enable();
        this.FormNphiesClaim.controls.eligibilityResponseId.enable();
        this.FormNphiesClaim.controls.preAuthOfflineDate.enable();
        // this.FormNphiesClaim.controls.preAuthResponseId.disable();
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

    onPayeeTypeChange() {
        if (this.FormNphiesClaim.controls.payeeType.value && this.FormNphiesClaim.controls.payeeType.value.value === 'provider') {
            // tslint:disable-next-line:max-line-length
            this.FormNphiesClaim.controls.payee.setValue(this.payeeList.filter(x => x.cchiid === this.sharedServices.cchiId)[0] ? this.payeeList.filter(x => x.cchiid === this.sharedServices.cchiId)[0].nphiesId : '');
        }
        this.FormNphiesClaim.controls.payeeType.disable();
        this.FormNphiesClaim.controls.payee.disable();
    }

    onStatusOrClassChange() {
        if (this.FormNphiesClaim.controls.serviceProvider.value === '') {
            this.FormNphiesClaim.controls.serviceProvider.setValue(this.payeeList.filter(x => x.cchiid === this.sharedServices.cchiId)[0] ? this.payeeList.filter(x => x.cchiid === this.sharedServices.cchiId)[0].nphiesId : '');
        }
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

            this.Items = [];
            this.VisionSpecifications = [];
        }
    }

    searchBeneficiaries() {
        // tslint:disable-next-line:max-line-length
        this.providerNphiesSearchService.beneficiaryFullTextSearch(this.sharedServices.providerId, this.FormNphiesClaim.controls.beneficiaryName.value).subscribe(event => {
            if (event instanceof HttpResponse) {
                const body = event.body;
                if (body instanceof Array) {
                    this.beneficiariesSearchResult = body;
                    // TODO: causing build issues
                    // if (name) {
                    //   this.selectBeneficiary(this.selectedBeneficiary);
                    // }
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
                            x.specialityCode = result.specialityCode;
                            x.qualificationCode = result.specialityCode;
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
            type: this.FormNphiesClaim.controls.type.value ? this.FormNphiesClaim.controls.type.value.value : '',
            pageMode: this.pageMode
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
    getClaimStatusColor(status: string) {
        if (status != null) {
            return this.sharedService.getCardAccentColor(status);
        }
        return 'all-claim';
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
                            x.display = result.display;
                            x.isPackage = result.isPackage;
                            x.bodySite = result.bodySite;
                            x.bodySiteName = result.bodySiteName;
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

                            if (!x.isPackage) {
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
            type: this.FormNphiesClaim.controls.type.value.value
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
            if (this.FormNphiesClaim.controls.type.value && this.FormNphiesClaim.controls.type.value.value === 'pharmacy') {
                return true;
            } else if (this.FormNphiesClaim.controls.type.value && this.FormNphiesClaim.controls.type.value.value !== 'pharmacy') {
                if (this.Items.find(x => (x.careTeamSequence && x.careTeamSequence.length === 0))) {
                    this.dialogService.showMessage('Error', 'All Items must have atleast one care team', 'alert', true, 'OK');
                    return false;
                } else {
                    return true;
                }
            }

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

        if (this.Diagnosises.length === 0 || this.Items.length === 0) {
            hasError = true;
        }

        // this.checkCareTeamValidation();
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

            const now = new Date(Date.now());
            // tslint:disable-next-line:max-line-length
            this.model.provClaimNo = `${this.sharedServices.providerId}${now.getFullYear() % 100}${now.getMonth()}${now.getDate()}${now.getHours()}${now.getMinutes()}`;

            this.model.coverageType = this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === this.model.payerNphiesId)[0].coverageType;
            this.model.memberCardId = this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === this.model.payerNphiesId)[0].memberCardId;
            this.model.payerNphiesId = this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === this.model.payerNphiesId)[0].payerNphiesId;
            // tslint:disable-next-line:max-line-length
            this.model.relationWithSubscriber = this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === this.model.payerNphiesId)[0].relationWithSubscriber;

            if (this.FormNphiesClaim.controls.preAuthRefNo.value) {
                this.model.preAuthRefNo = this.FormNphiesClaim.controls.preAuthRefNo.value.map(x => {
                    return x.value;
                });
            }

            const preAuthorizationModel: any = {};
            preAuthorizationModel.dateOrdered = this.datePipe.transform(this.FormNphiesClaim.controls.dateOrdered.value, 'yyyy-MM-dd');
            if (this.FormNphiesClaim.controls.payeeType.value && this.FormNphiesClaim.controls.payeeType.value.value === 'provider') {
                // tslint:disable-next-line:max-line-length
                preAuthorizationModel.payeeId = this.payeeList.filter(x => x.cchiid === this.sharedServices.cchiId)[0] ? this.payeeList.filter(x => x.cchiid === this.sharedServices.cchiId)[0].nphiesId : '';
            } else {
                preAuthorizationModel.payeeId = this.FormNphiesClaim.controls.payee.value;
            }
            preAuthorizationModel.payeeType = this.FormNphiesClaim.controls.payeeType.value.value;
            preAuthorizationModel.type = this.FormNphiesClaim.controls.type.value.value;
            preAuthorizationModel.subType = this.FormNphiesClaim.controls.subType.value.value;
            // tslint:disable-next-line:max-line-length
            preAuthorizationModel.eligibilityOfflineDate = this.datePipe.transform(this.FormNphiesClaim.controls.eligibilityOfflineDate.value, 'yyyy-MM-dd');
            preAuthorizationModel.eligibilityOfflineId = this.FormNphiesClaim.controls.eligibilityOfflineId.value;
            preAuthorizationModel.eligibilityResponseId = this.FormNphiesClaim.controls.eligibilityResponseId.value;
            // tslint:disable-next-line:max-line-length
            preAuthorizationModel.preAuthOfflineDate = this.datePipe.transform(this.FormNphiesClaim.controls.preAuthOfflineDate.value, 'yyyy-MM-dd');
            // preAuthorizationModel.preAuthResponseId = this.FormNphiesClaim.controls.preAuthResponseId.value;

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
                model.specialityCode = x.specialityCode;
                model.qualificationCode = x.qualificationCode;
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
                    model.lensNote = x.lensNote;
                    return model;
                });
            }

            this.model.items = this.Items.map(x => {
                // tslint:disable-next-line:max-line-length
                if ((this.FormNphiesClaim.controls.type.value && this.FormNphiesClaim.controls.type.value.value !== 'pharmacy') && x.careTeamSequence && x.careTeamSequence.length > 0) {
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
                } else if (this.FormNphiesClaim.controls.type.value && this.FormNphiesClaim.controls.type.value.value === 'pharmacy') {
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

            if (this.FormNphiesClaim.controls.status.value) {
                const encounterModel: any = {};
                encounterModel.status = this.FormNphiesClaim.controls.status.value;
                encounterModel.encounterClass = this.FormNphiesClaim.controls.encounterClass.value;
                encounterModel.serviceType = this.FormNphiesClaim.controls.serviceType.value;
                encounterModel.startDate = this.datePipe.transform(this.FormNphiesClaim.controls.startDate.value, 'yyyy-MM-dd');
                encounterModel.periodEnd = this.datePipe.transform(this.FormNphiesClaim.controls.periodEnd.value, 'yyyy-MM-dd');
                encounterModel.origin = parseFloat(this.FormNphiesClaim.controls.origin.value);
                encounterModel.adminSource = this.FormNphiesClaim.controls.adminSource.value;
                encounterModel.reAdmission = this.FormNphiesClaim.controls.reAdmission.value;
                encounterModel.dischargeDispotion = this.FormNphiesClaim.controls.dischargeDispotion.value;
                encounterModel.priority = this.FormNphiesClaim.controls.priority.value;
                encounterModel.serviceProvider = this.FormNphiesClaim.controls.serviceProvider.value;
                this.model.claimEncounter = encounterModel;
            }

            console.log('Model', this.model);

            let requestObservable: Observable<HttpEvent<any>>;
            if (this.pageMode == 'CREATE') {
                requestObservable = this.nphiesClaimUploaderService.createNphisClaim(this.sharedServices.providerId, this.model);
            } else if (this.pageMode == "EDIT") {
                requestObservable = this.nphiesClaimUploaderService.updateNphiesClaim(this.sharedServices.providerId, `${this.claimId}`, this.model);
            }


            requestObservable.subscribe(event => {
                if (event instanceof HttpResponse) {
                    if (event.status === 200) {
                        const body: any = event.body;
                        if (body.isError) {
                            this.dialogService.showMessage('Error', body.message, 'alert', true, 'OK', body.errors);
                            if (this.pageMode == 'CREATE') {
                                this.router.navigateByUrl(`/${this.sharedServices.providerId}/claims/nphies-claim?claimId=${body.claimId}&uploadId=${body.uploadId}`);
                            }
                        } else {
                            if (this.pageMode == 'CREATE') {
                                this.reset();
                                this.dialogService.showMessage('Success', body.message, 'success', true, 'OK');
                                this.router.navigateByUrl(`/${this.sharedServices.providerId}/claims/nphies-claim?claimId=${body.claimId}&uploadId=${body.uploadId}`);
                            } else {
                                this.dialogService.showMessage('Success', body.message, 'success', true, 'OK', null, true);
                                this.ngOnInit();
                                // location.reload();
                            }
                        }
                    }
                    this.sharedServices.loadingChanged.next(false);
                }
            }, error => {
                if (error instanceof HttpErrorResponse) {
                    if (error.status === 400) {
                        this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', error.error.errors, true);
                    } else if (error.status === 404) {
                        const errors: any[] = [];
                        if (error.error.errors) {
                            error.error.errors.forEach(x => {
                                errors.push(x);
                            });
                            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', errors, true);
                        } else {
                            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', null, true);
                        }
                    } else if (error.status === 500) {
                        // tslint:disable-next-line:max-line-length
                        this.dialogService.showMessage(error.error.message ? error.error.message : error.error.error, '', 'alert', true, 'OK', null, true);
                    } else if (error.status === 503) {
                        const errors: any[] = [];
                        if (error.error.errors) {
                            error.error.errors.forEach(x => {
                                errors.push(x);
                            });
                            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', errors, true);
                        } else {
                            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', null, true);
                        }
                    }
                    this.sharedServices.loadingChanged.next(false);
                }
            });
        }
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

    get checkErrorAccident() {
        let hasError = false;
        if (this.isSubmitted) {

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
            if (!hasError) {
                this.IsAccidentTypeRequired = false;
                this.IsDateRequired = false;
            }
        }

        return hasError;
    }

    get checkErrorEncounter() {
        let hasError = false;
        if (this.isSubmitted) {

            if ((this.FormNphiesClaim.controls.encounterClass.value || this.FormNphiesClaim.controls.serviceProvider.value) && !this.FormNphiesClaim.controls.status.value) {
                this.FormNphiesClaim.controls.status.setValidators([Validators.required]);
                this.FormNphiesClaim.controls.status.updateValueAndValidity();
                this.IsStatusRequired = true;
                hasError = true;
            } else {
                this.FormNphiesClaim.controls.status.clearValidators();
                this.FormNphiesClaim.controls.status.updateValueAndValidity();
                this.IsStatusRequired = false;
            }
            if (!this.FormNphiesClaim.controls.encounterClass.value && (this.FormNphiesClaim.controls.serviceProvider.value || this.FormNphiesClaim.controls.status.value)) {
                this.FormNphiesClaim.controls.encounterClass.setValidators([Validators.required]);
                this.FormNphiesClaim.controls.encounterClass.updateValueAndValidity();
                this.IsClassRequired = true;
                hasError = true;
            } else {
                this.FormNphiesClaim.controls.encounterClass.clearValidators();
                this.FormNphiesClaim.controls.encounterClass.updateValueAndValidity();
                this.IsClassRequired = false;
            }
            if ((this.FormNphiesClaim.controls.encounterClass.value || this.FormNphiesClaim.controls.status.value) && !this.FormNphiesClaim.controls.serviceProvider.value) {
                this.FormNphiesClaim.controls.serviceProvider.setValidators([Validators.required]);
                this.FormNphiesClaim.controls.serviceProvider.updateValueAndValidity();
                this.IsServiceProviderRequired = true;
                hasError = true;
            } else {
                this.FormNphiesClaim.controls.serviceProvider.clearValidators();
                this.FormNphiesClaim.controls.serviceProvider.updateValueAndValidity();
                this.IsServiceProviderRequired = false;
            }
            if (!hasError) {
                this.IsStatusRequired = false;
                this.IsClassRequired = false;
                this.IsServiceProviderRequired = false;
            }
        }

        return hasError;
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
        this.providerNphiesApprovalService.getNphisClaimDetails(this.sharedServices.providerId, this.claimId, this.uploadId, this.responseId).subscribe(event => {
            if (event instanceof HttpResponse) {
                if (event.status === 200) {
                    const body: any = event.body;
                    this.setData(body);
                } else {
                    this.sharedServices.loadingChanged.next(false);
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

        this.sharedServices.loadingChanged.next(true);
        this.otherDataModel = {};

        this.otherDataModel.paymentReconciliationDetails = response.paymentReconciliationDetails;
        this.otherDataModel.batchClaimNumber = response.batchClaimNumber;
        this.otherDataModel.submissionDate = response.submissionDate;

        //     componentEarlyFee: null
        // componentNphiesFee: null
        // componentPayment: 40.25
        // paymentDate: "2021-12-07T21:30:00.000+03:00"
        // type: "payment"
        this.otherDataModel.claimId = response.claimId;
        this.otherDataModel.outcome = response.outcome;
        this.otherDataModel.disposition = response.disposition;
        this.otherDataModel.insurer = response.insurer;
        this.otherDataModel.batchInfo = response.batchInfo;
        this.otherDataModel.beneficiary = response.beneficiary;
        if (this.otherDataModel.beneficiary && this.otherDataModel.beneficiary.documentType) {
            // tslint:disable-next-line:max-line-length
            this.otherDataModel.beneficiary.documentTypeName = this.beneficiaryTypeList.filter(x => x.value === this.otherDataModel.beneficiary.documentType)[0] ? this.beneficiaryTypeList.filter(x => x.value === this.otherDataModel.beneficiary.documentType)[0].name : '-';
        }
        this.otherDataModel.accident = response.accident;
        this.otherDataModel.insurancePlan = response.coverageType;
        this.otherDataModel.provClaimNo = response.provClaimNo;
        this.otherDataModel.claimRefNo = response.claimRefNo;
        this.otherDataModel.status = response.status;
        this.otherDataModel.totalNet = response.totalNet;
        this.otherDataModel.preAuthRefNo = response.preAuthDetails;
        this.otherDataModel.responseDecision = response.responseDecision;
        this.otherDataModel.providertransactionlogId = response.providertransactionlogId;
        this.otherDataModel.payerNphiesId = response.payerNphiesId;
        this.otherDataModel.memberCardId = response.memberCardId;
        this.otherDataModel.relationWithSubscriber = response.relationWithSubscriber;
        // this.otherDataModel.totalAmount = response.totalAmount;

        if (response.preAuthDetails) {
            this.FormNphiesClaim.controls.preAuthRefNo.setValue(response.preAuthDetails);
        }

        // this.otherDataModel.claimEncounter = response.claimEncounter;

        this.otherDataModel.errors = response.errors;
        this.otherDataModel.processNotes = response.processNotes;

        this.FormNphiesClaim.controls.patientFileNumber.setValue(response.patientFileNumber);
        this.FormNphiesClaim.controls.dateOrdered.setValue(response.preAuthorizationInfo.dateOrdered);

        if (response.preAuthorizationInfo.payeeType) {
            // tslint:disable-next-line:max-line-length
            this.FormNphiesClaim.controls.payeeType.setValue(this.sharedDataService.payeeTypeList.filter(x => x.value === response.preAuthorizationInfo.payeeType)[0] ? this.sharedDataService.payeeTypeList.filter(x => x.value === response.preAuthorizationInfo.payeeType)[0] : '');
            // tslint:disable-next-line:max-line-length
            this.FormNphiesClaim.controls.payee.setValue(this.payeeList.filter(x => x.nphiesId === response.preAuthorizationInfo.payeeId)[0] ? this.payeeList.filter(x => x.nphiesId === response.preAuthorizationInfo.payeeId)[0].nphiesId : '');
            // tslint:disable-next-line:max-line-length
            this.otherDataModel.payeeName = this.payeeList.filter(x => x.nphiesId === response.preAuthorizationInfo.payeeId)[0] ? this.payeeList.filter(x => x.nphiesId === response.preAuthorizationInfo.payeeId)[0].englistName : '';
        }

        // tslint:disable-next-line:max-line-length
        this.FormNphiesClaim.controls.type.setValue(this.sharedDataService.claimTypeList.filter(x => x.value === response.preAuthorizationInfo.type)[0] ? this.sharedDataService.claimTypeList.filter(x => x.value === response.preAuthorizationInfo.type)[0] : '');

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
            this.FormNphiesClaim.controls.subType.setValue(this.sharedDataService.subTypeList.filter(x => x.value === response.preAuthorizationInfo.subType)[0] ? this.sharedDataService.subTypeList.filter(x => x.value === response.preAuthorizationInfo.subType)[0] : '');
        }

        if (response.preAuthorizationInfo.eligibilityOfflineId != null) {
            // tslint:disable-next-line:max-line-length
            this.FormNphiesClaim.controls.eligibilityOfflineId.setValue(response.preAuthorizationInfo.eligibilityOfflineId);
        }

        if (response.preAuthorizationInfo.eligibilityOfflineDate != null) {
            // tslint:disable-next-line:max-line-length
            this.FormNphiesClaim.controls.eligibilityOfflineDate.setValue(response.preAuthorizationInfo.eligibilityOfflineDate);
        }

        if (response.preAuthorizationInfo.eligibilityResponseId != null) {
            // tslint:disable-next-line:max-line-length
            this.FormNphiesClaim.controls.eligibilityResponseId.setValue(response.preAuthorizationInfo.eligibilityResponseId);
        }

        if (response.preAuthorizationInfo.preAuthOfflineDate != null) {
            // tslint:disable-next-line:max-line-length
            this.FormNphiesClaim.controls.preAuthOfflineDate.setValue(response.preAuthorizationInfo.preAuthOfflineDate);
        }

        // if (response.preAuthorizationInfo.preAuthResponseId != null) {
        //   // tslint:disable-next-line:max-line-length
        //   this.FormNphiesClaim.controls.preAuthResponseId.setValue(response.preAuthorizationInfo.preAuthResponseId);
        // }

        if (response.claimEncounter) {
            this.otherDataModel.claimEncounter = response.claimEncounter;
            if (response.claimEncounter.status != null) {
                this.FormNphiesClaim.controls.status.setValue(response.claimEncounter.status);
                // tslint:disable-next-line:max-line-length
                this.otherDataModel.claimEncounter.statusName = this.encounterStatusList.filter(x => x.value === response.claimEncounter.status)[0] ? this.encounterStatusList.filter(x => x.value === response.claimEncounter.status)[0].name : '';
            }

            if (response.claimEncounter.encounterClass != null) {
                this.FormNphiesClaim.controls.encounterClass.setValue(response.claimEncounter.encounterClass);
                // tslint:disable-next-line:max-line-length
                this.otherDataModel.claimEncounter.encounterClassName = this.encounterClassList.filter(x => x.value === response.claimEncounter.encounterClass)[0] ? this.encounterClassList.filter(x => x.value === response.claimEncounter.encounterClass)[0].name : '';
            }

            if (response.claimEncounter.serviceType != null) {
                this.FormNphiesClaim.controls.serviceType.setValue(response.claimEncounter.serviceType);
                // tslint:disable-next-line:max-line-length
                this.otherDataModel.claimEncounter.serviceTypeName = this.encounterServiceTypeList.filter(x => x.value === response.claimEncounter.serviceType)[0] ? this.encounterServiceTypeList.filter(x => x.value === response.claimEncounter.serviceType)[0].name : '';

            }

            if (response.claimEncounter.startDate != null) {
                // tslint:disable-next-line:max-line-length
                this.FormNphiesClaim.controls.startDate.setValue(response.claimEncounter.startDate);
            }

            if (response.claimEncounter.periodEnd != null) {
                // tslint:disable-next-line:max-line-length
                this.FormNphiesClaim.controls.periodEnd.setValue(response.claimEncounter.periodEnd);
            }

            if (response.claimEncounter.origin != null) {
                this.FormNphiesClaim.controls.origin.setValue(response.claimEncounter.origin);
                // tslint:disable-next-line:max-line-length
                this.otherDataModel.claimEncounter.originName = this.payeeList.filter(x => x.nphiesId === response.claimEncounter.origin)[0] ? this.payeeList.filter(x => x.nphiesId === response.claimEncounter.origin)[0].englistName : '';

            }

            if (response.claimEncounter.adminSource != null) {
                this.FormNphiesClaim.controls.adminSource.setValue(response.claimEncounter.adminSource);
                // tslint:disable-next-line:max-line-length
                this.otherDataModel.claimEncounter.adminSourceName = this.encounterAdminSourceList.filter(x => x.value === response.claimEncounter.adminSource)[0] ? this.encounterAdminSourceList.filter(x => x.value === response.claimEncounter.adminSource)[0].name : '';

            }

            if (response.claimEncounter.reAdmission != null) {
                this.FormNphiesClaim.controls.reAdmission.setValue(response.claimEncounter.reAdmission);
                // tslint:disable-next-line:max-line-length
                this.otherDataModel.claimEncounter.reAdmissionName = this.encounterReAdmissionList.filter(x => x.value === response.claimEncounter.reAdmission)[0] ? this.encounterReAdmissionList.filter(x => x.value === response.claimEncounter.reAdmission)[0].name : '';

            }

            if (response.claimEncounter.dischargeDispotion != null) {
                this.FormNphiesClaim.controls.dischargeDispotion.setValue(response.claimEncounter.dischargeDispotion);
                // tslint:disable-next-line:max-line-length
                this.otherDataModel.claimEncounter.dischargeDispotionName = this.encounterDischargeDispositionList.filter(x => x.value === response.claimEncounter.dischargeDispotion)[0] ? this.encounterDischargeDispositionList.filter(x => x.value === response.claimEncounter.dischargeDispotion)[0].name : '';

            }

            if (response.claimEncounter.priority != null) {
                // tslint:disable-next-line:max-line-length
                // this.FormNphiesClaim.controls.priority.setValue(this.sharedDataService.encounterPriorityList.filter(x => x.value === response.claimEncounter.priority)[0] ? this.sharedDataService.encounterDischargeDispositionList.filter(x => x.value === response.claimEncounter.priority)[0] : '');
                this.FormNphiesClaim.controls.priority.setValue(response.claimEncounter.priority);
                // tslint:disable-next-line:max-line-length
                this.otherDataModel.claimEncounter.priorityName = this.encounterPriorityList.filter(x => x.value === response.claimEncounter.priority)[0] ? this.encounterPriorityList.filter(x => x.value === response.claimEncounter.priority)[0].name : '';

            }

            if (response.claimEncounter.serviceProvider != null) {
                this.FormNphiesClaim.controls.serviceProvider.setValue(response.claimEncounter.serviceProvider);
                // tslint:disable-next-line:max-line-length
                this.otherDataModel.claimEncounter.serviceProviderName = this.payeeList.filter(x => x.nphiesId === response.claimEncounter.serviceProvider)[0] ? this.payeeList.filter(x => x.nphiesId === response.claimEncounter.serviceProvider)[0].englistName : '';
            }

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
        }).sort((a, b) => a.sequence - b.sequence);

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

            model.attachmentDate = x.attachmentDate;
            model.attachmentName = x.attachmentName;
            model.attachmentType = x.attachmentType;

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

            model.reasonName = this.sharedDataService.reasonList.filter(y => y.value === x.reason)[0] ? this.sharedDataService.reasonList.filter(y => y.value === x.reason)[0].name : '';
            model.fromDateStr = this.datePipe.transform(x.fromDate, 'dd-MM-yyyy');
            model.toDateStr = this.datePipe.transform(x.toDate, 'dd-MM-yyyy');
            model.unit = this.sharedDataService.durationUnitList.filter(y => y.value === x.unit)[0] ? this.sharedDataService.durationUnitList.filter(y => y.value === x.unit)[0].name : '';
            model.byteArray = x.attachment;
            return model;

        }).sort((a, b) => a.sequence - b.sequence);

        if (response.careTeam) {
            this.CareTeams = response.careTeam.map(x => {
                const model: any = {};
                model.sequence = x.sequence;
                model.practitionerName = x.practitionerName;
                model.physicianCode = x.physicianCode;
                model.practitionerRole = x.practitionerRole;
                model.careTeamRole = x.careTeamRole;
                model.speciality = x.speciality;
                model.specialityCode = x.specialityCode;
                // tslint:disable-next-line:max-line-length
                model.practitionerRoleName = this.sharedDataService.practitionerRoleList.filter(y => y.value === x.practitionerRole)[0] ? this.sharedDataService.practitionerRoleList.filter(y => y.value === x.practitionerRole)[0].name : '';
                // tslint:disable-next-line:max-line-length
                model.careTeamRoleName = this.sharedDataService.careTeamRoleList.filter(y => y.value === x.careTeamRole)[0] ? this.sharedDataService.careTeamRoleList.filter(y => y.value === x.careTeamRole)[0].name : '';
                return model;
            }).sort((a, b) => a.sequence - b.sequence);
        }

        if (response.visionPrescription) {
            this.FormNphiesClaim.controls.dateWritten.setValue(response.visionPrescription.dateWritten);
            this.FormNphiesClaim.controls.prescriber.setValue(response.visionPrescription.prescriber);

            if (response.visionPrescription.lensSpecifications) {
                this.VisionSpecifications = response.visionPrescription.lensSpecifications.map(x => {

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
                    // tslint:disable-next-line:max-line-length
                    model.productName = this.sharedDataService.productList.filter(y => y.value === x.product)[0] ? this.sharedDataService.productList.filter(y => y.value === x.product)[0].name : '';
                    // tslint:disable-next-line:max-line-length
                    model.lensDurationUnitName = this.sharedDataService.durationUnitList.filter(y => y.value === x.lensDurationUnit)[0] ? this.sharedDataService.durationUnitList.filter(y => y.value === x.lensDurationUnit)[0].name : '';
                    // tslint:disable-next-line:max-line-length
                    model.prismBaseName = this.sharedDataService.baseList.filter(y => y.value === x.prismBase)[0] ? this.sharedDataService.baseList.filter(y => y.value === x.prismBase)[0].name : '';
                    return model;

                }).sort((a, b) => a.sequence - b.sequence);
            }

        }


        this.Items = response.items.map(x => {
            const model: any = {};

            model.bodySite = x.bodySite;
            // tslint:disable-next-line:max-line-length
            model.bodySiteName = this.sharedDataService.getBodySite(response.preAuthorizationInfo.type).filter(y => y.value === x.bodySite)[0] ? this.sharedDataService.getBodySite(response.preAuthorizationInfo.type).filter(y => y.value === x.bodySite)[0].name : '';

            model.subSite = x.subSite;
            // tslint:disable-next-line:max-line-length
            model.subSiteName = this.sharedDataService.getSubSite(response.preAuthorizationInfo.type).filter(y => y.value === x.subSite)[0] ? this.sharedDataService.getSubSite(response.preAuthorizationInfo.type).filter(y => y.value === x.subSite)[0].name : '';
            if (x.itemDetails && x.itemDetails.length > 0) {
                x.itemDetails.forEach(y => {
                    y.typeName = this.sharedDataService.itemTypeList.filter(
                        z => z.value === y.type)[0]
                        ? this.sharedDataService.itemTypeList.filter(z => z.value === y.type)[0].name
                        : '';
                    y.itemCode = y.code;
                    y.itemDescription = y.description;
                    y.display = y.nonStandardDesc;
                });
            }
            model.itemDecision = x.itemDecision;
            model.itemDetails = x.itemDetails;
            model.sequence = x.sequence;
            model.type = x.type;
            model.itemCode = x.itemCode.toString();
            model.itemDescription = x.itemDescription;
            model.nonStandardCode = x.nonStandardCode;
            model.display = x.nonStandardDesc;
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
            model.startDateStr = moment(moment(x.startDate, 'YYYY-MM-DD')).format('DD-MM-YYYY');
            model.supportingInfoSequence = x.supportingInfoSequence;
            model.careTeamSequence = x.careTeamSequence;
            model.diagnosisSequence = x.diagnosisSequence;
            // tslint:disable-next-line:max-line-length
            model.typeName = this.sharedDataService.itemTypeList.filter(y => y.value === x.type)[0] ? this.sharedDataService.itemTypeList.filter(y => y.value === x.type)[0].name : '';

            if (x.supportingInfoSequence) {
                x.supportingInfoNames = '';
                x.supportingInfoSequence.forEach(s => {
                    let categoryValue = response.supportingInfo.filter(y => y.sequence === s)[0].category;
                    let categoryName = this.sharedDataService.categoryList.filter(x => x.value == categoryValue)[0] ? this.sharedDataService.categoryList.filter(x => x.value == categoryValue)[0].name : '';
                    x.supportingInfoNames += ', [' + categoryName + ']';
                });
                model.supportingInfoNames = x.supportingInfoNames.slice(2, x.supportingInfoNames.length);
            }

            if (x.careTeamSequence) {
                x.careTeamNames = '';
                x.careTeamSequence.forEach(s => {
                    x.careTeamNames += ', [' + response.careTeam.filter(y => y.sequence === s)[0].practitionerName + ']';
                });
                model.careTeamNames = x.careTeamNames.slice(2, x.careTeamNames.length);
            }

            if (x.diagnosisSequence) {
                x.diagnosisNames = '';
                x.diagnosisSequence.forEach(s => {
                    x.diagnosisNames += ', [' + response.diagnosis.filter(y => y.sequence === s)[0].diagnosisCode + ']';
                });
                model.diagnosisNames = x.diagnosisNames.slice(2, x.diagnosisNames.length);
            }

            // if (response.approvalResponseId) {
            //   x.isPackage = x.isPackage === true ? 1 : 2;
            // }
            return model;
        }).sort((a, b) => a.sequence - b.sequence);

        this.setBeneficiary(response);
    }

    setBeneficiary(res) {
        // tslint:disable-next-line:max-line-length
        this.providerNphiesSearchService.beneficiaryFullTextSearch(this.sharedServices.providerId, res.beneficiary.documentId).subscribe(event => {
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
                if (location.href.includes('#edit')) {
                    this.toEditMode();
                }
            }
        }, errorEvent => {
            if (errorEvent instanceof HttpErrorResponse) {

            }
            this.sharedServices.loadingChanged.next(false);
            if (location.href.includes('#edit')) {
                this.toEditMode();
            }
        });
    }

    get IsCareTeamRequired() {
        if (this.isSubmitted) {
            // tslint:disable-next-line:max-line-length
            if (!this.FormNphiesClaim.controls.type.value || (this.FormNphiesClaim.controls.type.value && this.FormNphiesClaim.controls.type.value.value !== 'pharmacy')) {
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

    openAddCommunicationDialog(commRequestId = null) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = ['primary-dialog', 'dialog-lg'];
        dialogConfig.data = {
            // tslint:disable-next-line:max-line-length
            claimResponseId: this.responseId,
            // tslint:disable-next-line:radix
            communicationRequestId: commRequestId ? parseInt(commRequestId) : ''
        };

        const dialogRef = this.dialog.open(AddCommunicationDialogComponent, dialogConfig);

        const sub = dialogRef.componentInstance.fetchCommunications.subscribe((result) => {
            if (result) {
                this.getCommunications();
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.getCommunications();
            }
        }, error => { });
    }

    getCommunications() {
        // this.sharedServices.loadingChanged.next(true);
        // tslint:disable-next-line:max-line-length
        this.providerNphiesSearchService.getCommunications(this.sharedServices.providerId, this.responseId).subscribe((event: any) => {
            if (event instanceof HttpResponse) {
                this.communications = event.body.communicationList;
                // this.sharedServices.loadingChanged.next(false);
            }
        }, err => {
            this.sharedServices.loadingChanged.next(false);
            console.log(err);
        });
    }

    getFilename(str) {
        if (str.indexOf('pdf') > -1) {
            return 'pdf';
        } else {
            return 'image';
        }
    }

    close() {
        this.location.back();
    }

    viewAttachment(e, item) {
        e.preventDefault();
        this.dialog.open<AttachmentViewDialogComponent, AttachmentViewData, any>(AttachmentViewDialogComponent, {
            data: {
                filename: item.attachmentName, attachment: item.byteArray
            }, panelClass: ['primary-dialog', 'dialog-xl']
        });
    }

    get claimIsEditable() {
        return this.otherDataModel != null && this.otherDataModel.status != null && ['accepted', 'notaccepted', 'error', 'failed'].includes(this.otherDataModel.status.trim().toLowerCase());
    }

}
