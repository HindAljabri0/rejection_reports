import { ResponseBenefitModel } from './responseBenefitModel';

export class ResponseItemModel {


    category: string;
    description: string;
    network: string;
    unti: boolean;
    term: string;
    benefits: ResponseBenefitModel[];

}
