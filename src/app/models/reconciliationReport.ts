export class ReconciliationReport{
    payerId: any = '0';
    startDate = '';
    endDate = '';
    page: number = 0;
    size: number = 10;
}

export class SearchDiscountReconciliationReport{
    payerId: any = '0';
    startDate = '';
    endDate = '';
}


export class AddDiscountReconciliationReport{
    payerId: any = '0';
    startDate :Date;
    endDate  :Date;
    promptDiscount:Number;
    volumeDiscount:Number;
}