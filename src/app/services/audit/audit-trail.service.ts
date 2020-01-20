import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuditLog } from 'src/app/models/auditLog';

@Injectable({
  providedIn: 'root'
})
export class AuditTrailService {

  logs:AuditLog[] = [];

  constructor() { }

  getAllLogs():Observable<Array<AuditLog>> {
    this.logs = [];
    return Observable.create((observer) => {
      let url = environment.auditTrailServiceHost+"/audit-trail/trail";

      let eventSource = new EventSource(url);
      eventSource.onmessage = (event) => {
        console.debug('Received event: ', event);
        let json = JSON.parse(event.data);
        this.logs.push(json as AuditLog);
        observer.next(this.logs);
        console.debug('next');
      };
      eventSource.onerror = (error) => {
        // readyState === 0 (closed) means the remote source closed the connection,
        // so we can safely treat it as a normal situation. Another way of detecting the end of the stream
        // is to insert a special element in the stream of events, which the client can identify as the last one.
        if(eventSource.readyState === 0) {
          console.log(error);
          console.log('The stream has been closed by the server.');
          eventSource.close();
          observer.complete();
        } else {
          observer.error('EventSource error: ' + error);
        }
      }
    });
  }
}
