import { Paginateable } from './paginateable';
import { NotificationTypes } from './notificationsTypes';


export class Notification extends Paginateable {
    id: number;
    type: NotificationTypes;
    message: string;
    reference: string;
    datetime: Date;
    targetId: string;
    sourceId: string;
    targetUser: string;
    status: string;

    object: string[];

    constructor(body: {}) {
        super(body);
        if (body != null) {
            this.id = body['id'];
            this.type = body['type'];
            this.message = body['message'];
            this.reference = body['reference'];
            this.datetime = new Date(body['date'] + '');
            this.targetId = body['targetId'];
            this.sourceId = body['sourceId'];
            this.targetUser = body['targetUser'];
            this.status = body['status'];
            this.object = this.message.split(',');
        }
    }

}
