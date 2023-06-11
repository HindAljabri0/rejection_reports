import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject, Subscriber, Subject } from 'rxjs';
import { EventSourcePolyfill } from 'ng-event-source';
import { AnnouncementNotification } from 'src/app/models/announcementNotification';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private messageWatchSources: BehaviorSubject<string>[] = new Array<BehaviorSubject<string>>();
  _messageWatchSources: Observable<string>[] = new Array<Observable<string>>();

  private eventSources: EventSourcePolyfill[] = [];
  private observers: Subscriber<string>[] = [];

  constructor(private httpClient: HttpClient, private zone: NgZone) { }

  getNotifications(providerId: string, type: string, page: number, pageSize: number) {
    const requestUrl = `/providers/${providerId}/${type}?page=${page}&size=${pageSize}`;
    const request = new HttpRequest('GET', environment.NotificationServiceHost + requestUrl);
    return this.httpClient.request(request);
  }

  getNotificationsCount(providerId: string, type: string, status: string) {
    const requestUrl = `/providers/${providerId}/${type}/count/${status}`;
    const request = new HttpRequest('GET', environment.NotificationServiceHost + requestUrl);
    return this.httpClient.request(request);
  }

  getNotificationsCountByWeek(providerId: string, type: string, status: string) {
    const requestUrl = `/providers/${providerId}/${type}/count/by-week`;
    const request = new HttpRequest('GET', environment.NotificationServiceHost + requestUrl);
    return this.httpClient.request(request);
  }

  markNotificationAsRead(providerId: string, id: string) {
    const requestUrl = `/providers/${providerId}/${id}`;
    const request = new HttpRequest('PUT', environment.NotificationServiceHost + requestUrl, {});
    return this.httpClient.request(request);
  }

  markAllNotificationAsRead(providerId: string, notificationType: string) {
    const requestUrl = `/providers/${providerId}/markAllRead/${notificationType}`;
    const request = new HttpRequest('PUT', environment.NotificationServiceHost + requestUrl, {});
    return this.httpClient.request(request);
  }

  private watchNewMessage(providerId: string, topic: string): Observable<string> {
    return new Observable((observer) => {
      const url = environment.NotificationServiceHost + `/to/${providerId}/topics/${topic}`;
      const eventSource = new EventSourcePolyfill(url, { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } });
      this.eventSources[topic] = eventSource;
      this.observers[topic] = observer;
      this.eventSources[topic].onmessage = (event) => {
        this.zone.run(() => this.observers[topic].next(event.data));
      };

      this.eventSources[topic].onerror = (error) => {
        if (this.eventSources[topic].readyState === 0) {
          console.debug('The stream has been closed by the server.');
          this.eventSources[topic].close();
          this.observers[topic].complete();
        } else {
          this.observers[topic].error('EventSource error: ' + error);
        }
      };
    });
  }

  startWatchingMessages(providerId: string, topic: string) {
    if (this.eventSources[topic] != null) {
      return;
    }
    this.messageWatchSources[topic] = new BehaviorSubject('');
    this._messageWatchSources[topic] = this.messageWatchSources[topic].asObservable();
    this.watchNewMessage(providerId, topic).subscribe(data => {
      this.messageWatchSources[topic].next(data);
    }, error => console.log('Error: ' + error),
      () => console.log('done loading team stream')
    );
  }

  stopWatchingMessages(topic: string) {
    if (this.eventSources[topic] != undefined) {
      this.eventSources[topic].close();
      this.observers[topic].complete();
      this.eventSources[topic] = null;
      this.observers[topic] = null;
      delete this.eventSources[topic];
      delete this.observers[topic];
    }
  }

  getAllAnnouncements(page: Number, pageSize: Number) {
    const requestUrl = `/announcement?page=${page}&pageSize=${pageSize}`;
    const request = new HttpRequest('GET', environment.NotificationServiceHost + requestUrl, {});
    return this.httpClient.request(request);
  }

  createAnnouncement(announcement: AnnouncementNotification) {
    const requestUrl = `/announcement/create`;
    let body = announcement;
    const request = new HttpRequest('POST', environment.NotificationServiceHost + requestUrl, body);
    return this.httpClient.request(request);
  }

  deleteAnnouncement(announcementId: string) {
    const requestUrl = `/announcement/announcementId/${announcementId}`;
    const request = new HttpRequest('DELETE', environment.NotificationServiceHost + requestUrl);
    return this.httpClient.request(request);
  }

  getAnnouncement(announcementId: string) {
    const requestUrl = `/announcement/announcementId/${announcementId}`;
    const request = new HttpRequest('GET', environment.NotificationServiceHost + requestUrl, {});
    return this.httpClient.request(request);
  }
}
