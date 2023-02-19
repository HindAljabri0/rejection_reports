export class FeedbackClass{

    providerId:string;
    userName:string;
    overallSatisfactionQ:number;
    RecommendToFriend:number;
    suggestion:string;
    valid:boolean = false;

    isValid(): boolean{

        if (this.overallSatisfactionQ <0 || this.overallSatisfactionQ == null && this.RecommendToFriend < 0 || this.RecommendToFriend == null){
            return false; //Swap it with enum = {required};
        }else if (this.suggestion.length >5000){
            return false; //Swap it with enum = {LongInput};
        }else{
            return true;
        }
    }
    



}