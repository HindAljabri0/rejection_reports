export class TwaniyaErrorDescription {
    data: TwaniyaError[];
    pageNo: number;
    pageSize: number;
    totalPages: number;
}

export class TwaniyaError {
    code: string;
    description: string;
    datetime: Date;
    batchreferenceno: string;
    connecttransactionid: number;
}
