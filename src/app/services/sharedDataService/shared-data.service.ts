import { Injectable } from '@angular/core';
import { ICDDiagnosis } from 'src/app/models/ICDDiagnosis';
import { HttpResponse } from '@angular/common/http';
import { ProviderNphiesSearchService } from '../providerNphiesSearchService/provider-nphies-search.service';

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
  cnhiTypeList = [
    { value: 'institutional', name: 'Institutional' },
  ];
  searchClaimTypeList = [
    { value: 'institutional,oral,pharmacy,professional,vision', name: 'Any' },
    { value: 'institutional', name: 'Institutional' },
    { value: 'oral', name: 'Dental' },
    { value: 'pharmacy', name: 'Pharmacy' },
    { value: 'professional', name: 'Professional' },
    { value: 'vision', name: 'Optical' },
  ];
  Cities = [
    { Code : "Ad Diriyah",	Region : "Center",	Name : "Ad Diriyah" },
    { Code : "Al Aflaj",	Region : "Center",	Name : "Al Aflaj" },
    { Code : "Al Artawiyah",	Region : "Center",	Name : "Al Artawiyah" },
    { Code : "Al Badayea",	Region : "Center",	Name : "Al Badayea" },
    { Code : "Al Bukayriyah",	Region : "Center",	Name : "Al Bukayriyah" },
    { Code : "Al Duwadimi",	Region : "Center",	Name : "Al Duwadimi" },
    { Code : "Al Hait",	Region : "Center",	Name : "Al Hait" },
    { Code : "Al Majma'ah",	Region : "Center",	Name : "Al Majma'ah" },
    { Code : "Al Mithnab",	Region : "Center",	Name : "Al Mithnab" },
    { Code : "Al Quwaiiyah",	Region : "Center",	Name : "Al Quwaiiyah" },
    { Code : "Al Uyaynah",	Region : "Center",	Name : "Al Uyaynah" },
    { Code : "Al-Kharj",	Region : "Center",	Name : "Al-Kharj" },
    { Code : "Al-Muzahmiya",	Region : "Center",	Name : "Al-Muzahmiya" },
    { Code : "Ar Rass",	Region : "Center",	Name : "Ar Rass" },
    { Code : "As Sulayyil",	Region : "Center",	Name : "As Sulayyil" },
    { Code : "Az Zulfi",	Region : "Center",	Name : "Az Zulfi" },
    { Code : "Baqaa",	Region : "Center",	Name : "Baqaa" },
    { Code : "Buraydah",	Region : "Center",	Name : "Buraydah" },
    { Code : "Hail",	Region : "Center",	Name : "Hail" },
    { Code : "Howtat Bani Tamim",	Region : "Center",	Name : "Howtat Bani Tamim" },
    { Code : "Riyadh",	Region : "Center",	Name : "Riyadh" },
    { Code : "Riyadh Al Khabra",	Region : "Center",	Name : "Riyadh Al Khabra" },
    { Code : "Sajir",	Region : "Center",	Name : "Sajir" },
    { Code : "Shaqra",	Region : "Center",	Name : "Shaqra" },
    { Code : "Sudair",	Region : "Center",	Name : "Sudair" },
    { Code : "Unayzah",	Region : "Center",	Name : "Unayzah" },
    { Code : "Wadi ad-Dawasir",	Region : "Center",	Name : "Wadi ad-Dawasir" },
    { Code : "Abu Hadriya",	Region : "East",	Name : "Abu Hadriya" },
    { Code : "Al Ahsa",	Region : "East",	Name : "Al Ahsa" },
    { Code : "Al Hofuf",	Region : "East",	Name : "Al Hofuf" },
    { Code : "Al Jubail",	Region : "East",	Name : "Al Jubail" },
    { Code : "Al Khobar",	Region : "East",	Name : "Al Khobar" },
    { Code : "Al Mubarraz",	Region : "East",	Name : "Al Mubarraz" },
    { Code : "Al Qaisumah",	Region : "East",	Name : "Al Qaisumah" },
    { Code : "Al Qatif",	Region : "East",	Name : "Al Qatif" },
    { Code : "Al-Thuqbah",	Region : "East",	Name : "Al-Thuqbah" },
    { Code : "Anak",	Region : "East",	Name : "Anak" },
    { Code : "Ar Rafiah",	Region : "East",	Name : "Ar Rafiah" },
    { Code : "As Saffaniyah",	Region : "East",	Name : "As Saffaniyah" },
    { Code : "Buqayq",	Region : "East",	Name : "Buqayq" },
    { Code : "Dammam",	Region : "East",	Name : "Dammam" },
    { Code : "Dhahran",	Region : "East",	Name : "Dhahran" },
    { Code : "Hafar Al Batin",	Region : "East",	Name : "Hafar Al Batin" },
    { Code : "Haradh",	Region : "East",	Name : "Haradh" },
    { Code : "Jubail Industrial",	Region : "East",	Name : "Jubail Industrial" },
    { Code : "Khafji",	Region : "East",	Name : "Khafji" },
    { Code : "Mumbai",	Region : "East",	Name : "Mumbai" },
    { Code : "Nairyah",	Region : "East",	Name : "Nairyah" },
    { Code : "Ras Al Khair",	Region : "East",	Name : "Ras Al Khair" },
    { Code : "Ras Tanura",	Region : "East",	Name : "Ras Tanura" },
    { Code : "Safua",	Region : "East",	Name : "Safua" },
    { Code : "Saihat",	Region : "East",	Name : "Saihat" },
    { Code : "Tarout",	Region : "East",	Name : "Tarout" },
    { Code : "Al Bad'",	Region : "North",	Name : "Al Bad'" },
    { Code : "Al Hadithah",	Region : "North",	Name : "Al Hadithah" },
    { Code : "Al Jouf",	Region : "North",	Name : "Al Jouf" },
    { Code : "Al Qurayyat",	Region : "North",	Name : "Al Qurayyat" },
    { Code : "Al Wajh",	Region : "North",	Name : "Al Wajh" },
    { Code : "Arar",	Region : "North",	Name : "Arar" },
    { Code : "Duba",	Region : "North",	Name : "Duba" },
    { Code : "Dumah Al Jandal",	Region : "North",	Name : "Dumah Al Jandal" },
    { Code : "Haql",	Region : "North",	Name : "Haql" },
    { Code : "Rafha",	Region : "North",	Name : "Rafha" },
    { Code : "Sakaka",	Region : "North",	Name : "Sakaka" },
    { Code : "Tabuk",	Region : "North",	Name : "Tabuk" },
    { Code : "Tayma",	Region : "North",	Name : "Tayma" },
    { Code : "Tubarjal",	Region : "North",	Name : "Tubarjal" },
    { Code : "Turaif",	Region : "North",	Name : "Turaif" },
    { Code : "Umluj",	Region : "North",	Name : "Umluj" },
    { Code : "Abha",	Region : "South",	Name : "Abha" },
    { Code : "Abu Arish",	Region : "South",	Name : "Abu Arish" },
    { Code : "Ad Darb",	Region : "South",	Name : "Ad Darb" },
    { Code : "Ahad Al Masarihah",	Region : "South",	Name : "Ahad Al Masarihah" },
    { Code : "Ahad Rafidah",	Region : "South",	Name : "Ahad Rafidah" },
    { Code : "Al Aqiq",	Region : "South",	Name : "Al Aqiq" },
    { Code : "Al Aridhah",	Region : "South",	Name : "Al Aridhah" },
    { Code : "Al Bahah",	Region : "South",	Name : "Al Bahah" },
    { Code : "Al Makhwah",	Region : "South",	Name : "Al Makhwah" },
    { Code : "Al Namas",	Region : "South",	Name : "Al Namas" },
    { Code : "Almajaridah",	Region : "South",	Name : "Almajaridah" },
    { Code : "Almandaq",	Region : "South",	Name : "Almandaq" },
    { Code : "Baish",	Region : "South",	Name : "Baish" },
    { Code : "Baljurashi",	Region : "South",	Name : "Baljurashi" },
    { Code : "Bisha",	Region : "South",	Name : "Bisha" },
    { Code : "Dhahran Al Janub",	Region : "South",	Name : "Dhahran Al Janub" },
    { Code : "Farasan Island",	Region : "South",	Name : "Farasan Island" },
    { Code : "Hubuna",	Region : "South",	Name : "Hubuna" },
    { Code : "Jazan",	Region : "South",	Name : "Jazan" },
    { Code : "Khamis Mushait",	Region : "South",	Name : "Khamis Mushait" },
    { Code : "Muhayil",	Region : "South",	Name : "Muhayil" },
    { Code : "Najran",	Region : "South",	Name : "Najran" },
    { Code : "Ragal Almaa",	Region : "South",	Name : "Ragal Almaa" },
    { Code : "Sabt Al Alayah",	Region : "South",	Name : "Sabt Al Alayah" },
    { Code : "Sabyaa",	Region : "South",	Name : "Sabyaa" },
    { Code : "Samtah",	Region : "South",	Name : "Samtah" },
    { Code : "Sharorah",	Region : "South",	Name : "Sharorah" },
    { Code : "Wadi Ibn Hashbal",	Region : "South",	Name : "Wadi Ibn Hashbal" },
    { Code : "Adham",	Region : "West",	Name : "Adham" },
    { Code : "Al Jumum",	Region : "West",	Name : "Al Jumum" },
    { Code : "Al Khurma",	Region : "West",	Name : "Al Khurma" },
    { Code : "Al Lith",	Region : "West",	Name : "Al Lith" },
    { Code : "Al Qunfudhah",	Region : "West",	Name : "Al Qunfudhah" },
    { Code : "Al Ula",	Region : "West",	Name : "Al Ula" },
    { Code : "Asfan",	Region : "West",	Name : "Asfan" },
    { Code : "Badr",	Region : "West",	Name : "Badr" },
    { Code : "Hawiyah",	Region : "West",	Name : "Hawiyah" },
    { Code : "Jeddah",	Region : "West",	Name : "Jeddah" },
    { Code : "Khulais",	Region : "West",	Name : "Khulais" },
    { Code : "Mahd Al Thahab",	Region : "West",	Name : "Mahd Al Thahab" },
    { Code : "Mecca",	Region : "West",	Name : "Mecca" },
    { Code : "Medina",	Region : "West",	Name : "Medina" },
    { Code : "Rabigh",	Region : "West",	Name : "Rabigh" },
    { Code : "Ranyah",	Region : "West",	Name : "Ranyah" },
    { Code : "Taif",	Region : "West",	Name : "Taif" },
    { Code : "Thuwal",	Region : "West",	Name : "Thuwal" },
    { Code : "Yanbu",	Region : "West",	Name : "Yanbu" },
    { Code : "Yanbu Albahr",	Region : "West",	Name : "Yanbu Albahr" },
    { Code : "Yanbu Industrial",	Region : "West",	Name : "Yanbu Industrial" }
  ];

  encounterStatusList = [
    { value: 'planned', name: 'Planned' },
    { value: 'arrived', name: 'Arrived' },
    { value: 'triaged', name: 'Triaged' },
    { value: 'in-progress', name: 'In Progress' },
    { value: 'onleave', name: 'On Leave' },
    { value: 'finished', name: 'Finished' },
    { value: 'cancelled', name: 'Cancelled' },
    { value: 'entered-in-error', name: 'Entered in Error' },
    { value: 'unknown', name: 'Unknown' }
  ];

  encounterClassList = [
    { value: 'AMB', name: 'Ambulatory' },
    { value: 'EMER', name: 'Emergency' },
    { value: 'HH', name: 'Home Health' },
    { value: 'IMP', name: 'Inpatient Encounter' },
    { value: 'SS', name: 'Short Stay' }
  ];

  encounterCnhiClassList = [
    { value: 'ALTC', name: 'ALTC' },
  ];

  encounterServiceTypeList = [
    { value: '237', name: '237 - Acute Inpatient Serv' },
    { value: '576', name: '576 - Rehabilitation' },
    { value: '356', name: '356 - General Maintenance' },
    { value: '621', name: '621 - Complex Maintenance' },
    { value: '179', name: '179 - Palliative Medicine' }
  ];

  encounterPriorityList = [
    // { value: 'A', name: 'A - ASAP' },
    // { value: 'CR', name: 'CR - Callback Results' },
    // { value: 'CS', name: 'CS - Callback For Scheduling' },
    // { value: 'CSP', name: 'CSP - Callback Placer For Scheduling' },
    // { value: 'CSR', name: 'CSR - Contact Recipient For Scheduling' },
    { value: 'EL', name: 'EL - Elective' },
    { value: 'EM', name: 'EM - Emergency' }
    // { value: 'P', name: 'P - Preop' },
    // { value: 'PRN', name: 'PRN - As Needed' },
    // { value: 'R', name: 'R - Routine' },
    // { value: 'RR', name: 'RR - Rush Reporting' },
    // { value: 'S', name: 'S - Stat' },
    // { value: 'T', name: 'T - Timing Critical' },
    // { value: 'UD', name: 'UD - Use As Directed' },
    // { value: 'UR', name: 'UR - Urgent' }
  ];
   
  encounterAdminsSourceList = [
      { value: 'RECR', name: 'RECR - Red crescent' },
    { value: 'WKIN', name: ' WKIN - Walk-in ' },
    { value: 'FMLYM', name: 'FMLYM - Family member' },
    { value: 'AA', name: 'AA - Already admitted' },
    { value: 'PVAMB', name: 'PVAMB - Private ambulance' },
    { value: 'AAIC', name: 'AAIC - Already admitted- insurance consumed' },
    { value: 'Others', name: 'Others - Others' }
  ];

  encounterAdminSourceList = [
    { value: 'IA', name: 'IA - Immediate Admission' },
    { value: 'EER', name: 'EER - Admission from hospital ER' },
    { value: 'EOP', name: 'EOP - Emergency Admission from hospital outpatient' },
    { value: 'EGPHC', name: 'EGPHC - Emergency Admission by referral from government primary healthcare center' },
    { value: 'EGGH', name: 'EGGH - Emergency Admission by referral from general government hospital' },
    { value: 'EPPHC', name: 'EPPHC - Emergency Admission by referral from private primary healthcare center' },
    { value: 'EPH', name: 'EPH - Emergency Admission by referral from private hospital' },
    { value: 'EIC', name: 'EIC - Emergency Admission by insurance company' },
    { value: 'EWGS', name: 'EWGS - Elective waiting list admission government free Scheme' },
    { value: 'EWSS', name: 'EWSS - Elective waiting list admission self-payment Scheme' },
    { value: 'EWIS', name: 'EWIS - Elective waiting list admission insurance coverage Scheme' },
    { value: 'EMBA', name: 'EMBA - Emergency Maternity Birth Admission' },
    { value: 'PMBA', name: 'PMBA - Planned Maternity Birth Admission' },
    { value: 'Others', name: 'Others - Others' }
  ];

  encounterReAdmissionList = [
    { value: 'R', name: 'Re-admission' }
  ];

  encounterDischargeDispositionList = [
    { value: 'Home', name: 'Home' },
    { value: 'Alternative home', name: 'Alternative home' },
    { value: 'Other healthcare facility', name: 'Other healthcare facility' },
    { value: 'Hospice', name: 'Hospice' },
    { value: 'Long-term care', name: 'Long-term care' },
    { value: 'Left against advice', name: 'Left against advice' },
    { value: 'Expired', name: 'Expired' },
    { value: 'Psychiatric hospital', name: 'Psychiatric hospital' },
    { value: 'Rehabilitation', name: 'Rehabilitation' },
    { value: 'Skilled nursing facility', name: 'Skilled nursing facility' },
    { value: 'Other', name: 'Other' }
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
    { value: 'attachment', name: 'Attachment' },
    { value: 'birth-weight', name: 'Birth Weight' },
    { value: 'chief-complaint', name: 'Chief Complaint' },
    { value: 'days-supply', name: 'Days Supply' },
    { value: 'employmentImpacted', name: 'Employment Impacted' },
    { value: 'hospitalized', name: 'Hospitalized' },
    { value: 'icu-hours', name: 'ICU Hours' },
    { value: 'info', name: 'Info' },
    { value: 'lab-test', name: 'Lab Test' },
    { value: 'last-menstrual-period', name: 'Last Menstrual Period' },
    { value: 'missingtooth', name: 'Missing Tooth' },
    { value: 'onset', name: 'Onset' },
    { value: 'oxygen-saturation', name: 'Oxygen Saturation' },
    { value: 'pulse', name: 'Pulse' },
    { value: 'reason-for-visit', name: 'Reason For Visit' },
    { value: 'respiratory-rate', name: 'Respiratory Rate' },
    { value: 'temperature', name: 'Temperature' },
    { value: 'ventilation-hours', name: 'Ventilation Hours' },
    { value: 'vital-sign-diastolic', name: 'Vital Sign Diastolic' },
    { value: 'vital-sign-height', name: 'Vital Sign Height' },
    { value: 'vital-sign-systolic', name: 'Vital Sign Systolic' },
    { value: 'vital-sign-weight', name: 'Vital Sign Weight' }
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
    { value: 'medical-devices', name: 'Medical Devices' },
    { value: 'medication-codes', name: 'Medication Codes' },
    { value: 'transportation-srca', name: 'Transportation SRCA' },
    { value: 'imaging', name: 'Imaging' },
    { value: 'procedures', name: 'Procedures' },
    { value: 'services', name: 'Services' },
    { value: 'laboratory', name: 'Laboratory' },
    { value: 'oral-health-ip', name: 'Oral Health IP' },
    { value: 'oral-health-op', name: 'Oral Health OP' },
    { value: 'moh-category', name: 'MOH Billing Codes' },
  ];

  itemMedicationReasonList = [
    { value: 'patient-request', name: '	Requested by patient' },
    { value: 'generic', name: 'Generic' },
    { value: 'innovative-noGeneric', name: 'Innovative without Generic' },
    { value: 'physician-request', name: 'Requested by physician' },
    { value: 'drug-pharmacyUnavailable', name: 'Out of pharmacy stock' },
    { value: 'drug-marketUnavailable', name: 'Drug market unavailability' },
    { value: 'Irreplaceable-drug', name: 'SFDA Irreplaceable drug' }
  ];


  cancelReasonList = [
    { value: 'WI', name: 'Wrong information' },
    { value: 'NP', name: 'Service not performed' },
    { value: 'TAS', name: 'Transaction already submitted' }
  ];

  payeeTypeList = [
    // { value: 'subscriber', name: 'Subscriber' },
    { value: 'provider', name: 'Provider' },
    { value: 'other', name: 'Other' },
  ];

  beneficiaryTypeList = [
    { value: 'PRC', name: 'Resident Card' },
    { value: 'PPN', name: 'Passport' },
    { value: 'VP', name: 'Visa' },
    { value: 'NI', name: 'National Card' },
    { value: 'MR', name: 'Medical Record Number' },
  ];

  siteEligibility = [
    { value: 'eligible', name: 'Eligible' },
    // tslint:disable-next-line:quotemark
    { value: 'not-active', name: "Member's insurance policy is not active" },
    { value: 'not-covered', name: 'Policy does not cover the requested services' },
    { value: 'not-direct billing', name: 'Patient is not covered on direct billing basis' },
    { value: 'out-network', name: 'Provider outside member Network' },
    { value: 'limit-exhausted', name: 'Patient policy/benefit limit is exhausted' },
    { value: 'coverage-suspended', name: 'Patient coverage is suspended ' },
    { value: 'provider-contract-suspended', name: 'Provider contract is suspended' }
  ];

  missingToothCodeList = [
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

  reasonForVisitCodeList = [
    { name: 'New Visit', value: 'new-visit' },
    { name: 'Follow Up', value: 'follow-up' },
    { name: 'Refill', value: 'refill' },
    { name: 'Walk in', value: 'walk-in' },
    { name: 'Referral', value: 'referral' }
  ];

  newBornCodes = [
    'Z38',
    'Z38.0',
    'Z38.1',
    'Z38.2',
    'Z38.3',
    'Z38.4',
    'Z38.5',
    'Z38.6',
    'Z38.7',
    'Z38.8'
  ];

  reissueReaseons = [
    { value: 'correction', name: 'Error correction' },
    { value: 'adjudication', name: 'Additional adjudication' },
    { value: 'miscalculation', name: 'Miscalculation correction' },
    { value: 'benefit', name: 'Benefit processing correction' },
    { value: 'audit', name: 'Audit' },
    { value: 'other', name: 'Other' }
  ];

  style = ".caf-form {font-size: 8pt;line-height: 12pt;font-family: 'Arial', sans-serif;margin: 0;} .caf-form h1,.caf-form h2,.caf-form h3,.caf-form h4,.caf-form h5,.caf-form h6,.caf-form p {margin: 0;} .caf-form h1 {font-size: 18pt;line-height: 24pt;} .caf-form h3 {font-size: 9pt;line-height: 14pt;} .caf-form .form-container-group {border-radius: 8px;border: 2px solid #000;padding: 8px;height: 100%;} .caf-form .border-right {border-right: 1px solid #000;} .caf-form .stamp {border: 1px solid #000;border-radius: 50px;height: 16pt;width: 16pt;display: inline-block;vertical-align: top;} .caf-form .layout-table {width: 100%;} .caf-form .layout-table>tr>td {padding: 4pt;border-collapse: collapse;height: 1px;} .caf-form .layout-table>tr>td:first-child {padding-left: 0;} .caf-form .layout-table>tr>td:last-child {padding-right: 0;} .caf-form .text-nowrap {white-space: nowrap;} .caf-form .text-wrap {white-space: normal;} .caf-form .internal-table {border-collapse: collapse;white-space: nowrap;width: 100%;} .caf-form .value-holder {border-bottom: 1px dashed #707070;} .caf-form p>span.value-holder {display: inline-block;vertical-align: baseline;} .caf-form p {min-height: 12pt;} .caf-form .check {height: 10pt;width: 10pt;display: inline-block;vertical-align: -2pt;opacity: 0;margin: 0 -1pt;} .caf-form .check.checked {opacity: 1;} .caf-form .round-strip {border: 1px solid #000;border-radius: 50px;} .caf-form hr {height: 0;background: none;border: 0;margin: 4pt 0;border-bottom: 2px solid #000;} .caf-form .data-table {width: 100%;border-collapse: collapse;text-align: center;margin: 4pt 0;} .caf-form .data-table td,.caf-form .data-table th {border: 1px solid #000;} .caf-form .data-table th {font-weight: 700;}";

  constructor(private providerNphiesSearchService: ProviderNphiesSearchService) { }

  getCodeName(category, code = null) {
    let codeList: any = [];

    switch (category) {
      case 'missingtooth':

        codeList = this.missingToothCodeList;

        return codeList;

      case 'reason-for-visit':

        codeList = this.reasonForVisitCodeList;

        return codeList;

      case 'chief-complaint':
      case 'onset':
        this.searchICDCodes(code);
        break;
    }
  }

  searchICDCodes(code) {

    this.icedOptions = [];
    this.providerNphiesSearchService.searchICDCode(code).subscribe(
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

  getBodySite(type: string) {

    let bodySite: any = [];
    if (type === 'oral') {
      bodySite = [
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
    } else {
      bodySite = [
        { value: 'E1', name: 'Upper left, eyelid' },
        { value: 'E2', name: 'Lower left, eyelid' },
        { value: 'E3', name: 'Upper right, eyelid' },
        { value: 'E4', name: 'Lower right, eyelid' },
        { value: 'F1', name: 'Left hand, second digit' },
        { value: 'F2', name: 'Left hand, third digit' },
        { value: 'F3', name: 'Left hand, fourth digit' },
        { value: 'F4', name: 'Left hand, fifth digit' },
        { value: 'F5', name: 'Right hand, thumb' },
        { value: 'F6', name: 'Right hand, second digit' },
        { value: 'F7', name: 'Right hand, third digit' },
        { value: 'F8', name: 'Right hand, fourth digit' },
        { value: 'F9', name: 'Right hand, fifth digit' },
        { value: 'FA', name: 'Left hand, thumb' },
        { value: 'LC', name: 'Left circumflex coronary artery' },
        { value: 'LD', name: 'Left anterior descending coronary artery' },
        { value: 'LM', name: 'Left main coronary artery' },
        { value: 'LT', name: 'Left side (used to identify procedures performed on the left side of the body)' },
        { value: 'RC', name: 'Right coronary artery' },
        { value: 'RI', name: 'Ramus intermedius coronary artery' },
        { value: 'RT', name: 'Right side (used to identify procedures performed on the right side of the body)' },
        { value: 'T1', name: 'Left foot, second digit' },
        { value: 'T2', name: 'Left foot, third digit' },
        { value: 'T3', name: 'Left foot, fourth digit' },
        { value: 'T4', name: 'Left foot, fifth digit' },
        { value: 'T5', name: 'Right foot, great toe' },
        { value: 'T6', name: 'Right foot, second digit' },
        { value: 'T7', name: 'Right foot, third digit' },
        { value: 'T8', name: 'Right foot, fourth digit' },
        { value: 'T9', name: 'Right foot, fifth digit' },
        { value: 'TA', name: 'Left foot, great toe' },
        { value: 'RIV', name: 'right eye' },
        { value: 'LIV', name: 'left eye' }
      ];
    }
    return bodySite;
  }

  getSubSite(type: string) {
    let subSite: any = [];
    if (type === 'oral') {
      subSite = [
        { value: 'M', name: 'Mesial' },
        { value: 'O', name: 'Occlusal' },
        { value: 'I', name: 'Incisal' },
        { value: 'D', name: 'Distal' },
        { value: 'B', name: 'Buccal' },
        { value: 'V', name: 'Ventral' },
        { value: 'L', name: 'Lingual' },
        { value: 'MO', name: 'Mesioclusal' },
        { value: 'DO', name: 'Distoclusal' },
        { value: 'DI', name: 'Distoincisal' },
        { value: 'MOD', name: 'Mesioclusodistal' }
      ];
    } else {
      subSite = [
        { value: 'R', name: 'Right' },
        { value: 'L', name: 'Left' },
        { value: 'U', name: 'Upper ' },
        { value: 'D', name: 'Down' },
        { value: 'A', name: 'Anterior' },
        { value: 'P', name: 'Posterior' },
        { value: 'I', name: 'interior' },
        { value: 'E', name: 'Exterior' }
      ];
    }
    return subSite;
  }

}
