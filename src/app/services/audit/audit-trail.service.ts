import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuditLog } from 'src/app/models/auditLog';

@Injectable({
  providedIn: 'root'
})
export class AuditTrailService {

  private logWatchSource = new BehaviorSubject(new AuditLog());
  _logWatchSource: Observable<AuditLog> = this.logWatchSource.asObservable();

  constructor(private http: HttpClient, private zone: NgZone) {
    this.watchNewLogs().subscribe(data => {
      this.logWatchSource.next(new AuditLog().deserialize(data));
    }, error => console.log('Error: ' + error),
      () => console.log('done loading team stream'));
  }

  watchNewLogs(): Observable<AuditLog> {
    return new Observable((observer) => {
      let url = environment.auditTrailServiceHost + "/audit-trail/watch";
      let eventSource = new EventSource(url);

      eventSource.onmessage = (event) => {
        let json = JSON.parse(event.data);
        if (json !== undefined && json !== '') {
          this.zone.run(() => observer.next(json));
        }
      };

      eventSource.onerror = (error) => {
        if (eventSource.readyState === 0) {
          console.log('The stream has been closed by the server.');
          eventSource.close();
          observer.complete();
        } else {
          observer.error('EventSource error: ' + error);
        }
      }
    });
  }

  getAllLogs(){
    return this.http.get(environment.auditTrailServiceHost+'/audit-trail/trail');
  }
}
