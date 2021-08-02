
export class PayerStatementModel {
    statementId: any;
    fromDate: any = '';
    toDate: any = '';
    page: number = 0;
    pageSize: number = 10;
    totalPages: number = 0;
    payer: any = "0";
}

export class AddPayerStatmentModel {
    statementId: number;
    payerId: number;
    paymentDate: any;
    amount: number;
}