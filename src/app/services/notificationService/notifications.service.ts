import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private httpClient:HttpClient) { }

  getNotifications(providerId:string, page:number, pageSize:number){
    const requestUrl = `/${providerId}/notifications?page=${page}&size=${pageSize}`;
    const request = new HttpRequest('GET', environment.NotificationServiceHost+requestUrl);
    return this.httpClient.request(request);
  }

  getNotificationsCount(providerId:string, status:string){
    const requestUrl = `/${providerId}/notifications/${status}/count`;
    const request = new HttpRequest('GET', environment.NotificationServiceHost+requestUrl);
    return this.httpClient.request(request);
  }

  // markNotificationAsRead(providerId:string, id:string){
  //   const requestUrl = `/${providerId}/notifications/${id}`;
  //   const request = new HttpRequest('POST', environment.NotificationServiceHost+requestUrl, {read:true});
  //   return this.httpClient.request(request);
  // }

}
