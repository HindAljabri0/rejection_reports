export class Period {
    years?: number;
    months?: number;
    days?: number;

    constructor(value: number, type: 'years' | 'months' | 'days') {
        if (type == 'years') {
            this.years = value;
        } else if (type == 'months') {
            this.months = value;
        } else if (type == 'days') {
            this.days = value;
        }
    }


    toPeriodFormat() {
        if (this.years != null && !Number.isNaN(this.years)) {
            return `P${this.years}Y`;
        } else if (this.months != null && !Number.isNaN(this.months)) {
            return `P${this.months}M`;
        } else if (this.days != null && !Number.isNaN(this.days)) {
            return `P${this.days}D`;
        }
        return '';
    }
}
