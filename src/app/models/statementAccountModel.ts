import { claimReducer } from '../claim-module-components/store/claim.reducer';

export class StatementAccountSummary {
    searchCriteria: any = '';
    fromDate: any = '';
    toDate: any = '';
    page: number = 0;
    size: number = 10;
    totalPages: number = 0;
}


export class AddStatmentAccountModel {
    statementStartDate: any = '';
    statementEndDate: any = '';
    file: any = '';
}