import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/';
import { environment } from 'src/environments/environment';
import { __values } from 'tslib';
import { FeedbackClass } from '../../components/dialogs/feedback-dialog/feedback.model.component';
import { FeedbackDate } from 'src/app/modules/adminstration/feedback-select-date/feedback-date.model';



@Injectable({
    providedIn: 'root',
})
export class FeedbackService {

    feedbackServiceUrl = `${environment.NotificationServiceHost}/feedback`;
    applicationSettingsUrl = `${environment.NotificationServiceHost}/service/settings`;
    createFeedbackUrl = this.feedbackServiceUrl + '/create';
    httpClient: any;

    constructor(private http: HttpClient) { }


    addFeedback(feedback: FeedbackClass): Observable<FeedbackClass> {
        return this.http.post<FeedbackClass>(this.feedbackServiceUrl + `/${feedback.providerId}/create`, feedback);
    }

    UserFeedbackable(surveyId, userName) {
        const requestUrl = `${environment.NotificationServiceHost}/survey-response/${surveyId}/${userName}`;
        const httpRequest = new HttpRequest('GET', requestUrl);
        return this.http.request(httpRequest);
    }
    downloadExcel(surveyId) {
        const requestUrl = `${environment.NotificationServiceHost}/survey-response/${surveyId}/all`;
        const httpRequest = new HttpRequest('GET', requestUrl);
        return this.http.request(httpRequest);
    }


    getSurvey(page, pageSize) {
        const Url = `${environment.NotificationServiceHost}/survey/all?page=${page}&pageSize=${pageSize}`;
        const httpRequest = new HttpRequest('GET', Url);
        return this.http.request(httpRequest);
    }
    getSurveyId(providerId) {
        const Url = `${environment.NotificationServiceHost}/survey/${providerId}/productName/WCS/view`;
        const httpRequest = new HttpRequest('GET', Url);
        return this.http.request(httpRequest);
    }
    updateSurvey(feedback: FeedbackDate) {
        const requestUrl = `${environment.NotificationServiceHost}/survey/${feedback.surveyId}/manage-survey`;
        const surveyUrl = new HttpRequest('PUT', requestUrl, feedback);
        return this.http.request(surveyUrl);
    }

    // postSurveyDate(feedback: FeedbackDate): Observable<FeedbackDate> {
    //     return this.http.post<FeedbackDate>(`${environment.NotificationServiceHost}/survey/${feedback.surveyId}/manage-survey`, feedback)
    // }
    postSurvey(feedback: FeedbackDate): Observable<FeedbackDate> {
        return this.http.post<FeedbackDate>(`${environment.NotificationServiceHost}/survey/create-survey`, feedback);
    }




}
