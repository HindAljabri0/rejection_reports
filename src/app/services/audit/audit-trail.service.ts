import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject, Subscriber } from 'rxjs';
import { AuditLog } from 'src/app/models/auditLog';
import {EventSourcePolyfill} from 'ng-event-source';

@Injectable({
  providedIn: 'root'
})
export class AuditTrailService {

  private logWatchSource = new BehaviorSubject(new AuditLog());
  _logWatchSource: Observable<AuditLog> = this.logWatchSource.asObservable();

  private eventSource: EventSourcePolyfill;
  private observer: Subscriber<AuditLog>;

  constructor(private http: HttpClient, private zone: NgZone) {
    this.startWatchingLogs();
  }

  watchNewLogs(): Observable<AuditLog> {
    return new Observable((observer) => {
      let url = environment.auditTrailServiceHost + "/audit-trail/logs/watch";
      let eventSource = new EventSourcePolyfill(url, {headers: {Authorization: `Bearer ${localStorage.getItem('access_token')}`}});
      this.eventSource = eventSource;
      this.observer = observer;
      eventSource.onmessage = (event) => {
        let json = JSON.parse(event.data);
        if (json !== undefined && json !== '') {
          this.zone.run(() => observer.next(json));
        }
      };

      eventSource.onerror = (error) => {
        if (eventSource.readyState === 0) {
          console.debug('The stream has been closed by the server.');
          eventSource.close();
          observer.complete();
        } else {
          observer.error('EventSource error: ' + error);
        }
      }
    });
  }

  startWatchingLogs(){
    this.watchNewLogs().subscribe(data => {
      this.logWatchSource.next(new AuditLog().deserialize(data));
    }, error => console.log('Error: ' + error),
      () => console.log('done loading team stream'));
  }

  stopWatchingLogs(){
    this.eventSource.close();
    this.observer.complete();
  }

  getAllLogs(example?: AuditLog, size?: number, date?: Date, afterDate?:boolean) {
    let params = ``;
    if (size == null) size = 10;
    if(afterDate == null) afterDate = false;
    params = `?size=${size}`
    if (example != null) {
      if (example.objectId != null) params += `&objectId=${example.objectId}`;
      if (example.providerId != null) params += `&providerId=${example.providerId}`;
      if (example.userId != null) params += `&userId=${example.userId}`;
      if (example.eventType != null) params += `&eventType=${example.eventType}`;
    }
    if (date != null) {
      if(!afterDate)
        params += `&beforeDate=${date.getTime()}`;
      else
        params += `&afterDate=${date.getTime()}`;
    }
    return this.http.get(environment.auditTrailServiceHost + `/audit-trail/logs${params}`);
  }
}
