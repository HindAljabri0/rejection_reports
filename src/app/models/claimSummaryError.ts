import { Paginateable } from './paginateable';

export class ClaimSummaryError extends Paginateable {
    fieldName: string;
    frequency: number;
    ratio: number;
    status: string;
    subStatus: string;
    constructor(json: any = null) {
        if (json !== null) {
            super(json);
            this.fieldName = json.fieldName !== null ? json.fieldName : '';
            this.frequency = json.frequency !== null ? json.frequency : 0;
            this.status = json.status !== null ? json.status : '';
            this.ratio = json.ratio !== null ? +(json.ratio).toFixed(2) : 0;
            this.subStatus = json.subStatus !== null ? json.subStatus : '';
        }
    }
}
