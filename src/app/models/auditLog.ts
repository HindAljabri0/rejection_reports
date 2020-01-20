export class AuditLog {

    id: number;
    userId: string;
    providerId: string;
    objectId: string;
    eventTimeStamp: Date;
    eventType: string;
    eventPath: string;
    eventDescription: string;

    deserialize(input: any): this {
        Object.assign(this, input);
        this.eventTimeStamp = new Date(this.eventTimeStamp);
        this.eventType = this.eventType.replace("AuditLogType", "");
        return this;
      }

}