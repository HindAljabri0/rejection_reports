import { Component, OnInit } from '@angular/core';
import { AuditTrailService } from 'src/app/services/audit/audit-trail.service';
import { Observable } from 'rxjs';
import { AuditLog } from 'src/app/models/auditLog';
import { filter, map, timeout } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-audit-trail',
  templateUrl: './audit-trail.component.html',
  styleUrls: ['./audit-trail.component.css']
})
export class AuditTrailComponent implements OnInit {

  logs:AuditLog[] = [];

  userIdControl:FormControl = new FormControl();
  eventTypeControl:FormControl = new FormControl();
  fromDateControl:FormControl = new FormControl();
  toDateControl:FormControl = new FormControl();

  types:{value:string, text:string}[];

  constructor(private auditTrailService:AuditTrailService) {
  }
  
  ngOnInit() {
    this.types = [
      {value: "GenericAuditLogType", text: "Generic"},
      {value: "ClaimManipulationAuditLogType", text: "ClaimManipulation"},
      {value: "ClaimSubmissionAuditLogType", text: "ClaimSubmission"},
      {value: "UploadAuditLogType", text: "Upload"},
      {value: "LoginAuditLogType", text: "Login"},
    ];
    this.auditTrailService.getAllLogs().subscribe(value => {
      let auditLogs = value as AuditLog[];
      auditLogs.map(log => this.logs.unshift(new AuditLog().deserialize(log)));
      this.getData();
    });
  }

  getData(){
    this.auditTrailService._logWatchSource.subscribe(value => {
      if (value !== undefined && value !== null) {
        this.logs.unshift(value);
      }
    });
  }

  filter(){
    
  }

}
