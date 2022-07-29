import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';


@Injectable({
  providedIn: 'root'
})
export class ClaimFilesValidationService {

  private regex: RegExp = /^[A-Z0-9\-]+$/;

  constructor() { }
  wrongFormattedHeaders: string[];
  missingHeaders: HeadersMap[];
  validateHeaders(file: XLSX.WorkBook): string {
    let headers: string[] = [];
    this.missingHeaders = [];
    this.wrongFormattedHeaders = [];
    if (file.Sheets.hasOwnProperty('GenInfo')
      && file.Sheets.hasOwnProperty('Diagnosis')
      && file.Sheets.hasOwnProperty('Invoices')
      && file.Sheets.hasOwnProperty('ServiceDetails')
      && file.Sheets.hasOwnProperty('LabResult')
      && file.Sheets.hasOwnProperty('LabComponent')) {
      const genInfoSheet = file.Sheets['GenInfo'];
      const diagnosisSheet = file.Sheets['Diagnosis'];
      const invoicesSheet = file.Sheets['Invoices'];
      const serviceDetailsSheet = file.Sheets['ServiceDetails'];
      const labResultSheet = file.Sheets['LabResult'];
      const labComponentSheet = file.Sheets['LabComponent'];
      let sheetHeaders = this.getHeadersFromSheet(genInfoSheet);
      this.checkIfSheetIsMissingHeader(sheetHeaders, 'GenInfo', 'PROVCLAIMNO');
      headers = headers.concat(sheetHeaders);
      sheetHeaders = this.getHeadersFromSheet(diagnosisSheet);
      this.checkIfSheetIsMissingHeader(sheetHeaders, 'Diagnosis', 'PROVCLAIMNO');
      headers = headers.concat(sheetHeaders);
      sheetHeaders = this.getHeadersFromSheet(invoicesSheet);
      this.checkIfSheetIsMissingHeader(sheetHeaders, 'Invoices', 'PROVCLAIMNO');
      this.checkIfSheetIsMissingHeader(sheetHeaders, 'Invoices', 'INVOICENO');
      headers = headers.concat(sheetHeaders);
      sheetHeaders = this.getHeadersFromSheet(serviceDetailsSheet);
      this.checkIfSheetIsMissingHeader(sheetHeaders, 'ServiceDetails', 'INVOICENO');
      headers = headers.concat(sheetHeaders);
      sheetHeaders = this.getHeadersFromSheet(labResultSheet);
      this.checkIfSheetIsMissingHeader(sheetHeaders, 'LabResult', 'PROVCLAIMNO');
      this.checkIfSheetIsMissingHeader(sheetHeaders, 'LabResult', 'LABTESTCODE');
      headers = headers.concat(sheetHeaders);
      sheetHeaders = this.getHeadersFromSheet(labComponentSheet);
      this.checkIfSheetIsMissingHeader(sheetHeaders, 'LabComponent', 'PROVCLAIMNO');
      this.checkIfSheetIsMissingHeader(sheetHeaders, 'LabComponent', 'LABTESTCODE');
      headers = headers.concat(sheetHeaders);
    } else {
      const ws: XLSX.WorkSheet = file.Sheets[file.SheetNames[0]];
      headers = this.getHeadersFromSheet(ws);
    }
    this.checkAllHeaders(headers);
    const result = this.errorsToString();
    return result;
  }

  validateHeadersForScrubbing(file: XLSX.WorkBook): string {
    let headers: string[] = [];
    this.missingHeaders = [];
    this.wrongFormattedHeaders = [];
    const ws: XLSX.WorkSheet = file.Sheets[file.SheetNames[0]];
    headers = this.getHeadersFromSheet(ws);
    this.checkAllHeadersForScrubbing(headers);
    const result = this.errorsToString();
    return result;
  }

  private checkAllHeadersForScrubbing(headers: string[]) {
    AllowedHeadersForScrubbing.forEach(header => this.checkIfSheetIsMissingHeader(headers, undefined, header));
  }

  private checkAllHeaders(headers: string[]) {
    let flag = false;
    headers.forEach(header => {
      if (header.length > 0 && !this.regex.test(header)) {
        this.wrongFormattedHeaders.push(header);
      }
      if (header.startsWith('ICD') || header.startsWith('DIAGNOSISCODE')) {
        flag = true;
      }
    });
    if (!flag) {
      AllowedHeaders.push('DIAGNOSISCODE');
    }
    AllowedHeaders.forEach(header => this.checkIfSheetIsMissingHeader(headers, undefined, header));
  }

  private getHeadersFromSheet(ws: XLSX.WorkSheet) {
    const data = XLSX.utils.sheet_to_csv(ws);
    if (data.length == 0) {
      throw 'File have empty sheets';
    }
    let lastIndexInHeaderLine = data.indexOf('\n');
    if (lastIndexInHeaderLine == -1) {
      lastIndexInHeaderLine = data.length;
    }
    const headersLine = data.substr(0, lastIndexInHeaderLine);
    return headersLine.split(',');
  }

  private checkIfSheetIsMissingHeader(sheetHeaders: string[], sheetName: string, headerName: string) {
    if (!sheetHeaders.includes(headerName.toString())) {
      this.missingHeaders.push({ sheet: sheetName, header: headerName });
    }
  }

  private errorsToString(): string {
    let str = '';
    if (this.wrongFormattedHeaders.length > 0) {
      str = `- The format for the following header is invalid: [${this.wrongFormattedHeaders.toString()}]\nThey Should be upper case letters with no spaces, numbers, or special characters.\n`;
    }
    if (this.missingHeaders.length > 0) {
      str += '- The following headers are missing: [';
      this.missingHeaders.forEach(header => {
        if (header.header == 'DIAGNOSISCODE') {
          str += header.header + '/ICD10' + (header.sheet != null ? `(sheet: ${header.sheet}), ` : ', ');
          AllowedHeaders.pop();
        } else {
          str += header.header + (header.sheet != null ? `(sheet: ${header.sheet}), ` : ', ');
        }
      });
      str = str.substr(0, str.length - 2) + ']';
    }
    return str;
  }

}

const AllowedHeaders: string[] = [
  'PROVIDERID',
  'PAYERID',
  'PROVCLAIMNO',
  'MEMBERID',
  'NATIONALID',
  'POLICYNO',
  'FULLNAME',
  'PATFILENO',
  'ACCCODE',
  'MEMBERDOB',
  'MEMBERAGE',
  'UNITAGE',
  'GENDER',
  'NATIONALITY',
  'PHYID',
  'PHYNAME',
  'PHYCATEGORY',
  'DEPTCODE',
  'VISITTYPE',
  'CLAIMDATE',
  'CLAIMTYPE',
  'ELIGREFNO',
  'APPREFNO',
  'ADMISSIONDATE',
  'DISCHARGEDATE',
  'LENGTHOFSTAY',
  'UNITOFSTAY',
  'ROOMNO',
  'BEDNO',
  'MAINSYMPTOM',
  'SIGNIFICANTSIGN',
  'OTHERCOND',
  'DURATIONOFILLNESS',
  'UNITOFILLNESSDURATION',
  'TEMPERATURE',
  'BLOODPRESSURE',
  'PULSE',
  'RESPIRATORYRATE',
  'WEIGH',
  'HEIGHT',
  'COMMREPORT',
  'RADIOLOGYREPORT',
  // 'DIAGNOSISCODE',
  // 'DIAGNOSISDESC',
  'INVOICENO',
  'SERVICECODE',
  'SERVICEDESC',
  'SERVICEDATE',
  'UNITSERVICEPRICE',
  'UNITSERVICETYPE',
  'QTY',
  'TOOTHNO',
  'TOTSERVICEDISC',
  'TOTSERVICEPATSHARE',
  'TOTSERVICENETVATRATE',
  'TOTSERVICEPATSHAREVATRATE',
  'LABTESTCODE',
  'LABDESC',
  'LABTESTDATE',
  'LABCOMPCODE',
  'LABCOMPDESC',
  'LABRESULT',
  'LABRESULTUNIT',
  'LABRESULTCOMMENT'];

const AllowedHeadersForScrubbing: string[] = [
  'INSURANCE ID(MEMBERID)',
  'PROVIDER CLAIM NUMBER',
  'PATIENT_FILE',
  'NATIONAL ID/IQAMA ',
  'POLICY NUMBER',
  'INSURANCE NAME',
  'POLICY NAME',
  'PATIENT NAME',
  'INVOICE NO.',
  'INVOICE DATE',
  'APPROVAL ID',
  'DOCTOR NAME',
  'SPECIALITY',
  'CHIEF COMPLAIN',
  'SIGNIFICANT SIGNS',
  'ICD10-1',
  'ICD10-2',
  'ICD10-3',
  'ICD10-4',
  'ICD10-5',
  'ICD10-6',
  'ICD10-7',
  'ICD10-8',
  'ICD10-9',
  'ICD10-10',
  'Gender',
  'CLAIM TYPE',
  'TOOTH NUMBER',
  'SERVICE CODE',
  'SERVICE DESCRIPTION',
  'SERVICE TYPE',
  'UNIT PRICE',
  'QUANTITY',
  'GROSS AMOUNT',
  'DISCOUNT',
  'DEDUCTIBLE',
  'NET AMOUNT',
  'VAT AMOUNT 15%',
  'NET + VAT'
];
export type HeadersMap = { sheet?: string, header: string };
