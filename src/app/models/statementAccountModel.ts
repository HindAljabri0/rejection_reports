import { claimReducer } from '../claim-module-components/store/claim.reducer';

export class StatementAccountSummary {
    criteria: any = '';
    startDate: any = '';
    endDate: any = '';
    pageNo: number;
    pageSize: number;
    totalPages: number
}


export class AddStatmentAccountModel {
    uploadDate: any = '';
    statmentStartDate: any = '';
    statmentEndDate: any = '';
    uploadStatment: any = '';
}