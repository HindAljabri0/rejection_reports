import { Contract } from "./Contract";
import { DepartmentModel } from "./DepartmentModel";
import { ServiceModel } from "./ServiceModel";

export class ContractTemplate {
    contract:Contract;
    departments :Array<DepartmentModel>;
    services :Array<ServiceModel>;
}