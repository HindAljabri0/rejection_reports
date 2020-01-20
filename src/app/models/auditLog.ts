export class AuditLog {

    id: number;
    userId: string;
    providerId: string;
    objectId: string;
    eventTimeStamp: Date;
    eventType: string;
    eventPath: string;
    eventDescription: string;

}