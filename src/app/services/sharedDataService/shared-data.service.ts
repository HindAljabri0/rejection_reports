import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

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

  constructor() { }

}
