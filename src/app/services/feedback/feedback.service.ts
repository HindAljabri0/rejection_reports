import { HttpClient, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/";
import { environment } from "src/environments/environment";
import { __values } from "tslib";
import { FeedbackClass } from "../../components/dialogs/feedback-dialog/feedback.model.component";



@Injectable({
    providedIn: 'root',
})
export class FeedbackService {

    feedbackServiceUrl = `${environment.NotificationServiceHost}/feedback`;
    applicationSettingsUrl = `${environment.NotificationServiceHost}/service/settings`;
    createFeedbackUrl = this.feedbackServiceUrl + '/create';

    constructor(private http: HttpClient) { }


    addFeedback(feedback: FeedbackClass): Observable<FeedbackClass> {
        return this.http.post<FeedbackClass>(this.feedbackServiceUrl + `/${feedback.providerId}/create`, feedback)
    }

    UserFeedbackable(providerId, userName) {
        let requestUrl = this.feedbackServiceUrl + `/${providerId}/${userName}/feedback`;
        const httpRequest = new HttpRequest('GET', requestUrl);
        return this.http.request(httpRequest);
    }



}
