import { Paginateable } from './paginateable';

export class Announcement extends Paginateable {
    messageId: number;
    messageDescription: string;
    criteriaType: string;
    criteriaValue: string;

    object: string[];

    constructor(body: {}) {
        super(body);
        if (body != null) {
            this.messageId = body['messageId'];
            this.messageDescription = body['messageDescription'];
            this.criteriaType = body['criteriaType'];
            this.criteriaValue = body['criteriaValue'];
            this.object = this.messageDescription.split(',');
        }
    }

}
