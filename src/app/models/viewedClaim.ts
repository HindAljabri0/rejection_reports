import { Service } from './service';
import { ClaimError } from './claimError';
import { ICDDiagnosis } from './ICDDiagnosis';

export class ViewedClaim {
  claimid: number;
  casetype: string;
  physicianname: string;
  net: number;
  unitofnet: string;
  netvatamount: number;
  unitofnetvatamount: string;
  departmentcode: string;
  visitdate: Date;
  provclaimno: string;
  payerclaimrefno: string;
  patientfilenumber: string;
  firstname: string;
  middlename: string;
  lastname: string;
  gender: string;
  approvalnumber: string;
  policynumber: string;
  memberid: string;
  nationalId: string;
  eligibilitynumber: string;
  comments: string;
  batchid: number;
  services: Service[];
  attachments: { attachmentid: string, attachmentfile: string, filename: string, filetype: string, usercomment: string }[];
  errors: ClaimError[];
  diagnosis: ICDDiagnosis[];
  chiefcomplaintsymptoms: string;

  providerId: string;
  payerid: string;
  status: string;

  statusdetail: string;

  patientShare: number;
  discount: number;

}
