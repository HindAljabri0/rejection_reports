import { Component, OnInit } from '@angular/core';
import { AuditTrailService } from 'src/app/services/audit/audit-trail.service';
import { Observable } from 'rxjs';
import { AuditLog } from 'src/app/models/auditLog';
import { filter, map, timeout } from 'rxjs/operators';

@Component({
  selector: 'app-audit-trail',
  templateUrl: './audit-trail.component.html',
  styleUrls: ['./audit-trail.component.css']
})
export class AuditTrailComponent implements OnInit {

  logs:AuditLog[] = [];

  constructor(private auditTrailService:AuditTrailService) {
  }
  
  ngOnInit() {
    this.getData();
  }

  getData(){
    this.auditTrailService._logWatchSource.subscribe(value => {
      if (value !== undefined && value !== null) {
        this.logs.push(value);
      }
    });
  }


}
