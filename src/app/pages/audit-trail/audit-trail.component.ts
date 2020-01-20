import { Component, OnInit } from '@angular/core';
import { AuditTrailService } from 'src/app/services/audit/audit-trail.service';
import { Observable } from 'rxjs';
import { AuditLog } from 'src/app/models/auditLog';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-audit-trail',
  templateUrl: './audit-trail.component.html',
  styleUrls: ['./audit-trail.component.css']
})
export class AuditTrailComponent implements OnInit {

  logs:Observable<Array<AuditLog>>;

  constructor(private auditTrailService:AuditTrailService) { }
  
  ngOnInit() {
    
  }

  getData(){
    this.logs = this.auditTrailService.getAllLogs();
  }

}
