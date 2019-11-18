import { Paginateable } from './paginateable';


export class Notification extends Paginateable {
    
    id:number;
    type:string;
    message:string;
    reference:string;
    datetime:Date;
    targetId:string;
    sourceId:string;
    targetUser:string;

    constructor(body:{}){
        super(body);
        if(body != null){
            this.id = body['id'];
            this.type = body['type'];
            this.message = body['message'];
            this.reference = body['reference'];
            this.datetime = body['datetime'];
            this.targetId = body['targetId'];
            this.sourceId = body['sourceId'];
            this.targetUser = body['targetUser'];
        }
    }

}