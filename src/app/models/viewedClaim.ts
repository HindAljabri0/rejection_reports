import { Service } from './service';

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
}