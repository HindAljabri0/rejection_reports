import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject, Subscriber, Subject } from 'rxjs';
import { EventSourcePolyfill } from 'ng-event-source';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementsService {

  private messageWatchSources: BehaviorSubject<string>[] = new Array<BehaviorSubject<string>>();
  _messageWatchSources: Observable<string>[] = new Array<Observable<string>>();

  private eventSources: EventSourcePolyfill[] = [];
  private observers: Subscriber<string>[] = [];

  constructor(private httpClient: HttpClient, private zone: NgZone) { }

  getAnnouncements(providerId: string, payerids: number[], page: number, pageSize: number) {
    const requestUrl = `/announcements/${providerId}/${payerids}?page=${page}&size=${pageSize}`;
    const request = new HttpRequest('GET', environment.adminServiceHost + requestUrl);
    return this.httpClient.request(request);
  }

  getAnnouncementsCount(providerId: string, payerids: number[]) {
    const requestUrl = `/announcements/${providerId}/${payerids}/count`;
    const request = new HttpRequest('GET', environment.adminServiceHost + requestUrl);
    return this.httpClient.request(request);
  }

  /* markAnnouncementAsRead(providerId: string, payerids: string) {
      const requestUrl = `/portal-notifications/${providerId}/${payerids}`;
      const request = new HttpRequest('PUT', environment.adminServiceHost + requestUrl, {});
      return this.httpClient.request(request);
    }

    private watchNewMessage(providerId: string, topic: string): Observable<string> {
      return new Observable((observer) => {
        let url = environment.NotificationServiceHost + `/to/${providerId}/topics/${topic}`;
        let eventSource = new EventSourcePolyfill(url, { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } });
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
        }
      });
    }

    startWatchingMessages(providerId: string, topic: string) {
      if (this.eventSources[topic] != null) return;
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
  */
}
