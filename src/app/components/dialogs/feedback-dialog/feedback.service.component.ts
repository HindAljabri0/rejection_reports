import { HttpClient, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Console } from "console";
import { Observable } from "rxjs/";
import { map, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { __values } from "tslib";
import { FeedbackClass } from "./feedback.model.component";



@Injectable({
    providedIn:'root',  
})
export class FeedbackService{

    feedbackServiceUrl = `${environment.notificationFeedbackService}/feedback`;
    applicationSettingsUrl = `${environment.notificationFeedbackService}/service/settings`;
    createFeedbackUrl = this.feedbackServiceUrl+'/create';
    
    constructor(private http: HttpClient){}


    addFeedback(feedback:FeedbackClass): Observable<FeedbackClass>{
            const headers = { 'content-type': 'application/json'};  
           
            const body=JSON.stringify(feedback);
           
            return this.http.post<FeedbackClass>(this.createFeedbackUrl, feedback)
    }

    getFeedback(providerId, userName){
        
        let requestUrl =  this.feedbackServiceUrl+`/${providerId}/${userName}/feedback`;
        const httpRequest = new HttpRequest('GET', requestUrl);
        return this.http.request(httpRequest);
    }

    IsValidDate(){
        let startDateDBFieldName = 'start_date';
        let endDateDBFieldName = 'end_date';
        let requestUrl =  this.applicationSettingsUrl+`/application/${startDateDBFieldName}/${endDateDBFieldName}`;
       
        const httpRequest = new HttpRequest('GET', requestUrl);
        return this.http.request(httpRequest);
    }
      
    }
