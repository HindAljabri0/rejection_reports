import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
import { PbmPrescriptionService } from 'src/app/services/pbm-prescription-service/PbmPrescriptionService.service';
import { ConfirmationAlertDialogComponent } from 'src/app/components/confirmation-alert-dialog/confirmation-alert-dialog.component';
// tslint:disable-next-line:max-line-length
import { AddEditVisionLensSpecificationsComponent } from './add-edit-vision-lens-specifications/add-edit-vision-lens-specifications.component';
import * as moment from 'moment';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { nationalities } from 'src/app/claim-module-components/store/claim.reducer';
import { ReplaySubject, Subject } from 'rxjs';
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';
import { AddEditItemDetailsModalComponent } from '../add-edit-item-details-modal/add-edit-item-details-modal.component';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { AttachmentViewDialogComponent } from 'src/app/components/dialogs/attachment-view-dialog/attachment-view-dialog.component';
import { AttachmentViewData } from 'src/app/components/dialogs/attachment-view-dialog/attachment-view-data';
import { DomSanitizer } from '@angular/platform-browser';
import { SuperAdminService } from 'src/app/services/administration/superAdminService/super-admin.service';
import { takeUntil } from 'rxjs/operators';
import { DbMappingService } from 'src/app/services/administration/dbMappingService/db-mapping.service';
import { PbmValidationResponseSummaryDialogComponent } from 'src/app/components/dialogs/pbm-validation-response-summary-dialog/pbm-validation-response-summary-dialog.component';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { MreValidationResponseSummaryDialogComponent } from 'src/app/components/dialogs/mre-validation-response-summary-dialog/mre-validation-response-summary-dialog.component';
import { PrescriptionDispenseDialogComponent } from 'src/app/components/dialogs/prescription-dispense-dialog/prescription-dispense-dialog.component';


@Component({
    selector: 'app-add-preauthorization',
    templateUrl: './add-preauthorization.component.html',
    styles: []
})
export class AddPreauthorizationComponent implements OnInit {

    @Input() claimReuseId: number;
    @Input() data: any;
    @Output() closeEvent = new EventEmitter();

    filteredProviderList: ReplaySubject<any> = new ReplaySubject<any[]>(1);
    onDestroy = new Subject<void>();
    IsRefferalProviderLoading = false;
    IsOtherReferral = false;

    paymentAmount = 0;
    beneficiarySearchController = new FormControl();
    subscriberSearchController = new FormControl();

    beneficiariesSearchResult: BeneficiariesSearchResult[] = [];
    subscriberSearchResult: BeneficiariesSearchResult[] = [];

    selectedBeneficiary: BeneficiariesSearchResult;
    selectedSubscriber: BeneficiariesSearchResult;

    selectedPlanId: string;
    selectedPlanIdError: string;
    IsSubscriberRequired = false;
    IsAccident = false;
    isDispenseInquiry = false;
    isOnline: boolean = false;
    isOffline: boolean = false;
    AllTPA: any[] = [];
    primaryPlan=[];
    filteredNations: ReplaySubject<{ Code: string, Name: string }[]> = new ReplaySubject<{ Code: string, Name: string }[]>(1);

    beneficiaryPatientShare = 0;
    beneficiaryMaxLimit = 0;

    PrescriberDefault = '';

    FormPreAuthorization: FormGroup = this.formBuilder.group({
        beneficiaryName: ['', Validators.required],
        beneficiaryId: ['', Validators.required],
        insurancePlanId: ['', Validators.required],
        dateOrdered: ['', Validators.required],
        payee: ['', Validators.required],
        payeeType: ['', Validators.required],
        type: ['', Validators.required],
        subType: [''],
        preAuthRefNo: [''],
        prescription: ['', Validators.required],
        accidentType: [''],
        streetName: [''],
        city: [''],
        state: [''],
        country: [''],
        countryName: [''],
        date: [''],
        dateWritten: [''],
        prescriber: [''],
        eligibilityType: [''],
        eligibilityOfflineDate: [''],
        eligibilityOfflineId: [''],
        eligibilityResponseId: [''],
        eligibilityResponseUrl: [''],

        firstName: [''],
        middleName: [''],
        lastName: [''],
        familyName: [''],
        fullName: ['', Validators.required],
        beneficiaryFileld: [''],
        dob: ['', Validators.required],
        gender: ['', Validators.required],
        documentType: ['', Validators.required],
        documentId: ['', Validators.required],
        eHealthId: [''],
        nationality: [''],
        nationalityName: [''],
        residencyType: [''],
        contactNumber: [''],
        martialStatus: [''],
        bloodGroup: [''],
        preferredLanguage: [''],
        emergencyNumber: [''],
        email: [''],
        addressLine: [''],
        streetLine: [''],
        bcity: [''],
        bstate: [''],
        bcountry: [''],
        bcountryName: [''],
        postalCode: [''],
        insurancePlanPayerId: [''],
        insurancePlanExpiryDate: [''],
        insurancePlanMemberCardId: [''],
        insurancePlanRelationWithSubscriber: [''],
        insurancePlanCoverageType: [''],
        insurancePlanPayerName: [''],
        insurancePlanPrimary: [''],
        insurancePayerNphiesId: [''],
        insurancePlanTpaNphiesId: [],
        isNewBorn: [false],
        transfer: [false],
        subscriberName: [''],
        referral: [''],
        referralFilter: [''],
        otherReferral: [''],
        insurancePlanPolicyNumber: [''],
        insurancePlanMaxLimit: [''],
        insurancePlanPatientShare: [''],
    });

    FormSubscriber: FormGroup = this.formBuilder.group({
        beneficiaryName: ['', Validators.required],
        beneficiaryId: ['', Validators.required],
        firstName: [''],
        middleName: [''],
        lastName: [''],
        familyName: [''],
        fullName: ['', Validators.required],
        beneficiaryFileld: [''],
        dob: ['', Validators.required],
        gender: ['', Validators.required],
        documentType: ['', Validators.required],
        documentId: ['', Validators.required],
        eHealthId: [''],
        nationality: [''],
        nationalityName: [''],
        residencyType: [''],
        contactNumber: [''],
        martialStatus: [''],
        bloodGroup: [''],
        preferredLanguage: [''],
        emergencyNumber: [''],
        email: [''],
        addressLine: [''],
        streetLine: [''],
        bcity: [''],
        bstate: [''],
        bcountry: [''],
        bcountryName: [''],
        postalCode: ['']
    });

    typeList = this.sharedDataService.claimTypeList;
    payeeTypeList = this.sharedDataService.payeeTypeList;
    payeeList = [];
    providerList = [];
    subTypeList = [];

    accidentTypeList = this.sharedDataService.accidentTypeList;

    VisionSpecifications = [];
    SupportingInfo = [];
    CareTeams = [];
    Diagnosises = [];
    Items = [];

    model: any = {};
    detailsModel: any = {};

    DispinseInqueryModel: any = {};


    isSubmitted = false;
    IsLensSpecificationRequired = false;
    IsDiagnosisRequired = false;
    // IsCareTeamRequired = false;
    IsItemRequired = false;
    IsDateWrittenRequired = false;
    IsPrescriberRequired = false;
    IsDispenceInqury = false;

    IsDateRequired = false;
    IsAccidentTypeRequired = false;
    IsJSONPosted = false;

    today: Date;
    nationalities = nationalities;
    selectedCountry = '';
    currentOpenItem: number = null;
    claimType: string;
    defualtPageMode = "";
    selectedDefaultPlan = null;
    providerType = "";
    isPBMValidationVisible = false;
    isMREValidationVisible = false;
    Pbm_result: any;
    Mre_result: any;
    DispenseQueryResult: any;

    constructor(
        private sharedDataService: SharedDataService,
        private dialogService: DialogService,
        private sanitizer: DomSanitizer,
        private dialog: MatDialog,
        private formBuilder: FormBuilder,
        private sharedServices: SharedServices,
        private datePipe: DatePipe,
        private providerNphiesSearchService: ProviderNphiesSearchService,
        private superAdminService: SuperAdminService,
        private adminService: AdminService,
        private providersBeneficiariesService: ProvidersBeneficiariesService,
        private providerNphiesApprovalService: ProviderNphiesApprovalService,
        private dbMapping: DbMappingService,
        private pbmPrescriptionService : PbmPrescriptionService
    ) {

        this.today = new Date();
    }

    ngOnInit() {

        this.FormPreAuthorization.get('eligibilityType').valueChanges.subscribe(value => {
            this.isOnline = value === 'online';
            this.isOffline = value === 'offline';
        });
        this.getPayees();
        this.getTPA();
        this.getPBMValidation();
        this.getMREValidation();
        this.FormPreAuthorization.controls.dateOrdered.setValue(this.removeSecondsFromDate(new Date()));
        this.filteredNations.next(this.nationalities.slice());
        if (this.claimReuseId) {
            this.FormPreAuthorization.controls.transfer.setValue(this.data.transfer)
            this.getRefferalProviders();
            this.defualtPageMode = "";
        } else {
            this.getRefferalProviders();
            this.defualtPageMode = "CREATE"
        }
        this.getProviderTypeConfiguration();

    }
    getPBMValidation() {
        this.adminService.checkIfNphiesApprovalPBMValidationIsEnabled(this.sharedServices.providerId, '101').subscribe((event: any) => {
            if (event instanceof HttpResponse) {
                const body = event['body'];
                this.isPBMValidationVisible = body.value === '1' ? true : false;
            }
        }, err => {
            console.log(err);
        });

    }

    getMREValidation() {
        this.adminService.checkIfNphiesApprovalMREValidationIsEnabled(this.sharedServices.providerId, '101').subscribe((event: any) => {
            if (event instanceof HttpResponse) {
                const body = event['body'];
                this.isMREValidationVisible = body.value === '1' ? true : false;
            }
        }, err => {
            console.log(err);

        });

    }
    selectedDefualtPrescriberChange($event) {
        this.PrescriberDefault = $event;
        console.log("$event = " + $event);
    }
    setReuseValues() {

        this.FormPreAuthorization.controls.isNewBorn.setValue(this.data.isNewBorn);
        if (this.data.transferAuthProvider) {
            if (this.providerList.filter(x => x.name === this.data.transferAuthProvider).length > 0) {
                // tslint:disable-next-line:max-line-length
                this.FormPreAuthorization.controls.referral.setValue(this.providerList.filter(x => x.name === this.data.transferAuthProvider)[0]);
                this.IsOtherReferral = false;
            } else {
                this.FormPreAuthorization.controls.referral.setValue('-1');
                this.FormPreAuthorization.controls.otherReferral.setValue(this.data.transferAuthProvider);
                this.IsOtherReferral = true;
            }
        }

        if (this.data.preAuthDetails) {
            if (this.data.preAuthDetails.filter(x => x === null).length === 0) {
                const preAuthValue = this.data.preAuthDetails.map(x => {
                    const model: any = {};
                    model.display = x;
                    model.value = x;
                    return model;
                });
                this.FormPreAuthorization.controls.preAuthRefNo.setValue(preAuthValue);
            }
        }

        const date = this.data.preAuthorizationInfo.dateOrdered;
        // tslint:disable-next-line:max-line-length\
        this.FormPreAuthorization.controls.dateOrdered.setValue(this.removeSecondsFromDate(date));
        if (this.data.preAuthorizationInfo.payeeType) {
            // tslint:disable-next-line:max-line-length
            this.FormPreAuthorization.controls.payeeType.setValue(this.sharedDataService.payeeTypeList.filter(x => x.value === this.data.preAuthorizationInfo.payeeType)[0] ? this.sharedDataService.payeeTypeList.filter(x => x.value === this.data.preAuthorizationInfo.payeeType)[0] : '');
            // tslint:disable-next-line:max-line-length
            this.FormPreAuthorization.controls.payee.setValue(this.payeeList.filter(x => x.nphiesId === this.data.preAuthorizationInfo.payeeId)[0] ? this.payeeList.filter(x => x.nphiesId === this.data.preAuthorizationInfo.payeeId)[0].nphiesId : '');
        }
        this.claimType = this.data.preAuthorizationInfo.type;
        // tslint:disable-next-line:max-line-length
        this.FormPreAuthorization.controls.type.setValue(this.sharedDataService.claimTypeList.filter(x => x.value === this.data.preAuthorizationInfo.type)[0] ? this.sharedDataService.claimTypeList.filter(x => x.value === this.data.preAuthorizationInfo.type)[0] : '');
        switch (this.data.preAuthorizationInfo.type) {
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
        if (this.data.preAuthorizationInfo.subType != null) {
            // tslint:disable-next-line:max-line-length
            this.FormPreAuthorization.controls.subType.setValue(this.sharedDataService.subTypeList.filter(x => x.value === this.data.preAuthorizationInfo.subType)[0] ? this.sharedDataService.subTypeList.filter(x => x.value === this.data.preAuthorizationInfo.subType)[0] : '');
        }
        if (this.data.preAuthorizationInfo.eligibilityOfflineId != null) {
            // tslint:disable-next-line:max-line-length
            this.FormPreAuthorization.controls.eligibilityOfflineId.setValue(this.data.preAuthorizationInfo.eligibilityOfflineId);
        }
        if (this.data.preAuthorizationInfo.eligibilityOfflineDate != null) {
            // tslint:disable-next-line:max-line-length
            this.FormPreAuthorization.controls.eligibilityOfflineDate.setValue(this.data.preAuthorizationInfo.eligibilityOfflineDate);
        }
        if (this.data.preAuthorizationInfo.eligibilityResponseId != null) {
            // tslint:disable-next-line:max-line-length
            this.FormPreAuthorization.controls.eligibilityResponseId.setValue(this.data.preAuthorizationInfo.eligibilityResponseId);
        }
        if (this.data.preAuthorizationInfo.eligibilityResponseUrl != null) {
            this.FormPreAuthorization.controls.eligibilityResponseUrl.setValue(this.data.preAuthorizationInfo.eligibilityResponseUrl);
        }
        if (this.data.accident) {
            if (this.data.accident.accidentType) {
                // tslint:disable-next-line:max-line-length
                this.FormPreAuthorization.controls.accidentType.setValue(this.sharedDataService.accidentTypeList.filter(x => x.value === this.data.accident.accidentType)[0]);
            }
            if (this.data.accident.streetName) {
                this.FormPreAuthorization.controls.streetName.setValue(this.data.accident.streetName);
            }
            if (this.data.accident.city) {
                this.FormPreAuthorization.controls.city.setValue(this.data.accident.city);
            }
            if (this.data.accident.state) {
                this.FormPreAuthorization.controls.state.setValue(this.data.accident.state);
            }
            if (this.data.accident.country) {
                this.FormPreAuthorization.controls.country.setValue(this.data.accident.country);
            }
            // this.FormPreAuthorization.controls.countryName.setValue(this.data.beneficiary.beneficiaryName);
            if (this.data.accident.date) {
                this.FormPreAuthorization.controls.date.setValue(this.data.accident.date);
            }
        }
        this.Diagnosises = this.data.diagnosis;
        this.SupportingInfo = this.data.supportingInfo;
        //this.CareTeams = this.data.careTeam;
        if (this.data.careTeam) {
            this.CareTeams = this.data.careTeam.map(x => {
                const model: any = {};
                model.sequence = x.sequence;
                model.practitionerName = x.practitionerName;
                model.physicianCode = x.physicianCode;
                model.practitionerRole = x.practitionerRole;
                model.careTeamRole = x.careTeamRole;
                model.speciality = x.speciality;
                model.specialityCode = x.specialityCode;
                model.qualificationCode = x.specialityCode;
                model.practitionerRoleSelect = this.sharedDataService.practitionerRoleList.filter(role => role.value === x.practitionerRole)[0];
                model.careTeamRoleSelect = this.sharedDataService.careTeamRoleList.filter(role => role.value === x.careTeamRole)[0];
                model.specialitySelect = x.specialityCode;
                //console.log("Return Specialty = " + JSON.stringify(model.specialitySelect));
                // tslint:disable-next-line:max-line-length
                model.practitionerRoleName = this.sharedDataService.practitionerRoleList.filter(y => y.value === x.practitionerRole)[0] ? this.sharedDataService.practitionerRoleList.filter(y => y.value === x.practitionerRole)[0].name : '';
                // tslint:disable-next-line:max-line-length
                model.careTeamRoleName = this.sharedDataService.careTeamRoleList.filter(y => y.value === x.careTeamRole)[0] ? this.sharedDataService.careTeamRoleList.filter(y => y.value === x.careTeamRole)[0].name : '';
                return model;
            }).sort((a, b) => a.sequence - b.sequence);
        }
        if (this.data.visionPrescription && this.data.visionPrescription.lensSpecifications) {
            const date = this.data.visionPrescription.dateWritten;
            // tslint:disable-next-line:max-line-length
            this.FormPreAuthorization.controls.dateWritten.setValue(this.removeSecondsFromDate(date));
            //this.FormPreAuthorization.controls.dateWritten.setValue(new Date(this.data.visionPrescription.dateWritten));
            this.FormPreAuthorization.controls.prescriber.setValue(this.data.visionPrescription.prescriber);
            this.VisionSpecifications = this.ChangeVisiontoView(this.data.visionPrescription.lensSpecifications);//this.data.visionPrescription.lensSpecifications;
        }

        this.Items = this.data.items;

        this.setBeneficiary(this.data);
    }
    ChangeVisiontoView(lensSpecifications) {

        lensSpecifications = lensSpecifications.sort((a, b) => a.sequence - b.sequence);
        if (lensSpecifications) {
            let leftList = lensSpecifications.filter(f => f.eye == 'left');
            let rightList = lensSpecifications.filter(f => f.eye == 'right');
            let SequenceList = rightList.map(x => x.sequence);
            //console.log("Left List - > "+JSON.stringify(leftList));
            //console.log("Right List - > "+JSON.stringify(rightList));
            for (var i = 0; i < leftList.length; i++) {

                let row = rightList.filter(f => f.product == leftList[i].product && f.sequence == SequenceList[i])[0];
                row = row == null ? {} : row;
                //console.log("Row = " + JSON.stringify(row));
                let result = leftList[i];

                if (result != null) {
                    //console.log("result = " + JSON.stringify(result));
                    row.left_sphere = result.sphere;
                    row.left_cylinder = result.cylinder;
                    row.left_axis = result.axis;
                    row.left_prismAmount = result.prismAmount;
                    row.left_prismBase = result.prismBase;
                    row.left_multifocalPower = result.multifocalPower;
                    row.left_lensPower = result.lensPower;
                    row.left_lensBackCurve = result.lensBackCurve;
                    row.left_lensDiameter = result.lensDiameter;
                    row.left_lensDuration = result.lensDuration;
                    row.left_lensDurationUnit = result.lensDurationUnit;
                    row.left_lensDurationUnitName = result.lensDurationUnitName;
                    row.left_prismBaseName = result.prismBaseName;
                }
                //console.log("Row after adding left= " + JSON.stringify(row));
            }
            return rightList;
        }
    }
    setBeneficiary(res) {
        // tslint:disable-next-line:max-line-length
        this.providerNphiesSearchService.beneficiaryFullTextSearch(this.sharedServices.providerId, res.beneficiary.documentId).subscribe(event => {
            if (event instanceof HttpResponse) {
                const body = event.body;
                if (body instanceof Array) {
                    this.beneficiariesSearchResult = body;
                    this.selectedBeneficiary = body.filter(x => x.documentType === res.beneficiary.documentType && x.documentId === res.beneficiary.documentId)[0] ? body.filter(x => x.documentType === res.beneficiary.documentType && x.documentId === res.beneficiary.documentId)[0] : null;
                    this.FormPreAuthorization.patchValue({
                        beneficiaryName: res.beneficiary.beneficiaryName + ' (' + res.beneficiary.documentId + ')',
                        beneficiaryId: res.beneficiary.beneficiaryId,
                        dob: res.beneficiary.dob,
                        documentId: res.beneficiary.documentId,
                        documentType: res.beneficiary.documentType,
                        fullName: res.beneficiary.fullName,
                        gender: res.beneficiary.gender,
                        insurancePlanMemberCardId: res.beneficiary.insurancePlan.memberCardId,
                        insurancePlanPolicyNumber: res.beneficiary.insurancePlan.policyNumber,
                        insurancePlanCoverageType: res.beneficiary.insurancePlan.coverageType,
                        insurancePayerNphiesId: res.beneficiary.insurancePlan.payerId,
                        insurancePlanPayerId: res.beneficiary.insurancePlan.payerId,
                        insurancePlanRelationWithSubscriber: res.beneficiary.insurancePlan.relationWithSubscriber,
                        insurancePlanExpiryDate: res.beneficiary.insurancePlan.expiryDate,
                        insurancePlanPrimary: res.beneficiary.insurancePlan.primary,
                        // tslint:disable-next-line:max-line-length
                        insurancePlanPayerName: this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === res.beneficiary.insurancePlan.payerId)[0] ? this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === res.beneficiary.insurancePlan.payerId)[0].payerName : '',

                        // tslint:disable-next-line:max-line-length
                        // insurancePlanTpaNphiesId: this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === res.beneficiary.insurancePlan.payerId)[0] ? (this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === res.beneficiary.insurancePlan.payerId)[0].tpaNphiesId === '-1' ? null : this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === res.beneficiary.insurancePlan.payerId)[0].tpaNphiesId) : null
                        insurancePlanTpaNphiesId: res.beneficiary.insurancePlan.tpaNphiesId,
                        insurancePlanMaxLimit: res.beneficiary.insurancePlan.maxLimit,
                        insurancePlanPatientShare: res.beneficiary.insurancePlan.patientShare,
                    });

                    if (res.subscriber) {

                        this.FormPreAuthorization.patchValue({
                            subscriberName: res.subscriber.beneficiaryName + ' (' + res.subscriber.documentId + ')'
                        });
                        // tslint:disable-next-line:max-line-length

                        this.FormSubscriber.controls.firstName.setValue(res.subscriber.firstName);
                        this.FormSubscriber.controls.middleName.setValue(res.subscriber.secondName);
                        this.FormSubscriber.controls.lastName.setValue(res.subscriber.thirdName);
                        this.FormSubscriber.controls.familyName.setValue(res.subscriber.familyName);
                        this.FormSubscriber.controls.fullName.setValue(res.subscriber.fullName);
                        this.FormSubscriber.controls.beneficiaryFileld.setValue(res.subscriber.fileId);
                        this.FormSubscriber.controls.dob.setValue(res.subscriber.dob);
                        this.FormSubscriber.controls.gender.setValue(res.subscriber.gender);
                        this.FormSubscriber.controls.documentType.setValue(res.subscriber.documentType);
                        this.FormSubscriber.controls.documentId.setValue(res.subscriber.documentId);
                        this.FormSubscriber.controls.eHealthId.setValue(res.subscriber.eHealthId);
                        this.FormSubscriber.controls.nationality.setValue(res.subscriber.nationality);
                        // tslint:disable-next-line:max-line-length
                        this.FormSubscriber.controls.nationalityName.setValue(nationalities.filter(x => x.Code === res.subscriber.nationality)[0] ? nationalities.filter(x => x.Code === res.subscriber.nationality)[0].Name : '');
                        this.FormSubscriber.controls.residencyType.setValue(res.subscriber.residencyType);
                        this.FormSubscriber.controls.contactNumber.setValue(res.subscriber.contactNumber);
                        this.FormSubscriber.controls.martialStatus.setValue(res.subscriber.maritalStatus);
                        this.FormSubscriber.controls.bloodGroup.setValue(res.subscriber.bloodGroup);
                        this.FormSubscriber.controls.preferredLanguage.setValue(res.subscriber.preferredLanguage);
                        this.FormSubscriber.controls.emergencyNumber.setValue(res.subscriber.emergencyPhoneNumber);
                        this.FormSubscriber.controls.email.setValue(res.subscriber.email);
                        this.FormSubscriber.controls.addressLine.setValue(res.subscriber.addressLine);
                        this.FormSubscriber.controls.streetLine.setValue(res.subscriber.streetLine);
                        this.FormSubscriber.controls.bcity.setValue(res.subscriber.city);
                        this.FormSubscriber.controls.bstate.setValue(res.subscriber.state);
                        this.FormSubscriber.controls.bcountry.setValue(res.subscriber.country);
                        if (res.subscriber.country) {
                            // tslint:disable-next-line:max-line-length
                            this.FormSubscriber.controls.bcountryName.setValue(this.nationalities.filter(x => x.Name.toLowerCase() === res.subscriber.country.toLowerCase())[0] ? this.nationalities.filter(x => x.Name.toLowerCase() == res.subscriber.country.toLowerCase())[0].Name : '');
                        }
                        this.FormSubscriber.controls.postalCode.setValue(res.subscriber.postalCode);
                    }

                    if (res.beneficiary && res.beneficiary.insurancePlan && res.beneficiary.insurancePlan.payerId) {
                        this.FormPreAuthorization.controls.insurancePlanId.setValue(res.beneficiary.insurancePlan.payerId.toString());
                    }

                    if (this.claimReuseId) {
                        this.FormPreAuthorization.controls.beneficiaryName.disable();
                        this.FormPreAuthorization.controls.beneficiaryId.disable();
                        this.FormPreAuthorization.controls.insurancePlanId.disable();
                        this.FormPreAuthorization.controls.type.disable();
                        this.FormPreAuthorization.controls.subType.disable();
                        this.FormPreAuthorization.controls.payee.disable();
                        this.FormPreAuthorization.controls.payeeType.disable();
                        this.FormPreAuthorization.controls.accidentType.disable();
                        this.FormPreAuthorization.controls.streetName.disable();
                        this.FormPreAuthorization.controls.city.disable();
                        this.FormPreAuthorization.controls.state.disable();
                        this.FormPreAuthorization.controls.country.disable();
                        this.FormPreAuthorization.controls.countryName.disable();
                        this.FormPreAuthorization.controls.date.disable();
                    }
                }

                // this.disableFields();
                this.sharedServices.loadingChanged.next(false);
            }
        }, errorEvent => {
            if (errorEvent instanceof HttpErrorResponse) {

            }
            this.sharedServices.loadingChanged.next(false);
        });
    }

    disableFields() {
        this.FormPreAuthorization.controls.beneficiaryName.disable();
        this.FormPreAuthorization.controls.beneficiaryId.disable();
        this.FormPreAuthorization.controls.insurancePlanId.disable();
        this.FormPreAuthorization.controls.dateOrdered.disable();
        this.FormPreAuthorization.controls.payee.disable();
        this.FormPreAuthorization.controls.payeeType.disable();
        this.FormPreAuthorization.controls.type.disable();
        this.FormPreAuthorization.controls.subType.disable();
        this.FormPreAuthorization.controls.accidentType.disable();
        this.FormPreAuthorization.controls.streetName.disable();
        this.FormPreAuthorization.controls.city.disable();
        this.FormPreAuthorization.controls.state.disable();
        this.FormPreAuthorization.controls.country.disable();
        this.FormPreAuthorization.controls.countryName.disable();
        this.FormPreAuthorization.controls.date.disable();
        this.FormPreAuthorization.controls.dateWritten.disable();
        this.FormPreAuthorization.controls.prescriber.disable();
        this.FormPreAuthorization.controls.eligibilityOfflineDate.disable();
        this.FormPreAuthorization.controls.eligibilityOfflineId.disable();
        this.FormPreAuthorization.controls.eligibilityResponseId.disable();
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
                console.log('Error');
                this.sharedServices.loadingChanged.next(false);
            }
        });
    }

    getRefferalProviders() {
        this.sharedServices.loadingChanged.next(true);
        this.IsRefferalProviderLoading = true;
        this.FormPreAuthorization.controls.referral.disable();
        this.superAdminService.getProviders().subscribe(event => {
            if (event instanceof HttpResponse) {
                if (event.body != null && event.body instanceof Array) {
                    this.providerList = event.body;
                }
                if (this.claimReuseId) {
                    this.setReuseValues();
                }
                this.filteredProviderList.next(this.providerList.slice());
                this.IsRefferalProviderLoading = false;
                this.FormPreAuthorization.controls.referral.enable();
                this.FormPreAuthorization.controls.referralFilter.valueChanges
                    .pipe(takeUntil(this.onDestroy))
                    .subscribe(() => {
                        this.filterRefferalProviders();
                    });
                this.sharedServices.loadingChanged.next(false);
            }
        }, err => {
            if (err instanceof HttpErrorResponse) {
                console.log('Error getting referrals');
                this.sharedServices.loadingChanged.next(false);
            }
        });
    }

    filterRefferalProviders() {
        if (!this.providerList) {
            return;
        }
        // get the search keyword
        let search = this.FormPreAuthorization.controls.referralFilter.value;
        if (!search) {
            this.filteredProviderList.next(this.providerList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the nations
        this.filteredProviderList.next(
            // tslint:disable-next-line:max-line-length
            this.providerList.filter(item => item.name.toLowerCase().indexOf(search) > -1 || item.code.toString().toLowerCase().indexOf(search) > -1 || item.switchAccountId.toString().toLowerCase().indexOf(search) > -1)
        );
    }

    referralChange($event) {
        if ($event.value === '-1') {
            this.IsOtherReferral = true;
        } else {
            this.IsOtherReferral = false;
            this.FormPreAuthorization.controls.otherReferral.setValue('');
        }
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
            this.claimType = $event.value.value;
            this.FormPreAuthorization.controls.subType.setValue('');

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
            // this.Diagnosises = [];
        }
    }

    searchBeneficiaries(IsSubscriber = null) {
        let searchStr = '';
        if (!IsSubscriber) {
            searchStr = this.FormPreAuthorization.controls.beneficiaryName.value;
        } else {
            searchStr = this.FormPreAuthorization.controls.subscriberName.value;
        }
        // tslint:disable-next-line:max-line-length
        if (searchStr.length > 3) {
            this.providerNphiesSearchService.beneficiaryFullTextSearch(this.sharedServices.providerId, searchStr).subscribe(event => {
                if (event instanceof HttpResponse) {
                    const body = event.body;
                    if (body instanceof Array) {
                        if (!IsSubscriber) {
                            this.beneficiariesSearchResult = body;
                        } else {
                            this.subscriberSearchResult = body;
                        }
                    }
                }
            }, errorEvent => {
                if (errorEvent instanceof HttpErrorResponse) {

                }
            });
        }
    }

    selectBeneficiary(beneficiary: BeneficiariesSearchResult) {
        this.selectedBeneficiary = beneficiary;



        this.FormPreAuthorization.patchValue({
            beneficiaryName: beneficiary.name + ' (' + beneficiary.documentId + ')',
            beneficiaryId: beneficiary.id,
            firstName: beneficiary.firstName ? beneficiary.firstName : '',
            middleName: beneficiary.secondName ? beneficiary.secondName : '',
            lastName: beneficiary.thirdName ? beneficiary.thirdName : '',
            familyName: beneficiary.familyName ? beneficiary.familyName : '',
            fullName: beneficiary.fullName ? beneficiary.fullName : '',
            beneficiaryFileld: beneficiary.fileId ? beneficiary.fileId : '',
            dob: beneficiary.dob ? beneficiary.dob : '',
            gender: beneficiary.gender ? beneficiary.gender : '',
            documentType: beneficiary.documentType ? beneficiary.documentType : '',
            documentId: beneficiary.documentId ? beneficiary.documentId : '',
            eHealthId: beneficiary.eHealthId ? beneficiary.eHealthId : '',
            nationality: beneficiary.nationality ? beneficiary.nationality : '',
            // tslint:disable-next-line:max-line-length
            nationalityName: beneficiary.nationality ? (this.nationalities.filter(x => x.Code === beneficiary.nationality)[0] ? this.nationalities.filter(x => x.Code === beneficiary.nationality)[0].Name : '') : '',
            residencyType: beneficiary.residencyType ? beneficiary.residencyType : '',
            contactNumber: beneficiary.contactNumber ? beneficiary.contactNumber : '',
            martialStatus: beneficiary.maritalStatus ? beneficiary.maritalStatus : '',
            bloodGroup: beneficiary.bloodGroup ? beneficiary.bloodGroup : '',
            preferredLanguage: beneficiary.preferredLanguage ? beneficiary.preferredLanguage : '',
            emergencyNumber: beneficiary.emergencyPhoneNumber ? beneficiary.emergencyPhoneNumber : '',
            email: beneficiary.email ? beneficiary.email : '',
            addressLine: beneficiary.addressLine ? beneficiary.addressLine : '',
            streetLine: beneficiary.streetLine ? beneficiary.streetLine : '',
            bcity: beneficiary.city ? beneficiary.city : '',
            bstate: beneficiary.state ? beneficiary.state : '',
            bcountry: beneficiary.country ? beneficiary.country : '',
            // tslint:disable-next-line:max-line-length
            bcountryName: beneficiary.country ? (this.nationalities.filter(x => x.Name.toLowerCase() === beneficiary.country.toLowerCase())[0] ? this.nationalities.filter(x => x.Name.toLowerCase() == beneficiary.country.toLowerCase())[0].Name : '') : '',
            postalCode: beneficiary.postalCode ? beneficiary.postalCode : '',
        });

        this.primaryPlan = beneficiary.plans.filter(plan => plan.primary==true);
        if (beneficiary.plans.filter(x => x.primary)[0].payerNphiesId === '0000000163') {

            this.dialogService.showMessage('Error', 'Selected Payer is not valid for Pre-Auth Request Transaction ', 'alert', true, 'OK');
            return;
        }

        if (beneficiary.plans.length > 0 && beneficiary.plans.filter(x => x.primary)[0]) {
            this.FormPreAuthorization.controls.insurancePlanId.setValue(beneficiary.plans.filter(x => x.primary)[0].payerNphiesId);
            const plan: any = {};
            plan.value = this.selectedBeneficiary.plans.filter(x => x.primary)[0].payerNphiesId;
            plan.memberCardId = this.selectedBeneficiary.plans.filter(x => x.primary)[0].memberCardId;
            this.selectPlan(plan);
        }

    }

    selectSubscriber(beneficiary: BeneficiariesSearchResult) {
        this.selectedSubscriber = beneficiary;
        this.FormPreAuthorization.controls.subscriberName.setValue(beneficiary.name + ' (' + beneficiary.documentId + ')');
        this.FormSubscriber.patchValue({
            beneficiaryName: beneficiary.name + ' (' + beneficiary.documentId + ')',
            beneficiaryId: beneficiary.id,
            firstName: beneficiary.firstName ? beneficiary.firstName : '',
            middleName: beneficiary.secondName ? beneficiary.secondName : '',
            lastName: beneficiary.thirdName ? beneficiary.thirdName : '',
            familyName: beneficiary.familyName ? beneficiary.familyName : '',
            fullName: beneficiary.fullName ? beneficiary.fullName : '',
            beneficiaryFileld: beneficiary.fileId ? beneficiary.fileId : '',
            dob: beneficiary.dob ? beneficiary.dob : '',
            gender: beneficiary.gender ? beneficiary.gender : '',
            documentType: beneficiary.documentType ? beneficiary.documentType : '',
            documentId: beneficiary.documentId ? beneficiary.documentId : '',
            eHealthId: beneficiary.eHealthId ? beneficiary.eHealthId : '',
            nationality: beneficiary.nationality ? beneficiary.nationality : '',
            // tslint:disable-next-line:max-line-length
            nationalityName: beneficiary.nationality ? (this.nationalities.filter(x => x.Code === beneficiary.nationality)[0] ? this.nationalities.filter(x => x.Code === beneficiary.nationality)[0].Name : '') : '',
            residencyType: beneficiary.residencyType ? beneficiary.residencyType : '',
            contactNumber: beneficiary.contactNumber ? beneficiary.contactNumber : '',
            martialStatus: beneficiary.maritalStatus ? beneficiary.maritalStatus : '',
            bloodGroup: beneficiary.bloodGroup ? beneficiary.bloodGroup : '',
            preferredLanguage: beneficiary.preferredLanguage ? beneficiary.preferredLanguage : '',
            emergencyNumber: beneficiary.emergencyPhoneNumber ? beneficiary.emergencyPhoneNumber : '',
            email: beneficiary.email ? beneficiary.email : '',
            addressLine: beneficiary.addressLine ? beneficiary.addressLine : '',
            streetLine: beneficiary.streetLine ? beneficiary.streetLine : '',
            bcity: beneficiary.city ? beneficiary.city : '',
            bstate: beneficiary.state ? beneficiary.state : '',
            bcountry: beneficiary.country ? beneficiary.country : '',
            // tslint:disable-next-line:max-line-length
            bcountryName: beneficiary.country ? (this.nationalities.filter(x => x.Name.toLowerCase() === beneficiary.country.toLowerCase())[0] ? this.nationalities.filter(x => x.Name.toLowerCase() == beneficiary.country.toLowerCase())[0].Name : '') : '',
            postalCode: beneficiary.postalCode ? beneficiary.postalCode : '',
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

    selectedPlan(planObj) {
        const plan: any = {};
        plan.value = planObj.payerNphiesId;
        plan.memberCardId = planObj.memberCardId;
        if (planObj.payerNphiesId === '0000000163') {

            this.dialogService.showMessage('Error', 'Selected Payer is not valid for Pre-Auth Request Transaction ', 'alert', true, 'OK');
            return;
        }
        this.selectPlan(plan);

    }

    selectPlan(plan) {
        if (this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value && x.memberCardId === plan.memberCardId)[0]) {

            this.beneficiaryPatientShare = this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value && x.memberCardId === plan.memberCardId)[0].patientShare;
            this.beneficiaryMaxLimit = this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value && x.memberCardId === plan.memberCardId)[0].maxLimit;

            this.FormPreAuthorization.controls.insurancePlanPayerId.setValue(
                this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value && x.memberCardId === plan.memberCardId)[0].payerNphiesId, 10);
            this.FormPreAuthorization.controls.insurancePlanExpiryDate.setValue(
                this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value && x.memberCardId === plan.memberCardId)[0].expiryDate);
            this.FormPreAuthorization.controls.insurancePlanMemberCardId.setValue(
                this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value && x.memberCardId === plan.memberCardId)[0].memberCardId);
            this.FormPreAuthorization.controls.insurancePlanRelationWithSubscriber.setValue(
                this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value && x.memberCardId === plan.memberCardId)[0].relationWithSubscriber);
            this.FormPreAuthorization.controls.insurancePlanCoverageType.setValue(
                this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value && x.memberCardId === plan.memberCardId)[0].coverageType);

            this.FormPreAuthorization.controls.insurancePlanPayerName.setValue(
                this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value && x.memberCardId === plan.memberCardId)[0].payerName);
            this.FormPreAuthorization.controls.insurancePayerNphiesId.setValue(
                this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value && x.memberCardId === plan.memberCardId)[0].payerNphiesId);
            // this.FormPreAuthorization.controls.insurancePlanId.setValue(
            //   this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value)[0].payerNphiesId);
            this.FormPreAuthorization.controls.insurancePlanPrimary.setValue(
                this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value && x.memberCardId === plan.memberCardId)[0].primary);
            // tslint:disable-next-line:max-line-length
            this.FormPreAuthorization.controls.insurancePlanTpaNphiesId.setValue(this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value && x.memberCardId === plan.memberCardId)[0].tpaNphiesId === '-1' ? null : this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value && x.memberCardId === plan.memberCardId)[0].tpaNphiesId);
            // this.FormPreAuthorization.controls.insurancePlanPayerId.disable();

            this.FormPreAuthorization.controls.insurancePlanPolicyNumber.setValue(
                this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value && x.memberCardId === plan.memberCardId)[0].policyNumber);
            this.FormPreAuthorization.controls.maxLimit.setValue(
                this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value && x.memberCardId === plan.memberCardId)[0].maxLimit);
            this.FormPreAuthorization.controls.patientShare.setValue(
                this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value && x.memberCardId === plan.memberCardId)[0].patientShare);
        }
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
                            x.lensColor = result.lensColor;
                            x.lensBrand = result.lensBrand;
                            x.lensNote = result.lensNote;
                            x.eye = '';//result.eye;
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
                            x.prismBaseName = result.prismBaseName;
                            //new Fields
                            x.left_sphere = result.left_sphere;
                            x.left_cylinder = result.left_cylinder;
                            x.left_axis = result.left_axis;
                            x.left_prismAmount = result.left_prismAmount;
                            x.left_prismBase = result.left_prismBase;
                            x.left_multifocalPower = result.left_multifocalPower;
                            x.left_lensPower = result.left_lensPower;
                            x.left_lensBackCurve = result.left_lensBackCurve;
                            x.left_lensDiameter = result.left_lensDiameter;
                            x.left_lensDuration = result.left_lensDuration;
                            x.left_lensDurationUnit = result.left_lensDurationUnit;
                            x.left_lensDurationUnitName = result.left_lensDurationUnitName;
                            x.left_prismBaseName = result.left_prismBaseName;
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
        dialogConfig.panelClass = ['primary-dialog', 'dialog-lg'];
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
            source: 'APPROVAL',
            // tslint:disable-next-line:max-line-length
            Sequence: (itemModel !== null) ? itemModel.sequence : (this.Items.length === 0 ? 1 : (this.Items[this.Items.length - 1].sequence + 1)),
            item: itemModel,
            careTeams: this.CareTeams,
            diagnosises: this.Diagnosises,
            supportingInfos: this.SupportingInfo,
            type: this.FormPreAuthorization.controls.type.value.value,
            subType: this.FormPreAuthorization.controls.subType.value.value,
            dateOrdered: this.FormPreAuthorization.controls.dateOrdered.value,
            payerNphiesId: this.FormPreAuthorization.controls.insurancePayerNphiesId.value,
            beneficiaryPatientShare: this.beneficiaryPatientShare,
            beneficiaryMaxLimit: this.beneficiaryMaxLimit,
            documentId: this.FormPreAuthorization.controls.documentId.value,
            IsNewBorn: this.FormPreAuthorization.controls.isNewBorn.value,
            beneficiaryDob: this.selectedBeneficiary.dob,
            tpaNphiesId: this.FormPreAuthorization.controls.insurancePlanTpaNphiesId.value,
            providerType: this.providerType,
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
                            x.quantityCode = result.quantityCode;
                            x.unitPrice = result.unitPrice;
                            x.discount = result.discount;
                            x.discountPercent = result.discountPercent;
                            x.factor = result.factor;
                            x.taxPercent = result.taxPercent;
                            x.patientSharePercent = result.patientSharePercent;
                            x.tax = result.tax;
                            x.net = result.net;
                            x.patientShare = result.patientShare;
                            x.payerShare = result.payerShare;
                            x.startDate = result.startDate;
                            x.startDateStr = result.startDateStr;
                            x.endDate = result.endDate;
                            x.endDateStr = result.endDateStr;
                            x.endDate = result.endDate;
                            x.endDateStr = result.endDateStr;
                            x.supportingInfoSequence = result.supportingInfoSequence;
                            x.careTeamSequence = result.careTeamSequence;
                            x.diagnosisSequence = result.diagnosisSequence;
                            x.pharmacistSelectionReason = result.pharmacistSelectionReason;
                            x.prescribedDrugCode = result.prescribedDrugCode;
                            x.pharmacistSubstitute = result.pharmacistSubstitute;
                            x.reasonPharmacistSubstitute = result.reasonPharmacistSubstitute;
                           
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
            type: this.FormPreAuthorization.controls.type.value.value,
            dateOrdered: this.FormPreAuthorization.controls.dateOrdered.value,
            payerNphiesId: this.FormPreAuthorization.controls.insurancePayerNphiesId.value,
            tpaNphiesId: this.FormPreAuthorization.controls.insurancePlanTpaNphiesId.value
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
                                        y.quantity = result.quantity;
                                        y.quantityCode = result.quantityCode;
                                        y.pharmacistSelectionReason = result.pharmacistSelectionReason;
                                        y.prescribedDrugCode = result.prescribedDrugCode;
                                        y.pharmacistSubstitute = result.pharmacistSubstitute;
                                        y.reasonPharmacistSubstitute = result.reasonPharmacistSubstitute;
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
        if (this.Items.length > 0 && this.Items.filter(x => x.type === 'medication-codes').length > 0 && (this.SupportingInfo.filter(x => x.category === 'days-supply').length === 0)) {
            // tslint:disable-next-line:max-line-length
            this.dialogService.showMessage('Error', 'Days-Supply is required in Supporting Info if any medication-code is used', 'alert', true, 'OK');
            return false;
            // tslint:disable-next-line:max-line-length
        } else if (this.Items.length > 0 && this.Items.filter(x => x.type === 'medication-codes').length > 0 && (this.SupportingInfo.filter(x => x.category === 'days-supply').length > 0)) {
            let SupportingList = this.SupportingInfo.filter(x => x.category === 'days-supply').map(t => t.sequence);
            let ItemSeqList = this.Items.filter(x => x.type === 'medication-codes').map(t => t.sequence);
            var SeqIsThere = ItemSeqList.filter(x => SupportingList.includes(x));

            if (this.Items.filter(x => x.type === 'medication-codes' && (x.supportingInfoSequence.length === 0)).length > 0 || !SeqIsThere) {
                // tslint:disable-next-line:max-line-length
                this.dialogService.showMessage('Error', 'Supporting Info with Days-Supply must be linked with Item of type medication-code', 'alert', true, 'OK');
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

    //   checkMreItemsCodeForSupportingInfo() {
    //     // tslint:disable-next-line:max-line-length
    //     if (this.Items.length > 0 && this.Items.filter(x => (x.type === 'medication-codes' || x.type !== 'medical-devices')).length > 0 && (this.SupportingInfo.filter(x => x.category === 'days-supply').length === 0)) {
    //       // tslint:disable-next-line:max-line-length
    //       this.dialogService.showMessage('Error', 'Days-Supply is required in Supporting Info if any services is used', 'alert', true, 'OK');
    //       return false;
    //       // tslint:disable-next-line:max-line-length
    //     } else if (this.Items.length > 0 && this.Items.filter(x => (x.type !== 'medication-codes' || x.type !== 'medical-devices')).length > 0 && (this.SupportingInfo.filter(x => x.category === 'days-supply').length > 0)) {
    //       let SupportingList = this.SupportingInfo.filter(x => x.category === 'days-supply').map(t => t.sequence);
    //       let ItemSeqList = this.Items.filter(x => (x.type !== 'medication-codes' || x.type !== 'medical-devices')).map(t => t.sequence);
    //       var SeqIsThere = ItemSeqList.filter(x => SupportingList.includes(x));

    //       if (this.Items.filter(x =>(x.type !== 'medication-codes' || x.type !== 'medical-devices') && (x.supportingInfoSequence.length === 0)).length > 0 || !SeqIsThere) {
    //         // tslint:disable-next-line:max-line-length
    //         this.dialogService.showMessage('Error', 'Supporting Info with Days-Supply must be linked with Item of any type type of service', 'alert', true, 'OK');
    //         return false;
    //       } else {
    //         return true;
    //       }
    //     } else {
    //       return true;
    //     }
    //}

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

    checkSupposrtingInfoValidation() {
        let hasError = false;

        this.SupportingInfo.forEach(x => {

            if (x.category === 'info') {
                if (!x.value) {
                    hasError = true;
                }
            }
            if (x.category === 'onset') {
                if (!x.code || !x.fromDate) {
                    hasError = true;
                }
            }
            if (x.category === 'attachment') {
                if (!x.attachment) {
                    hasError = true;
                }
            }
            if (x.category === 'missingtooth') {
                if (!x.code || !x.fromDate || !x.reason) {
                    hasError = true;
                }
            }
            if (x.category === 'hospitalized' || x.category === 'employmentImpacted') {
                if (!x.fromDate || !x.toDate) {
                    hasError = true;
                }
            }
            if (x.category === 'lab-test') {
                if (!x.code || !x.value) {
                    hasError = true;
                }
            }
            if (x.category === 'reason-for-visit') {
                if (!x.code) {
                    hasError = true;
                }
            }
            if (
                x.category === 'days-supply' ||
                x.category === 'vital-sign-weight' ||
                x.category === 'vital-sign-systolic' ||
                x.category === 'vital-sign-diastolic' ||
                x.category === 'icu-hours' ||
                x.category === 'ventilation-hours' ||
                x.category === 'vital-sign-height' ||
                x.category === 'temperature' ||
                x.category === 'pulse' ||
                x.category === 'respiratory-rate' ||
                x.category === 'oxygen-saturation' ||
                x.category === 'birth-weight'
            ) {
                if (!x.value) {
                    hasError = true;
                }
            }
            if (x.category === 'chief-complaint') {
                if (!x.code && !x.value) {
                    hasError = true;
                }
            }

            if (x.category === 'lab-test' ||
                x.category === 'vital-sign-weight' ||
                x.category === 'vital-sign-systolic' ||
                x.category === 'vital-sign-diastolic' ||
                x.category === 'icu-hours' ||
                x.category === 'ventilation-hours' ||
                x.category === 'vital-sign-height' ||
                x.category === 'temperature' ||
                x.category === 'pulse' ||
                x.category === 'oxygen-saturation' ||
                x.category === 'respiratory-rate') {
                if (x.toDate && !x.fromDate) {
                    hasError = true;
                }
            }

        });

        return hasError;
    }

    // checkSupposrtingInfoValidation() {
    //   let hasError = false;

    //   this.SupportingInfo.forEach(x => {
    //     switch (x.category) {

    //       case 'info':

    //         if (!x.value) {
    //           hasError = true;
    //         }

    //         break;
    //       case 'onset':

    //         if (!x.code || !x.fromDate) {
    //           hasError = true;
    //         }

    //         break;
    //       case 'attachment':

    //         if (!x.attachment) {
    //           hasError = true;
    //         }

    //         break;
    //       case 'missingtooth':

    //         if (!x.code || !x.fromDate || !x.reason) {
    //           hasError = true;
    //         }

    //         break;
    //       case 'hospitalized':
    //       case 'employmentImpacted':

    //         if (!x.fromDate || !x.toDate) {
    //           hasError = true;
    //         }

    //         break;

    //       case 'lab-test':

    //         if (!x.code || !x.value) {
    //           hasError = true;
    //         }

    //         break;
    //       case 'reason-for-visit':

    //         if (!x.code) {
    //           hasError = true;
    //         }

    //         break;
    //       case 'days-supply':
    //       case 'vital-sign-weight':
    //       case 'vital-sign-systolic':
    //       case 'vital-sign-diastolic':
    //       case 'icu-hours':
    //       case 'ventilation-hours':
    //       case 'vital-sign-height':
    //       case 'temperature':
    //       case 'pulse':
    //       case 'respiratory-rate':
    //       case 'oxygen-saturation':
    //       case 'birth-weight':

    //         if (!x.value) {
    //           hasError = true;
    //         }

    //         break;
    //       case 'chief-complaint':

    //         if (!x.code && !x.value) {
    //           hasError = true;
    //         }

    //         break;

    //       default:
    //         break;
    //     }
    //   });

    //   return hasError;
    // }

    checkDiagnosisErrorValidation() {
        if (this.Diagnosises.filter(x => x.type === 'principal').length > 0) {
            return true;
        } else {
            this.dialogService.showMessage('Error', 'There must be atleast one Principal Diagnosis', 'alert', true, 'OK', null, true);
            return false;
        }
    }

    checkCareTeamValidation() {
        let hasError = false;
        if (this.CareTeams.length !== 0) {
            this.CareTeams.forEach(element => {
                console.log("physicianCode = " + element.physicianCode + " practitionerName = " + element.practitionerName);
                if (element.physicianCode == null || element.physicianCode == '' || element.practitionerName == null || element.practitionerName == '') {
                    element.error = "Please Select Valid Practitioner";
                    hasError = true;
                } else {
                    element.error = "";
                }
            });
            console.log(hasError);
            return hasError;
        }
    }

    checkNewBornValidation() {
        // tslint:disable-next-line:max-line-length
        if (this.FormPreAuthorization.controls.isNewBorn.value && (this.FormPreAuthorization.controls.type.value.value === 'institutional' || this.FormPreAuthorization.controls.type.value.value === 'professional')) {
            if (this.SupportingInfo.filter(x => x.category === 'birth-weight').length === 0) {
                // tslint:disable-next-line:max-line-length
                this.dialogService.showMessage('Error', 'Birth-Weight is required as Supporting Info for a newborn patient in a professional or institutional preauthorization request', 'alert', true, 'OK', null, true);
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

    checkNewBornSupportingInfoCodes() {
        if (this.FormPreAuthorization.controls.isNewBorn.value) {
            if (this.Diagnosises.filter(x => this.sharedDataService.newBornCodes.includes(x.diagnosisCode)).length === 0) {
                // tslint:disable-next-line:max-line-length
                this.dialogService.showMessage('Error', 'One of the Z38.x codes is required as a diganosis in the preauth request for a newborn', 'alert', true, 'OK', null, true);
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

    onSubmit(isPbmvalidation = false, isMrevalidation = false) {
        this.providerType = this.providerType == null || this.providerType == "" ? 'any' : this.providerType;
        if (this.providerType.toLowerCase() !== 'any' && this.FormPreAuthorization.controls.type.value.value !== this.providerType) {
            const filteredClaimType = this.sharedDataService.claimTypeList.filter(x => x.value === this.providerType)[0];
            const providerTypeName = filteredClaimType != null ? filteredClaimType.name : null;
            const claimTypeName = this.sharedDataService.claimTypeList.filter(x => x.value === this.FormPreAuthorization.controls.type.value.value)[0].name;
            this.dialogService.showMessage('Error', 'Claim type ' + claimTypeName + ' is not supported for Provider type ' + providerTypeName, 'alert', true, 'OK');
            return;
        }
        const prescriptionControl = this.FormPreAuthorization.get('prescription');
        prescriptionControl.clearValidators();
        prescriptionControl.updateValueAndValidity();
        this.isSubmitted = true;

        let hasError = false;
        // tslint:disable-next-line:max-line-length
        // date and accidentType must be exist together 

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

        if (isPbmvalidation) {
            let weightValidtation = this.SupportingInfo.filter(f => f.category == 'vital-sign-weight').length;
            if (weightValidtation == 0) {
                this.dialogService.showMessage('Error', 'please add vital sign weight to complete PBM request', 'alert', true, 'OK');
                return;
            }
        }

        if (isMrevalidation) {
            let daysOFSupplyValidtation = this.SupportingInfo.filter(f => f.category == 'days-supply').length;
            if (daysOFSupplyValidtation == 0) {
                this.dialogService.showMessage('Error', 'please add days supply to complete MRE request', 'alert', true, 'OK');
                return;
            }
        }
        if (this.FormPreAuthorization.valid) {

            if (this.Diagnosises.length === 0 || this.Items.length === 0) {
                hasError = true;
            }

            // this.checkCareTeamValidation();
            this.checkDiagnosisValidation();
            this.checkItemValidation();
            if (this.checkCareTeamValidation()) {
                hasError = true;
            }

            if (!this.checkDiagnosisErrorValidation()) {
                hasError = true;
            }

            if (this.checkSupposrtingInfoValidation()) {
                hasError = true;
            }

            if (!this.checkItemCareTeams()) {
                hasError = true;
            }

            if (!this.checkItemsCodeForSupportingInfo()) {
                hasError = true;
            }

            if (!this.checkNewBornValidation()) {
                hasError = true;
            }

            if (!this.checkNewBornSupportingInfoCodes()) {
                hasError = true;
            }

            if (hasError) {
                return;
            }

            this.model = {};
            if (this.claimReuseId) {
                this.model.claimReuseId = this.claimReuseId;
            }

            this.model.transfer = this.FormPreAuthorization.controls.transfer.value;


            if (this.FormPreAuthorization.controls.otherReferral.value) {
                this.model.referralName = this.FormPreAuthorization.controls.otherReferral.value;
            } else {
                this.model.referralName = this.FormPreAuthorization.controls.referral.value.name;
            }

            this.model.isNewBorn = this.FormPreAuthorization.controls.isNewBorn.value;

            this.model.beneficiary = {};
            this.model.beneficiary.firstName = this.FormPreAuthorization.controls.firstName.value;
            this.model.beneficiary.secondName = this.FormPreAuthorization.controls.middleName.value;
            this.model.beneficiary.thirdName = this.FormPreAuthorization.controls.lastName.value;
            this.model.beneficiary.familyName = this.FormPreAuthorization.controls.familyName.value;
            this.model.beneficiary.fullName = this.FormPreAuthorization.controls.fullName.value;
            this.model.beneficiary.fileId = this.FormPreAuthorization.controls.beneficiaryFileld.value;
            this.model.beneficiary.dob = this.datePipe.transform(this.FormPreAuthorization.controls.dob.value, 'yyyy-MM-dd');
            this.model.beneficiary.gender = this.FormPreAuthorization.controls.gender.value;
            this.model.beneficiary.documentType = this.FormPreAuthorization.controls.documentType.value;
            this.model.beneficiary.documentId = this.FormPreAuthorization.controls.documentId.value;
            this.model.beneficiary.eHealthId = this.FormPreAuthorization.controls.eHealthId.value;
            this.model.beneficiary.nationality = this.FormPreAuthorization.controls.nationality.value;
            this.model.beneficiary.residencyType = this.FormPreAuthorization.controls.residencyType.value;
            this.model.beneficiary.contactNumber = this.FormPreAuthorization.controls.contactNumber.value;
            this.model.beneficiary.maritalStatus = this.FormPreAuthorization.controls.martialStatus.value;
            this.model.beneficiary.bloodGroup = this.FormPreAuthorization.controls.bloodGroup.value;
            this.model.beneficiary.preferredLanguage = this.FormPreAuthorization.controls.preferredLanguage.value;
            this.model.beneficiary.emergencyPhoneNumber = this.FormPreAuthorization.controls.emergencyNumber.value;
            this.model.beneficiary.email = this.FormPreAuthorization.controls.email.value;
            this.model.beneficiary.addressLine = this.FormPreAuthorization.controls.addressLine.value;
            this.model.beneficiary.streetLine = this.FormPreAuthorization.controls.streetLine.value;
            this.model.beneficiary.city = this.FormPreAuthorization.controls.bcity.value;
            this.model.beneficiary.state = this.FormPreAuthorization.controls.bstate.value;
            this.model.beneficiary.country = this.FormPreAuthorization.controls.bcountry.value;
            this.model.beneficiary.postalCode = this.FormPreAuthorization.controls.postalCode.value;

            if (this.FormPreAuthorization.controls.subscriberName.value) {
                this.model.subscriber = {};

                this.model.subscriber.firstName = this.FormSubscriber.controls.firstName.value;
                this.model.subscriber.secondName = this.FormSubscriber.controls.middleName.value;
                this.model.subscriber.thirdName = this.FormSubscriber.controls.lastName.value;
                this.model.subscriber.familyName = this.FormSubscriber.controls.familyName.value;
                this.model.subscriber.fullName = this.FormSubscriber.controls.fullName.value;
                this.model.subscriber.fileId = this.FormSubscriber.controls.beneficiaryFileld.value;
                this.model.subscriber.dob = this.datePipe.transform(this.FormSubscriber.controls.dob.value, 'yyyy-MM-dd');
                this.model.subscriber.gender = this.FormSubscriber.controls.gender.value;
                this.model.subscriber.documentType = this.FormSubscriber.controls.documentType.value;
                this.model.subscriber.documentId = this.FormSubscriber.controls.documentId.value;
                this.model.subscriber.eHealthId = this.FormSubscriber.controls.eHealthId.value;
                this.model.subscriber.nationality = this.FormSubscriber.controls.nationality.value;
                this.model.subscriber.residencyType = this.FormSubscriber.controls.residencyType.value;
                this.model.subscriber.contactNumber = this.FormSubscriber.controls.contactNumber.value;
                this.model.subscriber.maritalStatus = this.FormSubscriber.controls.martialStatus.value;
                this.model.subscriber.bloodGroup = this.FormSubscriber.controls.bloodGroup.value;
                this.model.subscriber.preferredLanguage = this.FormSubscriber.controls.preferredLanguage.value;
                this.model.subscriber.emergencyPhoneNumber = this.FormSubscriber.controls.emergencyNumber.value;
                this.model.subscriber.email = this.FormSubscriber.controls.email.value;
                this.model.subscriber.addressLine = this.FormSubscriber.controls.addressLine.value;
                this.model.subscriber.streetLine = this.FormSubscriber.controls.streetLine.value;
                this.model.subscriber.city = this.FormSubscriber.controls.bcity.value;
                this.model.subscriber.state = this.FormSubscriber.controls.bstate.value;
                this.model.subscriber.country = this.FormSubscriber.controls.bcountry.value;
                this.model.subscriber.postalCode = this.FormSubscriber.controls.postalCode.value;
            } else {
                this.model.subscriber = null;
            }

            this.model.destinationId = this.FormPreAuthorization.controls.insurancePlanTpaNphiesId.value;

            this.model.insurancePlan = {};
            this.model.insurancePlan.payerId = this.FormPreAuthorization.controls.insurancePlanPayerId.value;
            this.model.insurancePlan.memberCardId = this.FormPreAuthorization.controls.insurancePlanMemberCardId.value;
            this.model.insurancePlan.policyNumber = this.FormPreAuthorization.controls.insurancePlanPolicyNumber.value;
            this.model.insurancePlan.maxLimit = this.FormPreAuthorization.controls.insurancePlanMaxLimit.value;
            this.model.insurancePlan.patientShare = this.FormPreAuthorization.controls.insurancePlanPatientShare.value;
            this.model.insurancePlan.coverageType = this.FormPreAuthorization.controls.insurancePlanCoverageType.value;
            this.model.insurancePlan.relationWithSubscriber = this.FormPreAuthorization.controls.insurancePlanRelationWithSubscriber.value;
            if (this.FormPreAuthorization.controls.insurancePlanExpiryDate.value) {
                // tslint:disable-next-line:max-line-length

                this.model.insurancePlan.expiryDate = this.datePipe.transform(this.FormPreAuthorization.controls.insurancePlanExpiryDate.value, 'yyyy-MM-dd');
            }

            this.model.insurancePlan.payerName = this.FormPreAuthorization.controls.insurancePlanPayerName.value;
            this.model.insurancePlan.payerNphiesId = this.FormPreAuthorization.controls.insurancePayerNphiesId.value;
            // this.model.insurancePlan.planId = this.FormPreAuthorization.controls.insurancePlanId.value;
            this.model.insurancePlan.primary = this.FormPreAuthorization.controls.insurancePlanPrimary.value;
            this.model.insurancePlan.tpaNphiesId = this.FormPreAuthorization.controls.insurancePlanTpaNphiesId.value;
            // this.model.beneficiaryId = this.FormPreAuthorization.controls.beneficiaryId.value;
            // this.model.payerNphiesId = this.FormPreAuthorization.controls.insurancePlanId.value;

            // this.model.coverageType = this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === this.model.payerNphiesId)[0].coverageType;
            // this.model.memberCardId = this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === this.model.payerNphiesId)[0].memberCardId;
            // this.model.payerNphiesId = this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === this.model.payerNphiesId)[0].payerNphiesId;
            // // tslint:disable-next-line:max-line-length
            // this.model.relationWithSubscriber = this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === this.model.payerNphiesId)[0].relationWithSubscriber;

            const preAuthorizationModel: any = {};
            preAuthorizationModel.dateOrdered = moment(this.removeSecondsFromDate(this.FormPreAuthorization.controls.dateOrdered.value)).utc();
            if (this.FormPreAuthorization.controls.payeeType.value && this.FormPreAuthorization.controls.payeeType.value.value === 'provider') {
                // tslint:disable-next-line:max-line-length
                preAuthorizationModel.payeeId = this.payeeList.filter(x => x.cchiid === this.sharedServices.cchiId)[0] ? this.payeeList.filter(x => x.cchiid === this.sharedServices.cchiId)[0].nphiesId : '';
            } else {
                preAuthorizationModel.payeeId = this.FormPreAuthorization.controls.payee.value;
            }

            preAuthorizationModel.payeeType = this.FormPreAuthorization.controls.payeeType.value.value;
            preAuthorizationModel.type = this.FormPreAuthorization.controls.type.value.value;
            preAuthorizationModel.subType = this.FormPreAuthorization.controls.subType.value.value;
            preAuthorizationModel.prescription = this.FormPreAuthorization.controls.prescription.value;
            if (this.FormPreAuthorization.controls.preAuthRefNo.value) {
                this.model.preAuthRefNo = this.FormPreAuthorization.controls.preAuthRefNo.value.map(x => {
                    return x.value;
                });
            }

            // tslint:disable-next-line:max-line-length
            preAuthorizationModel.eligibilityOfflineDate = this.datePipe.transform(this.FormPreAuthorization.controls.eligibilityOfflineDate.value, 'yyyy-MM-dd');
            preAuthorizationModel.eligibilityOfflineId = this.FormPreAuthorization.controls.eligibilityOfflineId.value;
            preAuthorizationModel.eligibilityResponseId = this.FormPreAuthorization.controls.eligibilityResponseId.value;
            preAuthorizationModel.eligibilityResponseUrl = this.FormPreAuthorization.controls.eligibilityResponseUrl.value;
            preAuthorizationModel.episodeId = null;
            this.model.preAuthorizationInfo = preAuthorizationModel;

            this.model.supportingInfo = this.SupportingInfo.map(x => {
                // const model: any = {};
                // model.sequence = x.sequence;
                // model.category = x.category;
                // model.code = x.code;
                // model.fromDate = x.fromDate;
                // model.toDate = x.toDate;
                // model.value = x.value;
                // model.reason = x.reason;
                // model.attachment = x.byteArray;
                // model.attachmentName = x.attachmentName;
                // model.attachmentType = x.attachmentType;
                // model.attachmentDate = x.attachmentDate;
                // return model;
                const model: any = {};
                model.sequence = x.sequence;
                model.category = x.category;
                model.code = x.code;
                if (x.fromDate) {
                    x.fromDate = this.datePipe.transform(x.fromDate, 'yyyy-MM-dd');
                }
                model.fromDate = x.fromDate;
                if (x.toDate) {
                    x.toDate = this.datePipe.transform(x.toDate, 'yyyy-MM-dd');
                }
                model.toDate = x.toDate;
                model.value = x.value;
                model.reason = x.reason;
                model.attachment = x.attachment;
                model.attachmentName = x.attachmentName;
                model.attachmentType = x.attachmentType;
                if (x.attachmentDate) {
                    x.attachmentDate = this.datePipe.transform(x.attachmentDate, 'yyyy-MM-dd');
                }
                model.attachmentDate = x.attachmentDate;
                return model;
            });

            this.model.diagnosis = this.Diagnosises.map(x => {
                const model: any = {};
                model.sequence = x.sequence;
                model.diagnosisDescription = x.diagnosisDescription.replace(x.diagnosisCode + ' - ', '').trim();
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
                model.specialityCode = x.specialityCode;
                model.qualificationCode = x.qualificationCode;
                return model;
            });

            if (this.FormPreAuthorization.controls.type.value && this.FormPreAuthorization.controls.type.value.value === 'vision') {
                if (this.FormPreAuthorization.controls.prescriber.value) {
                    this.model.visionPrescription = {};
                    // tslint:disable-next-line:max-line-length
                    this.model.visionPrescription.dateWritten = moment(this.removeSecondsFromDate(this.FormPreAuthorization.controls.dateWritten.value)).utc();
                    this.model.visionPrescription.prescriber = this.FormPreAuthorization.controls.prescriber.value;
                    let sequence = 1; let index = 0;
                    let lens_model: any = [];
                    this.VisionSpecifications.forEach(x => {
                        lens_model[index] = {};
                        lens_model[index].sequence = sequence;
                        lens_model[index].product = x.product;
                        lens_model[index].lensColor = x.lensColor;
                        lens_model[index].lensBrand = x.lensBrand;
                        lens_model[index].lensNote = x.lensNote;
                        lens_model[index].eye = 'right';
                        lens_model[index].sphere = x.sphere;
                        lens_model[index].cylinder = x.cylinder;
                        lens_model[index].axis = x.axis;
                        lens_model[index].prismAmount = x.prismAmount;
                        lens_model[index].prismBase = x.prismBase;
                        lens_model[index].multifocalPower = x.multifocalPower;
                        lens_model[index].lensPower = x.lensPower;
                        lens_model[index].lensBackCurve = x.lensBackCurve;
                        lens_model[index].lensDiameter = x.lensDiameter;
                        lens_model[index].lensDuration = x.lensDuration;
                        lens_model[index].lensDurationUnit = x.lensDurationUnit;
                        //new Fieldindex      
                        ++sequence;
                        ++index;
                        lens_model[index] = {};
                        lens_model[index].sequence = sequence;
                        lens_model[index].product = x.product;
                        lens_model[index].lensColor = x.lensColor;
                        lens_model[index].lensBrand = x.lensBrand;
                        lens_model[index].lensNote = x.lensNote;
                        lens_model[index].eye = 'left';
                        lens_model[index].sphere = x.left_sphere;
                        lens_model[index].cylinder = x.left_cylinder;
                        lens_model[index].axis = x.left_axis;
                        lens_model[index].prismAmount = x.left_prismAmount;
                        lens_model[index].prismBase = x.left_prismBase;
                        lens_model[index].multifocalPower = x.left_multifocalPower;
                        lens_model[index].lensPower = x.left_lensPower;
                        lens_model[index].lensBackCurve = x.left_lensBackCurve;
                        lens_model[index].lensDiameter = x.left_lensDiameter;
                        lens_model[index].lensDuration = x.left_lensDuration;
                        lens_model[index].lensDurationUnit = x.left_lensDurationUnit;
                        ++sequence;
                        ++index;
                    });
                    this.model.visionPrescription.lensSpecifications = lens_model;
                    console.log("on save - > " + JSON.stringify(lens_model));
                }
            }

            this.model.items = this.Items.map(x => {
                // tslint:disable-next-line:max-line-length
                if ((this.FormPreAuthorization.controls.type.value && this.FormPreAuthorization.controls.type.value.value !== 'pharmacy') && x.careTeamSequence && x.careTeamSequence.length > 0) {
                    const model: any = {};
                    model.sequence = x.sequence;
                    model.type = x.type;
                    model.itemCode = x.itemCode ? x.itemCode.toString() : x.itemCode;
                    model.itemDescription = x.itemDescription;
                    model.nonStandardCode = x.nonStandardCode;
                    model.nonStandardDesc = x.display;
                    model.isPackage = x.isPackage;
                    model.bodySite = x.bodySite;
                    model.subSite = x.subSite;
                    model.quantity = x.quantity;
                    model.quantityCode = x.quantityCode;
                    model.unitPrice = x.unitPrice;
                    model.discount = x.discount;
                    model.factor = x.factor;
                    model.taxPercent = x.taxPercent;
                    model.patientSharePercent = x.patientSharePercent;
                    model.tax = x.tax;
                    model.net = x.net;
                    model.patientShare = x.patientShare;
                    model.payerShare = x.payerShare;
                    model.startDate = x.startDate ? moment(this.removeSecondsFromDate(x.startDate)).utc() : null;
                    model.endDate = moment(this.removeSecondsFromDate(x.endDate)).utc();
                    model.supportingInfoSequence = x.supportingInfoSequence;
                    model.careTeamSequence = x.careTeamSequence;
                    model.diagnosisSequence = x.diagnosisSequence;
                    model.invoiceNo = null;

                    model.itemDetails = x.itemDetails.map(y => {
                        const dmodel: any = {};
                        dmodel.sequence = y.sequence;
                        dmodel.type = y.type;
                        dmodel.code = y.itemCode ? y.itemCode.toString() : y.itemCode;
                        dmodel.description = y.itemDescription;
                        dmodel.nonStandardCode = y.nonStandardCode;
                        dmodel.nonStandardDesc = y.display;
                        dmodel.quantity = parseFloat(y.quantity);
                        dmodel.pharmacistSelectionReason = y.pharmacistSelectionReason;
                        dmodel.prescribedDrugCode = y.prescribedDrugCode;
                        dmodel.pharmacistSubstitute = y.pharmacistSubstitute;
                        dmodel.reasonPharmacistSubstitute = y.reasonPharmacistSubstitute;    
                        return dmodel;
                    });

                    return model;
                } else if (this.FormPreAuthorization.controls.type.value && this.FormPreAuthorization.controls.type.value.value === 'pharmacy') {
                    const model: any = {};
                    model.sequence = x.sequence;
                    model.type = x.type;
                    model.itemCode = x.itemCode ? x.itemCode.toString() : x.itemCode;
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
                    model.startDate = x.startDate ? moment(this.removeSecondsFromDate(x.startDate)).utc() : null;
                    model.endDate = moment(this.removeSecondsFromDate(x.endDate)).utc();
                    model.supportingInfoSequence = x.supportingInfoSequence;
                    model.careTeamSequence = x.careTeamSequence;
                    model.diagnosisSequence = x.diagnosisSequence;
                    model.invoiceNo = null;
                    model.pharmacistSelectionReason = x.pharmacistSelectionReason;
                    model.prescribedDrugCode = x.prescribedDrugCode;
                    model.pharmacistSubstitute = x.pharmacistSubstitute;
                    model.reasonPharmacistSubstitute = x.reasonPharmacistSubstitute;

                    model.itemDetails = x.itemDetails.map(y => {
                        const dmodel: any = {};
                        dmodel.sequence = y.sequence;
                        dmodel.type = y.type;
                        dmodel.code = y.itemCode ? y.itemCode.toString() : y.itemCode;
                        dmodel.description = y.itemDescription;
                        dmodel.nonStandardCode = y.nonStandardCode;
                        dmodel.nonStandardDesc = y.display;
                        dmodel.quantity = parseFloat(y.quantity);
                        dmodel.quantityCode = y.quantityCode;
                        dmodel.pharmacistSelectionReason = y.pharmacistSelectionReason;
                        dmodel.prescribedDrugCode = y.prescribedDrugCode;
                        dmodel.pharmacistSubstitute = y.pharmacistSubstitute;
                        dmodel.reasonPharmacistSubstitute = y.reasonPharmacistSubstitute;    
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
            this.sharedServices.loadingChanged.next(true);
            let requestOb = this.providerNphiesApprovalService.sendApprovalRequest(this.sharedServices.providerId, this.model);
            if (isPbmvalidation) {
                requestOb = this.providerNphiesApprovalService.sendApprovalPBMRequest(this.sharedServices.providerId, this.model);
            }
            if (isMrevalidation) {
                let requestObMre = this.providerNphiesApprovalService.sendApprovalMRERequest(this.sharedServices.providerId, this.model);
                this.onMreSubmit(requestObMre);
                return;
            }
            requestOb.subscribe(event => {
                if (event instanceof HttpResponse) {
                    if (event.status === 200 && !isPbmvalidation) {
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
                                if (body.transactionId) {
                                    this.dialogService.showMessage(body.message, '', 'alert', true, 'OK', errors, null, null, body.transactionId);
                                } else {
                                    this.dialogService.showMessage(body.message, '', 'alert', true, 'OK', errors, null, null);
                                }

                            } else {
                                this.dialogService.showMessage('Success', body.message, 'success', true, 'OK');
                                if (this.claimReuseId) {
                                    this.closeEvent.emit({ IsReuse: true });
                                } else {
                                    this.getTransactionDetails(body.approvalRequestId, body.approvalResponseId);
                                }
                            }
                        }
                    } else if (event.status === 200 && isPbmvalidation) {
                        const body: any = event.body;

                        this.sharedServices.loadingChanged.next(false);
                        this.Pbm_result = body;
                        this.openPbmValidationResponseSummaryDialog(body);
                    }
                }
            }, error => {
                this.sharedServices.loadingChanged.next(false);
                if (error instanceof HttpErrorResponse) {
                    if (error.status === 400) {
                        //this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', error.error.errors);
                        this.dialogService.showMessageObservable(error.error.message, '', 'alert', true, 'OK', error.error.errors, true).subscribe(res => {
                            if (this.claimReuseId) {
                                this.reset();
                            }
                            this.getProviderTypeConfiguration();
                        });
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
                        this.dialogService.showMessage(error.error.message ? error.error.message : error.error.error, '', 'alert', true, 'OK', error.error.error);
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

    onMreSubmit(requestObMre: any) {

        requestObMre.subscribe(event => {
            if (event instanceof HttpResponse) {
                if (event.status === 200) {
                    const body: any = event.body;
                    this.sharedServices.loadingChanged.next(false);
                    this.Mre_result = body;
                    this.openMreValidationResponseSummaryDialog(body);
                }
            }
        }, error => {
            this.sharedServices.loadingChanged.next(false);
            if (error instanceof HttpErrorResponse) {
                if (error.status === 400) {
                    console.log(error);
                    //this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', error.error.errors);                 
                    this.dialogService.showMessageObservable(error.error.status, error.error.errors[0].description, 'alert', true, 'OK', error.error.errors[0].description, true).subscribe(res => {
                        if (this.claimReuseId) {
                            this.reset();
                        }
                        this.getProviderTypeConfiguration();
                    });
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
                    this.dialogService.showMessage(error.error.errors[0].code ? error.error.errors[0].code : 'INVALID', '', 'alert', true, 'OK', error.error.errors[0].description);
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


    //ends here 
    SetToMax(data) {
        const ChosenDate = new Date(data);
        const OrderDate = new Date(this.FormPreAuthorization.controls.dateOrdered.value);
        if (ChosenDate > OrderDate) {
            this.FormPreAuthorization.controls.dateWritten.setValue(this.FormPreAuthorization.controls.dateOrdered.value);
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
        location.reload();
        this.model = {};
        this.detailsModel = {};
        this.FormPreAuthorization.reset();
        this.FormPreAuthorization.controls.payee.setValue(this.payeeList.filter(x => x.cchiid === this.sharedServices.cchiId)[0] ? this.payeeList.filter(x => x.cchiid === this.sharedServices.cchiId)[0].nphiesId : '');
        this.FormPreAuthorization.controls.payeeType.setValue(this.sharedDataService.payeeTypeList.filter(x => x.value === 'provider')[0]);
        this.FormPreAuthorization.patchValue({
            insurancePlanId: '',
            type: '',
            subType: '',
            accidentType: '',
            country: '',
            payeeType: this.sharedDataService.payeeTypeList.filter(x => x.value === 'provider')[0]
        });
        this.onPayeeTypeChange();
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

    viewAttachment(e, item) {
        e.preventDefault();
        this.dialog.open<AttachmentViewDialogComponent, AttachmentViewData, any>(AttachmentViewDialogComponent, {
            data: {
                filename: item.attachmentName, attachment: item.byteArray
            }, panelClass: ['primary-dialog', 'dialog-xl']
        });
    }



    getImageOfBlob(attachmentName, attachment) {
        const fileExt = attachmentName.split('.').pop();
        if (fileExt.toLowerCase() === 'pdf') {
            const objectURL = `data:application/pdf;base64,` + attachment;
            return this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
        } else {
            const objectURL = `data:image/${fileExt};base64,` + attachment;
            return this.sanitizer.bypassSecurityTrustUrl(objectURL);
        }
    }

    onNewBornChangeState(event) {
        if (event.checked) {
            this.FormPreAuthorization.controls.subscriberName.setValidators([Validators.required]);
            this.FormPreAuthorization.controls.subscriberName.updateValueAndValidity();
            this.IsSubscriberRequired = true;
        } else {
            this.FormPreAuthorization.controls.subscriberName.clearValidators();
            this.FormPreAuthorization.controls.subscriberName.updateValueAndValidity();
            this.IsSubscriberRequired = false;
        }
    }


    get period() {
        if (this.data.period) {
            return this.data.period.replace('P', '').replace('D', ' Days').replace('M', ' Months').replace('Y', ' Years');
        } else {
            return this.data.period;
        }
    }

    disableItemsButton() {
        return !this.FormPreAuthorization.controls.type.value || !this.FormPreAuthorization.controls.dateOrdered.value
            || !this.FormPreAuthorization.controls.insurancePlanId.value
            || (this.FormPreAuthorization.controls.type.value
                && this.FormPreAuthorization.controls.type.value.value !== 'pharmacy'
                && this.CareTeams.length === 0);
    }

    ItemsAddButtonToolTip() {
        let str = '';
        let result = false;
        if (!this.FormPreAuthorization.controls.type.value || !this.FormPreAuthorization.controls.dateOrdered.value
            || !this.FormPreAuthorization.controls.insurancePlanId.value) {
            result = true;
        }

        if (this.FormPreAuthorization.controls.type.value
            && this.FormPreAuthorization.controls.type.value.value !== 'pharmacy'
            && this.CareTeams.length === 0) {
            str = 'Add Insurance Plan, Date Ordered, Type and Care Team to enable adding Items';
        } else if (this.FormPreAuthorization.controls.type.value
            && this.FormPreAuthorization.controls.type.value.value === 'pharmacy') {
            str = 'Add Insurance Plan, Date Ordered and Type to enable adding Items';
        } else if (!this.FormPreAuthorization.controls.type.value) {
            str = 'Add Insurance Plan, Date Ordered, Type and Care Team to enable adding Items';
        }

        return str;
    }
    getTPAName(TPAId: string) {
        const nameTPA = this.AllTPA.find(val => val.code === TPAId);

        if (nameTPA && nameTPA.display != 'None') {
            return nameTPA.display;
        }
        else {
            return '';
        }
    }

    getTPA() {
        this.providerNphiesSearchService.getPayers().subscribe(event => {
            if (event instanceof HttpResponse) {
                this.AllTPA = event.body as any[];
            }
        }, errorEvent => {
            if (errorEvent instanceof HttpErrorResponse) {

            }
        });
    }

    removeSecondsFromDate(date: any) {
        let newDate = new Date(date);
        newDate.setSeconds(0, 0);
        return new Date(newDate);
    }

    getProviderTypeConfiguration() {
        this.sharedServices.loadingChanged.next(true);
        this.dbMapping.getProviderTypeConfiguration(this.sharedServices.providerId,).subscribe(event => {
            if (event instanceof HttpResponse) {
                const data: any = event.body;
                if (data && data.details) {
                    this.providerType = data.details.claimType;
                    if (data.details.claimType === "vision") {
                        if (!this.claimReuseId) {
                            this.FormPreAuthorization.controls.type.setValue(this.typeList.filter(x => x.value === 'vision')[0]);
                            this.claimType = "vision";
                            this.subTypeList = [
                                { value: 'op', name: 'OutPatient' },
                            ];
                            this.FormPreAuthorization.controls.subType.setValue(this.subTypeList.filter(x => x.value === 'op')[0]);
                            this.FormPreAuthorization.controls.type.disable();
                            this.FormPreAuthorization.controls.subType.disable();
                        }
                    } else if (data.details.claimType === "oral") {
                        if (!this.claimReuseId) {
                            this.FormPreAuthorization.controls.type.setValue(this.typeList.filter(x => x.value === 'oral')[0]);
                            this.claimType = "oral";
                            this.subTypeList = [
                                { value: 'op', name: 'OutPatient' },
                            ];
                            this.FormPreAuthorization.controls.subType.setValue(this.subTypeList.filter(x => x.value === 'op')[0]);
                            this.FormPreAuthorization.controls.type.disable();
                            this.FormPreAuthorization.controls.subType.disable();
                        }
                    } else if (data.details.claimType === "pharmacy") {
                        if (!this.claimReuseId) {
                            this.FormPreAuthorization.controls.type.setValue(this.typeList.filter(x => x.value === 'pharmacy')[0]);
                            this.claimType = "pharmacy";
                            this.subTypeList = [
                                { value: 'op', name: 'OutPatient' },
                            ];
                            this.FormPreAuthorization.controls.subType.setValue(this.subTypeList.filter(x => x.value === 'op')[0]);
                            this.FormPreAuthorization.controls.type.disable();
                            this.FormPreAuthorization.controls.subType.disable();
                        }
                    }
                }
                this.sharedServices.loadingChanged.next(false);
            }
        }, error => {
            if (error instanceof HttpErrorResponse) {
                if (error.status == 404) {
                }
                if (error.status != 404) {
                }
            }
            this.sharedServices.loadingChanged.next(false);
        });
    }
    openPbmValidationResponseSummaryDialog(body) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = ['primary-dialog', 'dialog-lg'];
        dialogConfig.data = {
            PBM_result: body
        };
        const dialogRef = this.dialog.open(PbmValidationResponseSummaryDialogComponent, dialogConfig);
    }

    openMreValidationResponseSummaryDialog(body) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = ['primary-dialog', 'dialog-lg'];
        dialogConfig.data = {
            MRE_result: body
        };
        const dialogRef = this.dialog.open(MreValidationResponseSummaryDialogComponent, dialogConfig);
    }

    sendDispenseQuery() {
        this.isDispenseInquiry = true;
        this.DispinseInqueryModel = {
            ePrescriptionReferenceNumber: this.FormPreAuthorization.controls.prescription.value,
            payerId: "7000911508"
            //this.FormPreAuthorization.controls.insurancePayerNphiesId.value
        };
        this.IsDispenceInqury = true;
    
        const prescriptionControl = this.FormPreAuthorization.get('prescription');
        prescriptionControl.setValidators([Validators.required]);
        prescriptionControl.updateValueAndValidity();
    
        if (prescriptionControl.invalid) {
            prescriptionControl.markAsTouched();
            return;
        }
    
        this.sharedServices.loadingChanged.next(true);
            this.pbmPrescriptionService.getDispenseQueryRequest(this.sharedServices.providerId, this.DispinseInqueryModel).subscribe(
            (event: any) => {
                if (event instanceof HttpResponse) {
                    this.sharedServices.loadingChanged.next(false);
    
                    if (event.status === 200) {
                        const body: any = event.body;
                        this.DispenseQueryResult = body;
    
                        // Handle different HTTP status responses
                        if (body.httpStatus === 'OK') {
                            this.openDispenseQueryResponseSummaryDialog(this.DispenseQueryResult);
                        } else {
                            this.handleErrorResponse(body);
                        }
                    }
                }
            },
            (error: HttpErrorResponse) => {
                this.sharedServices.loadingChanged.next(false);
                console.error(error);
    
                // Handle HTTP errors
                if (error instanceof HttpErrorResponse) {
                    this.handleHttpErrorResponse(error);
                }
            }
        );
    }
    
    private handleErrorResponse(body: any) {
        const errors: any[] = body.errorDescriptions ? [...body.errorDescriptions] : [];
        this.dialogService.showMessage(
            body.errorCode || 'Error',
            '',
            'alert',
            true,
            'OK',
            errors
        );
    }
    
    private handleHttpErrorResponse(error: HttpErrorResponse) {
        let errorTitle = 'An error occurred';
        let errorDetails: any[] = [];
        let errorMessage = 'Please try again later.';
    
        if (error.error) {
            errorTitle = error.error.errorCode || errorTitle;
            errorDetails = error.error.errorDescriptions || [];
            errorMessage = error.error.errorDescriptions ? error.error.errorDescriptions.join(', ') : errorMessage;
        }
    
        switch (error.status) {
            case 400:
                this.dialogService.showMessageObservable(
                    errorTitle,
                    null,
                    'alert',
                    true,
                    'OK',
                    errorDetails,
                    true
                ).subscribe(res => {
                    if (this.claimReuseId) {
                        this.reset();
                    }
                    this.getProviderTypeConfiguration();
                });
                break;
    
            case 404:
                this.dialogService.showMessage(
                    errorTitle,
                    null,
                    'alert',
                    true,
                    'OK',
                    errorDetails
                );
                break;
    
            case 500:
                this.dialogService.showMessage(
                    errorTitle,
                    null,
                    'alert',
                    true,
                    'OK',
                    [error.error.httpStatus]
                );
                break;
    
            case 503:
                this.dialogService.showMessage(
                    errorTitle,
                    null,
                    'alert',
                    true,
                    'OK',
                    [error.error.httpStatus]
                );
                break;
    
            default:
                this.dialogService.showMessage(
                    `Error ${error.status}: ${error.message}`,
                    null,
                    'alert',
                    true,
                    'OK',
                    [error.error.httpStatus]
                );
                break;
        }
    }
    
    getDispenseQuery(){
        
    }


    openDispenseQueryResponseSummaryDialog(body) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = ['primary-dialog', 'dialog-lg'];
        dialogConfig.data = {
            DispenseQueryResult: body
        };
        const dialogRef = this.dialog.open(PrescriptionDispenseDialogComponent, dialogConfig);
    }

    MreResponse(){
        
    }
}
