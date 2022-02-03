import { benefitModel } from "./benefitModel";
import { contractClass } from "./contractClass";
import { subBenefitModel } from "./subBenefitModel";

export class classCrudRequest{
    contract_class:contractClass;
	
	benefits:Array<benefitModel>;
	
	subBenefits:Array<subBenefitModel>;
	policyId:number;
	providerId:string;
}