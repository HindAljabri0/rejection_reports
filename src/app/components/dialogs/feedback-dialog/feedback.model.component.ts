export class FeedbackClass {

    providerId: string;
    userName: string;
    overallSatisfaction: number;
    recommendToFriend: number;
    suggestion: string;

    isOverallSatisfactionValid: boolean = false;
    isRecommendToFriend: boolean = false;
    isSuggestionValid: boolean = true;
}