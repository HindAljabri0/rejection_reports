import { Injectable } from '@angular/core';
import { ICDDiagnosis } from 'src/app/models/ICDDiagnosis';
import { HttpResponse } from '@angular/common/http';
import { AdminService } from '../adminService/admin.service';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  icedOptions: ICDDiagnosis[] = [];
  diagnosisList: any = [];

  claimTypeList = [
    { value: 'institutional', name: 'Institutional' },
    { value: 'oral', name: 'Dental' },
    { value: 'pharmacy', name: 'Pharmacy' },
    { value: 'professional', name: 'Professional' },
    { value: 'vision', name: 'Optical' },
  ];

  subTypeList = [
    { value: 'ip', name: 'InPatient' },
    { value: 'op', name: 'OutPatient' },
    { value: 'emr', name: 'Emergency' },
  ];

  accidentTypeList = [
    { value: 'MVA', name: 'Motor vehicle accident' },
    { value: 'SCHOOL', name: 'School Accident' },
    { value: 'SPT', name: 'Sporting Accident' },
    { value: 'WPA', name: 'Workplace accident' },
  ];

  onAdmissionList = [
    { value: 'y', name: 'Yes' },
    { value: 'n', name: 'No' },
    { value: 'u', name: 'Unknown' },
  ];

  diagnosisTypeList = [
    { value: 'principal', name: 'Principal Diagnosis' },
    { value: 'secondary', name: 'Secondary Diagnosis' },
    { value: 'admitting', name: 'Admitting Diagnosis' },
    { value: 'discharge', name: 'Discharge Diagnosis' },
    { value: 'differential', name: 'Differential Diagnosis' },

    // { value: 'clinical', name: 'Clinical Diagnosis' },
    // { value: 'laboratory', name: 'Laboratory Diagnosis' },
    // { value: 'nursing', name: 'Nursing Diagnosis' },
    // { value: 'prenatal', name: 'Prenatal Diagnosis' },
    // { value: 'radiology', name: 'Radiology Diagnosis' },
    // { value: 'remote', name: 'Remote Diagnosis' },
    // { value: 'retrospective', name: 'Retrospective Diagnosis' },
    // { value: 'self', name: 'Self Diagnosis' },
  ];

  productList = [
    { value: 'lens', name: 'Lens' },
    { value: 'contact', name: 'Contact' },
  ];

  baseList = [
    { value: 'up', name: 'Up' },
    { value: 'down', name: 'Down' },
    { value: 'in', name: 'In' },
    { value: 'out', name: 'Out' }
  ];

  durationUnitList = [
    { value: 'D', name: 'Day' },
    { value: 'WK', name: 'Week' },
    { value: 'MO', name: 'Month' }
  ];

  categoryList = [
    { value: 'info', name: 'Info' },
    { value: 'onset', name: 'Onset' },
    { value: 'attachment', name: 'Attachment' },
    { value: 'missingtooth', name: 'Missing Tooth' },
    { value: 'hospitalized', name: 'Hospitalized' },
    { value: 'employmentImpacted', name: 'Employment Impacted' },
    // { value: 'lab-test', name: 'Lab Test' },
    { value: 'reason-for-visit', name: 'Reason For Visit' },
    { value: 'days-supply', name: 'Days Supply' },
    { value: 'vital-sign-weight', name: 'Vital Sign Weight' },
    { value: 'vital-sign-systolic', name: 'Vital Sign Systolic' },
    { value: 'vital-sign-diastolic', name: 'Vital Sign Diastolic' },
    { value: 'icu-hours', name: 'ICU Hours' },
    { value: 'ventilation-hours', name: 'Ventilation Hours' },
    { value: 'vital-sign-height', name: 'Vital Sign Height' },
    { value: 'chief-complaint', name: 'Chief Complaint' }
  ];

  reasonList = [
    { value: 'e', name: 'Extraction' },
    { value: 'c', name: 'Congenital' },
    { value: 'u', name: 'Unknown' },
    { value: 'o', name: 'Other' }
  ];

  practitionerRoleList = [
    { value: 'doctor', name: 'Doctor' },
    { value: 'nurse', name: 'Nurse' },
    { value: 'pharmacist', name: 'Pharmacist' },
    { value: 'researcher', name: 'Researcher' },
    { value: 'teacher', name: 'Teacher/educator' },
    { value: 'dentist', name: 'Dentist' },
    { value: 'physio', name: 'Physiotherapist' },
    { value: 'speech', name: 'Speechtherapist' },
    { value: 'ict', name: 'ICT professional' },
  ];

  careTeamRoleList = [
    { value: 'primary', name: 'Primary provider' },
    { value: 'assist', name: 'Assisting Provider' },
    { value: 'supervisor', name: 'Supervising Provider' },
    { value: 'other', name: 'Other' },
  ];

  itemTypeList = [
    { value: 'medicalDevices', name: 'Medical Devices' },
    { value: 'medicationCode', name: 'Medication Codes' },
    { value: 'transporationService', name: 'Transportation SRCA' },
    { value: 'imagingService', name: 'Imaging' },
    { value: 'procedures', name: 'Procedures' },
    { value: 'services', name: 'Services' },
    { value: 'laboratory', name: 'Laboratory' },
    { value: 'oralHealthOp', name: 'Oral Health OP' },
    { value: 'oralHealthIp', name: 'Oral Health IP' },
  ];

  constructor(private adminService: AdminService) { }

  getCodeName(category) {
    let codeList: any = [];

    switch (category) {
      case 'missingtooth':

        codeList = [
          { value: 11, name: 'UPPER RIGHT; PERMANENT TEETH # 1' },
          { value: 12, name: 'UPPER RIGHT; PERMANENT TEETH # 2' },
          { value: 13, name: 'UPPER RIGHT; PERMANENT TEETH # 3' },
          { value: 14, name: 'UPPER RIGHT; PERMANENT TEETH # 4' },
          { value: 15, name: 'UPPER RIGHT; PERMANENT TEETH # 5' },
          { value: 16, name: 'UPPER RIGHT; PERMANENT TEETH # 6' },
          { value: 17, name: 'UPPER RIGHT; PERMANENT TEETH # 7' },
          { value: 18, name: 'UPPER RIGHT; PERMANENT TEETH # 8' },
          { value: 21, name: 'UPPER LEFT; PERMANENT TEETH # 1' },
          { value: 22, name: 'UPPER LEFT; PERMANENT TEETH # 2' },
          { value: 23, name: 'UPPER LEFT; PERMANENT TEETH # 3' },
          { value: 24, name: 'UPPER LEFT; PERMANENT TEETH # 4' },
          { value: 25, name: 'UPPER LEFT; PERMANENT TEETH # 5' },
          { value: 26, name: 'UPPER LEFT; PERMANENT TEETH # 6' },
          { value: 27, name: 'UPPER LEFT; PERMANENT TEETH # 7' },
          { value: 28, name: 'UPPER LEFT; PERMANENT TEETH # 8' },
          { value: 31, name: 'LOWER LEFT; PERMANENT TEETH # 1' },
          { value: 32, name: 'LOWER LEFT; PERMANENT TEETH # 2' },
          { value: 33, name: 'LOWER LEFT; PERMANENT TEETH # 3' },
          { value: 34, name: 'LOWER LEFT; PERMANENT TEETH # 4' },
          { value: 35, name: 'LOWER LEFT; PERMANENT TEETH # 5' },
          { value: 36, name: 'LOWER LEFT; PERMANENT TEETH # 6' },
          { value: 37, name: 'LOWER LEFT; PERMANENT TEETH # 7' },
          { value: 38, name: 'LOWER LEFT; PERMANENT TEETH # 8' },
          { value: 41, name: 'LOWER RIGHT; PERMANENT TEETH # 1' },
          { value: 42, name: 'LOWER RIGHT; PERMANENT TEETH # 2' },
          { value: 43, name: 'LOWER RIGHT; PERMANENT TEETH # 3' },
          { value: 44, name: 'LOWER RIGHT; PERMANENT TEETH # 4' },
          { value: 45, name: 'LOWER RIGHT; PERMANENT TEETH # 5' },
          { value: 46, name: 'LOWER RIGHT; PERMANENT TEETH # 6' },
          { value: 47, name: 'LOWER RIGHT; PERMANENT TEETH # 7' },
          { value: 48, name: 'LOWER RIGHT; PERMANENT TEETH # 8' },
          { value: 51, name: 'UPPER RIGHT; DECIDUOUS TEETH # 1' },
          { value: 52, name: 'UPPER RIGHT; DECIDUOUS TEETH # 2' },
          { value: 53, name: 'UPPER RIGHT; DECIDUOUS TEETH # 3' },
          { value: 54, name: 'UPPER RIGHT; DECIDUOUS TEETH # 4' },
          { value: 55, name: 'UPPER RIGHT; DECIDUOUS TEETH # 5' },
          { value: 61, name: 'UPPER LEFT; DECIDUOUS TEETH # 1' },
          { value: 62, name: 'UPPER LEFT; DECIDUOUS TEETH # 2' },
          { value: 63, name: 'UPPER LEFT; DECIDUOUS TEETH # 3' },
          { value: 64, name: 'UPPER LEFT; DECIDUOUS TEETH # 4' },
          { value: 65, name: 'UPPER LEFT; DECIDUOUS TEETH # 5' },
          { value: 71, name: 'LOWER LEFT; DECIDUOUS TEETH # 1' },
          { value: 72, name: 'LOWER LEFT; DECIDUOUS TEETH # 2' },
          { value: 73, name: 'LOWER LEFT; DECIDUOUS TEETH # 3' },
          { value: 74, name: 'LOWER LEFT; DECIDUOUS TEETH # 4' },
          { value: 75, name: 'LOWER LEFT; DECIDUOUS TEETH # 5' },
          { value: 81, name: 'LOWER RIGHT; DECIDUOUS TEETH # 1' },
          { value: 82, name: 'LOWER RIGHT; DECIDUOUS TEETH # 2' },
          { value: 83, name: 'LOWER RIGHT; DECIDUOUS TEETH # 3' },
          { value: 84, name: 'LOWER RIGHT; DECIDUOUS TEETH # 4' },
          { value: 85, name: 'LOWER RIGHT; DECIDUOUS TEETH # 5' },
        ];

        return codeList;

      case 'reason-for-visit':

        codeList = [
          { name: 'New Visit', value: 'new-visit' },
          { name: 'Follow Up', value: 'follow-up' },
          { name: 'Refill', value: 'refill' },
          { name: 'Walk in', value: 'walk-in' },
          { name: 'Referral', value: 'referral' }
        ];

        return codeList;

      case 'chief-complaint':
      case 'onset':
        this.searchICDCodes(category);
        break;
    }
  }

  searchICDCodes(category) {
    this.icedOptions = [];
    this.adminService.searchICDCode(category).subscribe(
      event => {
        if (event instanceof HttpResponse) {
          if (event.body instanceof Object) {
            Object.keys(event.body).forEach(key => {
              if (this.diagnosisList.findIndex(diagnosis => diagnosis.diagnosisCode === event.body[key]['icddiagnosisCode']) === -1) {
                this.icedOptions.push(new ICDDiagnosis(null,
                  event.body[key]['icddiagnosisCode'],
                  event.body[key]['description']
                ));
                return this.icedOptions;
              }
            });
          }
        }
      }
    );
  }
}
