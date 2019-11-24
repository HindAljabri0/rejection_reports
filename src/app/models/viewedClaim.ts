import { Service } from './service';
import { ClaimError } from './claimError';
import { ClaimStatus } from './claimStatus';

export class ViewedClaim {

    claimid:number;
    casetype:string;
	physicianname:string;
	net:number;
	unitofnet:string;
	netvatamount:number;
	unitofnetvatamount:string;
	departmentcode:string;
	visitdate:Date;
	provclaimno:string;
	payerclaimrefno:string;
	patientfilenumber:string;
	firstname:string;
	middlename:string;
	lastname:string;
	gender:string;
	approvalnumber:string;
	policynumber:string;
	memberid:string;
	eligibilitynumber:string;
	comments:string;
    batchid:number;
	services:Service[];
	errors:ClaimError[];

	providerId:string;
	payerId:string;
	status:string;

}