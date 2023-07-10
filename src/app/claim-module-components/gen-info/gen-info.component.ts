import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Period } from '../models/period.type';
import {
    updateClaimDate,
    updateCaseType,
    updateFileNumber,
    updateMemberDob,
    updateIllnessDuration,
    updateAge,
    updateMainSymptoms,
    updateSignificantSign,
    updateCommReport,
    updateEligibilityNum,
    updateRadiologyReport,
    updateOtherCondition,
    updatePatientName,
    setError,
    updatePayer,
    updateVisitType,
    updateNationality,
    updatePatientMemberId,
    updatePolicyNum,
    updateNationalId,
    updateApprovalNum,
    updatePatientGender,
    updatePlanType,
    updatePhysicianId,
    updatePhysicianCategory,
    updatePhysicianName,
    updatePageType,
    updateDepartment,
    updateAccCode,
    updateContactNumber
} from '../store/claim.actions';
import {
    getDepartmentCode,
    FieldError,
    getGenInfoErrors,
    getClaim,
    ClaimPageType,
    getPageType,
    getPageMode,
    ClaimPageMode,
    nationalities,
    getVisitType,

    getPhysicianCategory,
    getDepartments,

} from '../store/claim.reducer';
import { map, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { Claim } from '../models/claim.model';
import { ReplaySubject, Subject } from 'rxjs';
import { MatSelect } from '@angular/material';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
    selector: 'gen-info',
    templateUrl: './gen-info.component.html',
    styles: []
})
export class GenInfoComponent implements OnInit, OnDestroy {

    isRetrievedClaim = false;

    departmentCode: string;

    claimDateController: FormControl = new FormControl();


    fileNumberController: FormControl = new FormControl();
    contactNumberController: FormControl = new FormControl();
    memberDobController: FormControl = new FormControl();
    illnessDurationController: FormControl = new FormControl();
    ageController: FormControl = new FormControl();
    mainSymptomsController: FormControl = new FormControl();
    unitIllness = 'Day';
    unitAge = 'Year';

    significantSignController: FormControl = new FormControl();
    commReportController: FormControl = new FormControl();
    eligibilityNumController: FormControl = new FormControl();
    accCodeController: FormControl = new FormControl();
    selectedCaseType: string;
    isCaceTypeEnabled = true;
    radiologyReportController: FormControl = new FormControl();
    otherConditionController: FormControl = new FormControl();

    errors: FieldError[] = [];

    pageMode: ClaimPageMode;
    claimPageType: ClaimPageType;
    fullNameController: FormControl = new FormControl();
    editableFields = {
        payer: true,
        visitType: true,
        nationality: true,
        gender: true
    };

    selectedGender = 'M';
    selectedPayer: number;
    selectedVisitType: string;
    selectedNationality = '';
    memberIdController: FormControl = new FormControl();
    policyNumController: FormControl = new FormControl();
    nationalIdController: FormControl = new FormControl();
    approvalNumController: FormControl = new FormControl();

    planTypeController: FormControl = new FormControl();

    payersList: { id: number, name: string, arName: string }[] = [];
    visitTypes: any[] = [];
    nationalities = nationalities;

    nationalityFilterCtrl: FormControl = new FormControl();
    filteredNations: ReplaySubject<{ Code: string, Name: string }[]> = new ReplaySubject<{ Code: string, Name: string }[]>(1);
    _onDestroy = new Subject<void>();
    @ViewChild('nationalitySelect', { static: true }) nationalitySelect: MatSelect;
    selectedCategory = '';
    pageType: ClaimPageType;
    selectedDepartment: string;
    categoryEditable = true;
    categories: any[] = [];
    departments: any[];
    physicianNameController: FormControl = new FormControl();
    physicianIdController: FormControl = new FormControl();
    departmentEditable = true;
    @Input() claimType = '';
    departmentFilterCtrl: FormControl = new FormControl();
    filteredDepartments: ReplaySubject<{ Code: string, Name: string }[]> = new ReplaySubject<{ Code: string, Name: string }[]>(1);
    @ViewChild('departmentSelect', { static: true }) departmentSelect: MatSelect;
    isDepartmentDisable = false;
    isPageModeCreate = false;

    constructor(
        private store: Store,
        private datePipe: DatePipe,
        private sharedServices: SharedServices
    ) { }

    ngOnInit() {
        this.store.select(getPageMode).pipe(
            takeUntil(this._onDestroy),
            withLatestFrom(this.store.select(getClaim)),
            map(values => ({ mode: values[0], claim: values[1] }))
        ).subscribe(({ mode, claim }) => {
            this.pageMode = mode;
            this.payersList = this.sharedServices.getPayersList();
            if (mode == 'VIEW') {
                this.setData(claim);
                this.toggleEdit(false);
            } else if (mode == 'EDIT') {
                this.setData(claim);
                this.toggleEdit(true);
            } else if (mode == 'CREATE_FROM_RETRIEVED') {
                this.setData(claim);
                this.toggleEdit(false, true);
            } else {
                if (this.payersList.length > 0) {
                    this.selectedPayer = this.payersList[0].id;
                } else {
                    this.store.dispatch(setError({ error: { code: 'PAYERS_LIST' } }));
                }

                if (this.visitTypes.length > 0) {
                    this.selectedVisitType = this.visitTypes[0];
                }
                this.store.dispatch(updatePayer({ payerId: this.selectedPayer }));
                this.store.dispatch(updateVisitType({ visitType: this.selectedVisitType }));
            }
        });
        this.store.select(getPageType).subscribe(type => this.claimPageType = type);
        this.store.select(getDepartmentCode).subscribe(type => this.departmentCode = type);
        this.store.select(getGenInfoErrors).subscribe(errors => this.errors = errors || []);


        this.filteredNations.next(this.nationalities.slice());

        this.nationalityFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterNationality();
            });

        this.store.select(getVisitType).subscribe(visitTypes => this.visitTypes = visitTypes || []);
        this.store.select(getPageType).subscribe(type => this.claimPageType = type);




        this.store.select(getPageType).subscribe(type => this.pageType = type);
        this.store.select(getDepartmentCode).subscribe(type => this.selectedDepartment = type);

        setTimeout(() => {
            const category = this.selectedCategory;
            const department = this.selectedDepartment;
            this.selectedDepartment = null;
            this.selectedCategory = '-1';
            setTimeout(() => {
                this.selectedDepartment = department; this.selectedCategory = category;
            }, 500);
        }, 500);
        this.store.select(getPhysicianCategory).subscribe(category => this.categories = category);
        this.store.select(getDepartments).pipe(
            withLatestFrom(this.store.select(getPageMode)),
            map(values => ({ departments: values[0], mode: values[1] }))
        ).subscribe(values => {
            if (values.mode.startsWith('CREATE')) {
                this.isDepartmentDisable = this.pageType.toLocaleUpperCase() === 'DENTAL_OPTICAL_PHARMACY' ? true : false;
                this.departments = values.departments;
                this.isPageModeCreate = true;
            } else {
                this.departments = this.pageType.toLocaleUpperCase() === 'DENTAL_OPTICAL_PHARMACY'
                    ? values.departments.filter(department => department.name == 'Dental' || department.name == 'Optical'
                        || department.name == 'Pharmacy') : values.departments;
            }
            this.filteredDepartments.next(this.departments.slice());
            this.departmentFilterCtrl.valueChanges
                .pipe(takeUntil(this._onDestroy))
                .subscribe(() => {
                    this.filterDepartments();
                });
        });

    }

    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    setData(claim: Claim) {
        this.fileNumberController.setValue(claim.caseInformation.patient.patientFileNumber);
        this.contactNumberController.setValue(claim.caseInformation.patient.contactNumber);

        const illnessDuration = claim.caseInformation.caseDescription.illnessDuration;
        if (illnessDuration != null) {
            if (illnessDuration.years != null) {
                this.illnessDurationController.setValue(illnessDuration.years);
                this.unitIllness = 'Year';
            } else if (illnessDuration.months != null) {
                this.illnessDurationController.setValue(illnessDuration.months);
                this.unitIllness = 'Month';
            } else if (illnessDuration.days != null) {
                this.illnessDurationController.setValue(illnessDuration.days);
                this.unitIllness = 'Day';
            } else {
                this.illnessDurationController.setValue('');
            }
        } else {
            this.illnessDurationController.setValue('');
        }
        const ageDuration = claim.caseInformation.patient.age;
        if (ageDuration != null) {
            if (ageDuration.years != null) {
                this.ageController.setValue(ageDuration.years);
                this.unitAge = 'Year';
            } else if (ageDuration.months != null) {
                this.ageController.setValue(ageDuration.months);
                this.unitAge = 'Month';
            } else if (ageDuration.days != null) {
                this.ageController.setValue(ageDuration.days);
                this.unitAge = 'Day';
            } else {
                this.ageController.setValue('');
            }
        } else {
            this.ageController.setValue('');
        }
        this.mainSymptomsController.setValue(claim.caseInformation.caseDescription.chiefComplaintSymptoms);
        const visitDate = claim.visitInformation.visitDate;
        if (visitDate != null) {
            this.claimDateController.setValue(this.datePipe.transform(visitDate, 'yyyy-MM-dd'));
        } else {
            this.claimDateController.setValue('');
        }
        const dob = claim.caseInformation.patient.dob;
        if (dob != null) {
            this.memberDobController.setValue(this.datePipe.transform(dob, 'yyyy-MM-dd'));
        } else {
            this.memberDobController.setValue('');
        }
        this.significantSignController.setValue(claim.caseInformation.caseDescription.signicantSigns);
        this.commReportController.setValue(claim.commreport);
        this.eligibilityNumController.setValue(claim.claimIdentities.eligibilityNumber);
        this.selectedCaseType = claim.caseInformation.caseType;
        this.radiologyReportController.setValue(claim.caseInformation.radiologyReport);
        this.otherConditionController.setValue(claim.caseInformation.otherConditions);

        this.fullNameController.setValue(claim.caseInformation.patient.fullName);
        if (claim.claimIdentities.payerID != null) {
            this.selectedPayer = Number.parseInt(claim.claimIdentities.payerID, 10);
        }
        this.selectedGender = claim.caseInformation.patient.gender;
        this.selectedVisitType = claim.visitInformation.visitType;
        this.selectedNationality = claim.caseInformation.patient.nationality;
        this.nationalIdController.setValue(claim.member.idNumber);
        this.approvalNumController.setValue(claim.claimIdentities.approvalNumber);
        this.policyNumController.setValue(claim.member.policyNumber);
        this.memberIdController.setValue(claim.member.memberID);
        this.accCodeController.setValue(claim.member.accCode);
        this.planTypeController.setValue(claim.member.planType);
        // this.setInitialValueOfNationality();
        this.physicianIdController.setValue(claim.caseInformation.physician.physicianID);
        this.physicianNameController.setValue(claim.caseInformation.physician.physicianName);
        this.selectedCategory = claim.caseInformation.physician.physicianCategory;
        this.selectedDepartment = claim.visitInformation.departmentCode;
    }

    toggleEdit(allowEdit: boolean, enableForNulls?: boolean) {
        this.fileNumberController.disable();
        // this.contactNumberController.disable();
        this.claimDateController.disable();
        this.isCaceTypeEnabled = false;
        if (allowEdit) {
            this.illnessDurationController.enable();
            this.ageController.enable();
            this.mainSymptomsController.enable();
            this.memberDobController.enable();
            this.significantSignController.enable();
            this.commReportController.enable();
            this.radiologyReportController.enable();
            this.otherConditionController.enable();
            this.eligibilityNumController.enable();
            this.fullNameController.enable();
            this.contactNumberController.enable();
        } else {
            this.illnessDurationController.disable();
            this.ageController.disable();
            this.mainSymptomsController.disable();
            this.memberDobController.disable();
            this.significantSignController.disable();
            this.commReportController.disable();
            this.radiologyReportController.disable();
            this.otherConditionController.disable();
            this.eligibilityNumController.disable();
            this.fullNameController.disable();
            this.contactNumberController.disable();
        }

        if (enableForNulls) {
            if (this.isControlNull(this.fileNumberController)) {
                this.fileNumberController.enable();
            }
            if (this.isControlNull(this.contactNumberController)) {
                this.contactNumberController.enable();
            }
            if (this.isControlNull(this.illnessDurationController)) {
                this.illnessDurationController.enable();
            }
            if (this.isControlNull(this.ageController)) {
                this.ageController.enable();
            }
            if (this.isControlNull(this.mainSymptomsController)) {
                this.mainSymptomsController.enable();
            }
            if (this.isControlNull(this.claimDateController)) {
                this.claimDateController.enable();
            }
            if (this.isControlNull(this.memberDobController)) {
                this.memberDobController.enable();
            }
            if (this.isControlNull(this.significantSignController)) {
                this.significantSignController.enable();
            }
            if (this.isControlNull(this.commReportController)) {
                this.commReportController.enable();
            }
            if (this.isControlNull(this.radiologyReportController)) {
                this.radiologyReportController.enable();
            }
            if (this.isControlNull(this.otherConditionController)) {
                this.otherConditionController.enable();
            }
            if (this.isControlNull(this.eligibilityNumController)) {
                this.eligibilityNumController.enable();
            }
            if (this.isControlNull(this.fullNameController)) {
                this.fullNameController.enable();
            }
        }

        this.editableFields = {
            gender: allowEdit || (enableForNulls && this.selectedGender != 'M' && this.selectedGender != 'F'),
            nationality: allowEdit || (enableForNulls && this.nationalities.findIndex(n => n.Code == this.selectedNationality) == -1),
            payer: allowEdit || (enableForNulls && this.payersList.findIndex(p => p.id == this.selectedPayer) == -1),
            visitType: allowEdit || (enableForNulls && !this.visitTypes.includes(this.selectedVisitType))
        };
        if (allowEdit) {
            this.memberIdController.enable();
            this.accCodeController.enable();
            this.policyNumController.enable();
            this.nationalIdController.enable();
            this.approvalNumController.enable();
            this.planTypeController.enable();
            this.physicianIdController.enable();
            this.physicianNameController.enable();
        } else {
            this.memberIdController.disable();
            this.accCodeController.disable();
            this.policyNumController.disable();
            this.nationalIdController.disable();
            this.approvalNumController.disable();
            this.planTypeController.disable();
            this.physicianIdController.disable();
            this.physicianNameController.disable();
        }
        if (enableForNulls) {
            if (this.isControlNull(this.memberIdController)) {
                this.memberIdController.enable();
            }
            if (this.isControlNull(this.accCodeController)) {
                this.accCodeController.enable();
            }
            if (this.isControlNull(this.policyNumController)) {
                this.policyNumController.enable();
            }
            if (this.isControlNull(this.nationalIdController) || this.nationalIdController.value.length != 10) {
                this.nationalIdController.enable();
            }
            if (this.isControlNull(this.approvalNumController)) {
                this.approvalNumController.enable();
            }
            if (this.isControlNull(this.planTypeController)) {
                this.planTypeController.enable();
            }
        }

        this.categoryEditable = allowEdit || (enableForNulls && !this.categories.includes(this.selectedCategory));
        this.departmentEditable = allowEdit;
        // if (allowEdit || (enableForNulls && (this.physicianNameController.value == null || this.physicianNameController.value == ''))) {
        //     this.physicianNameController.enable();
        // } else {
        //     this.physicianNameController.disable();
        // }
        // if (enableForNulls) {
        //     if (this.physicianIdController.value == null || this.physicianIdController.value == '') {
        //         this.physicianIdController.disable();
        //     } else {
        //         this.physicianIdController.enable();
        //     }
        // } else {
        //     this.physicianIdController.disable();
        // }
    }
    // this.claimDateController.value
    updateClaim(field: string) {
        switch (field) {
            case ('claimDate'):
                if (this.claimDateController.value != null) {
                    this.store.dispatch(updateClaimDate({ claimDate: new Date(this.claimDateController.value) }));
                } else {
                    this.store.dispatch(updateClaimDate({ claimDate: null }));
                }
                break;
            case ('caseType'):
                this.store.dispatch(updateCaseType({ caseType: this.selectedCaseType }));
                break;
            case ('fileNumber'):
                this.store.dispatch(updateFileNumber({ fileNumber: this.fileNumberController.value }));
                break;
            case ('contactNumber'):
                this.store.dispatch(updateContactNumber({ contactNumber: this.contactNumberController.value }));
                break;
            case ('memberDob'):
                this.store.dispatch(updateMemberDob({ memberDob: new Date(this.memberDobController.value) }));
                break;
            case ('illnessDuration'):
                const illnessPeriod = this.returnPeriod(this.illnessDurationController.value, this.unitIllness);
                this.store.dispatch(updateIllnessDuration({ illnessDuration: illnessPeriod }));
                break;
            case ('age'):
                const agePeriod = this.returnPeriod(this.ageController.value, this.unitAge);
                this.store.dispatch(updateAge({ age: agePeriod }));
                break;
            case ('mainSymptoms'):
                this.store.dispatch(updateMainSymptoms({ symptoms: this.mainSymptomsController.value }));
                break;
            case 'significantSign':
                this.store.dispatch(updateSignificantSign({ sign: this.significantSignController.value }));
                break;
            case 'commReport':
                this.store.dispatch(updateCommReport({ report: this.commReportController.value }));
                break;
            case 'eligibilityNum':
                this.store.dispatch(updateEligibilityNum({ number: this.eligibilityNumController.value }));
                break;
            case 'radiologyReport':
                this.store.dispatch(updateRadiologyReport({ report: this.radiologyReportController.value }));
                break;
            case 'otherCondition':
                this.store.dispatch(updateOtherCondition({ condition: this.otherConditionController.value }));
                break;
            case 'fullName':
                this.store.dispatch(updatePatientName({ name: this.fullNameController.value }));
                break;
            case 'payer':
                this.store.dispatch(updatePayer({ payerId: this.selectedPayer }));
                break;
            case 'visitType':
                this.store.dispatch(updateVisitType({ visitType: this.selectedVisitType }));
                break;
            case 'nationality':
                this.store.dispatch(updateNationality({ nationality: this.selectedNationality }));
                break;
            case 'memberId':
                this.store.dispatch(updatePatientMemberId({ memberId: this.memberIdController.value }));
                break;
            case 'accCode':
                this.store.dispatch(updateAccCode({ accCode: this.accCodeController.value }));
                break;
            case 'policyNum':
                this.store.dispatch(updatePolicyNum({ policyNo: this.policyNumController.value }));
                break;
            case 'nationalId':
                this.store.dispatch(updateNationalId({
                    nationalId: this.nationalIdController.value == null ? null : `${this.nationalIdController.value}`
                }));
                break;
            case 'approvalNum':
                this.store.dispatch(updateApprovalNum({ approvalNo: this.approvalNumController.value }));
                break;
            case 'gender':
                this.store.dispatch(updatePatientGender({ gender: this.selectedGender }));
                break;
            case 'planType':
                this.store.dispatch(updatePlanType({ planType: this.planTypeController.value }));
                break;
            case 'physicianId':
                this.store.dispatch(updatePhysicianId({ physicianId: this.physicianIdController.value }));
                break;
            case 'physicianName':
                this.store.dispatch(updatePhysicianName({ physicianName: this.physicianNameController.value }));
                break;
            case 'physicianCategory':
                this.store.dispatch(updatePhysicianCategory({ physicianCategory: this.selectedCategory }));
                break;
            case 'department':
                const dental = this.departments.find(department => department.name == 'Dental');
                const optical = this.departments.find(department => department.name == 'Optical');
                const pharmacy = this.departments.find(department => department.name == 'Pharmacy');
                if ((dental != null && this.selectedDepartment == dental.departmentId)
                    || (optical != null && this.selectedDepartment == optical.departmentId)
                    || (pharmacy != null && this.selectedDepartment == pharmacy.departmentId)) {
                    this.store.dispatch(updatePageType({ pageType: 'DENTAL_OPTICAL_PHARMACY' }));
                } else {
                    this.store.dispatch(updatePageType({ pageType: 'INPATIENT_OUTPATIENT' }));
                }
                this.store.dispatch(updateDepartment({ department: this.selectedDepartment.toString() }));
                break;
        }
    }

    updateClaimUnit(field: string, event) {

        switch (field) {
            case ('illnessDurationUnit'):
                this.unitIllness = event.value;
                if (this.illnessDurationController.value != null) {
                    this.store.dispatch(updateIllnessDuration({
                        illnessDuration: this.returnPeriod(this.illnessDurationController.value, this.unitIllness)
                    }));
                }
                break;
            case ('ageUnit'):
                this.unitAge = event.value;
                if (this.ageController.value != null) {
                    this.store.dispatch(updateAge({ age: this.returnPeriod(this.ageController.value, this.unitAge) }));
                }
                break;
        }
    }

    returnPeriod(value: string, unit: string): Period {
        if (unit === 'Year') {
            return new Period(Number.parseInt(value, 10), 'years');
        } else if (unit === 'Month') {
            return new Period(Number.parseInt(value, 10), 'months');
        } else if (unit === 'Day') {
            return new Period(Number.parseInt(value, 10), 'days');
        } else if (unit == 'Week') {
            return new Period(Number.parseInt(value, 10) * 7, 'days');
        } else {
            return new Period(Number.parseInt(value, 10), 'years');
        }
    }

    fieldHasError(fieldName) {
        return this.errors.findIndex(error => error.fieldName == fieldName) != -1;
    }

    getFieldError(fieldName) {
        const index = this.errors.findIndex(error => error.fieldName == fieldName);
        if (index > -1) {
            return this.errors[index].error || '';
        }
        return '';
    }

    isControlNull(control: FormControl) {
        return control.value == null || control.value == '';
    }


    filterDepartments() {
        if (!this.departments) {
            return;
        }
        // get the search keyword
        let search = this.departmentFilterCtrl.value;
        if (!search) {
            this.filteredDepartments.next(this.departments.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the nations
        this.filteredDepartments.next(
            this.departments.filter(department => department.name.toLowerCase().indexOf(search) > -1)
        );
    }


    filterNationality() {
        if (!this.nationalities) {
            return;
        }
        // get the search keyword
        let search = this.nationalityFilterCtrl.value;
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

    setInitialValueOfNationality() {
        this.filteredNations
            .pipe(take(1), takeUntil(this._onDestroy))
            .subscribe(() => {
                this.nationalitySelect.compareWith = (
                    a: { Code: string, Name: string },
                    b: { Code: string, Name: string }) =>
                    a && b && a.Code === b.Code;
            });
    }

    setInitialValueOfDepartment() {
        this.filteredDepartments
            .pipe(take(1), takeUntil(this._onDestroy))
            .subscribe(() => {
                this.departmentSelect.compareWith = (
                    a: { Code: string, Name: string },
                    b: { Code: string, Name: string }) =>
                    a && b && a.Code === b.Code;
            });
    }


    payersListHasId(id) {
        return this.payersList.findIndex(payer => payer.id == id) > -1;
    }

    beautifyVisitType(visitType: string) {
        if (visitType != null) {
            let str = visitType.substr(0, 1) + visitType.substr(1).toLowerCase();
            if (str.includes('_')) {
                const split = str.split('_');
                str = split[0] + ' ' + this.beautifyVisitType(split[1].toUpperCase());
            }
            return str;
        }
    }

    beautifyCategory(category) {
        if (category != null && category != '-1') {
            let str = category.substr(0, 1) + category.substr(1).toLowerCase();
            if (str.includes('_')) {
                const split = str.split('_');
                str = split[0] + ' ' + this.beautifyCategory(split[1].toUpperCase());
            }
            return str;
        } else {
            return '';
        }
    }

    departmentsHasCode(code) {
        return this.departments.findIndex(dep => dep.departmentId == code) > -1;
    }

}
