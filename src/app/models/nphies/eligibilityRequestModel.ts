import { LongDateFormatKey } from "moment";


export class EligibilityRequestModel {

    beneficiaryId: number;
	serviceDate: string;
	toDate: string;
	payerNphiesId:string;
	memberCardId: string;
	benefits: boolean;
	discovery: boolean;
	validation: boolean;

}