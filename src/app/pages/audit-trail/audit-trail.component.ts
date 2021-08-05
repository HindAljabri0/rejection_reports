import { Component, OnInit } from '@angular/core';
import { AuditTrailService } from 'src/app/services/audit/audit-trail.service';
import { Subscription } from 'rxjs';
import { AuditLog } from 'src/app/models/auditLog';
import { FormControl } from '@angular/forms';
import { SharedServices } from 'src/app/services/shared.services';
import { MatDialog } from '@angular/material';
import { JsonViewDialogComponent } from 'src/app/components/dialogs/json-view-dialog/json-view-dialog.component';
import { XmlViewDialogComponent } from 'src/app/components/dialogs/xml-view-dialog/xml-view-dialog.component';

@Component({
  selector: 'app-audit-trail',
  templateUrl: './audit-trail.component.html',
  styleUrls: ['./audit-trail.component.css']
})
export class AuditTrailComponent implements OnInit {

  logs: AuditLog[] = [];
  filteredlogs: AuditLog[] = [];
  exampleFilterLog: AuditLog = new AuditLog();

  lastResultSize = 0;
  filterLastResultSize = 0;

  objectIdControl: FormControl = new FormControl();
  userIdControl: FormControl = new FormControl();
  providerIdControl: FormControl = new FormControl();
  eventTypeControl: FormControl = new FormControl();
  beforeDateControl: FormControl = new FormControl();

  types: { value: string, text: string }[];

  watchLogsSubscription: Subscription;

  constructor(private auditTrailService: AuditTrailService, private commenService: SharedServices, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.types = [
      { value: 'GenericAuditLogType', text: 'Generic' },
      { value: 'ClaimManipulationAuditLogType', text: 'ClaimManipulation' },
      { value: 'ClaimSubmissionAuditLogType', text: 'ClaimSubmission' },
      { value: 'UploadAuditLogType', text: 'Upload' },
      { value: 'LoginAuditLogType', text: 'Login' },
      { value: 'ClaimSubmissionRequestAuditLogType', text: 'ClaimSubmissionRequest' },
      { value: 'ClaimSubmissionResponseAuditLogType', text: 'ClaimSubmissionResponse' },
    ];
    this.commenService.loadingChanged.next(true);
    this.auditTrailService.getAllLogs().subscribe(value => {
      const auditLogs = value as AuditLog[];
      this.lastResultSize = auditLogs.length;
      auditLogs.map(log => this.logs.push(new AuditLog().deserialize(log)));
      this.commenService.loadingChanged.next(false);
      this.watchLogs();
    }, error => {
      this.commenService.loadingChanged.next(false);
    });
  }

  watchLogs() {
    this.watchLogsSubscription = this.auditTrailService._logWatchSource.subscribe(value => {
      if (value !== null && value.id != null) {
        this.logs.unshift(value);
        if (this.matchsCurrentFilter(value)) {
          this.filteredlogs.unshift(value);
        }
      }
    });
  }

  stopWatchingLogs() {
    this.auditTrailService.stopWatchingLogs();
    this.watchLogsSubscription.unsubscribe();
  }

  reWatchLogs() {
    this.commenService.loadingChanged.next(true);
    this.auditTrailService.getAllLogs(this.exampleFilterLog, 10, this.logsArray[0].eventTimeStamp, true).subscribe(value => {
      const auditLogs = value as AuditLog[];
      auditLogs.map(log => this.logsArray.unshift(new AuditLog().deserialize(log)));
      this.commenService.loadingChanged.next(false);
      this.auditTrailService.startWatchingLogs();
      this.watchLogs();
    }, error => {
      this.commenService.loadingChanged.next(false);
    });
  }

  filter() {
    if (this.commenService.loading) {
      return;
    }
    let doFilter = false;
    if (this.objectIdControl.value != null && this.objectIdControl.value != '') {
      this.exampleFilterLog.objectId = this.objectIdControl.value;
      doFilter = true;
    }
    if (this.userIdControl.value != null && this.userIdControl.value != '') {
      this.exampleFilterLog.userId = this.userIdControl.value;
      doFilter = true;
    }
    if (this.providerIdControl.value != null && this.providerIdControl.value != '') {
      this.exampleFilterLog.providerId = this.providerIdControl.value;
      doFilter = true;
    }
    if (this.eventTypeControl.value != null && this.eventTypeControl.value != '') {
      this.exampleFilterLog.eventType = this.eventTypeControl.value;
      doFilter = true;
    }
    let beforeDate: Date = null;
    if (this.beforeDateControl.value != null && this.beforeDateControl.value != '') {
      beforeDate = new Date(this.beforeDateControl.value);
      doFilter = true;
    }

    if (doFilter) {
      this.filteredlogs = [];
      this.exampleFilterLog.id = 7;
      this.commenService.loadingChanged.next(true);
      this.auditTrailService.getAllLogs(this.exampleFilterLog, 10, beforeDate).subscribe(value => {
        const auditLogs = value as AuditLog[];
        this.filterLastResultSize = auditLogs.length;
        auditLogs.map(log => this.filteredlogs.push(new AuditLog().deserialize(log)));
        this.commenService.loadingChanged.next(false);
      }, error => {
        this.commenService.loadingChanged.next(false);
      });
    }
  }

  clear() {
    this.filteredlogs = [];
    this.exampleFilterLog = new AuditLog();
    this.objectIdControl.setValue('');
    this.userIdControl.setValue('');
    this.providerIdControl.setValue('');
    this.eventTypeControl.setValue('');
    this.beforeDateControl.setValue('');
    this.filterLastResultSize = 0;
  }

  loadMore() {
    this.commenService.loadingChanged.next(true);
    this.auditTrailService.getAllLogs(this.exampleFilterLog,
      10, this.logsArray[this.logsArray.length - 1].eventTimeStamp).subscribe(value => {
        const auditLogs = value as AuditLog[];
        this.setLastResultSize(auditLogs.length);
        auditLogs.map(log => this.logsArray.push(new AuditLog().deserialize(log)));
        this.commenService.loadingChanged.next(false);
      }, error => {
        this.commenService.loadingChanged.next(false);
      });
  }

  matchsCurrentFilter(value: AuditLog): boolean {
    let objectIdMatches = true;
    let userIdMatches = true;
    let providerIdMatches = true;
    let eventTypeMatches = true;
    if (this.exampleFilterLog.objectId != null) {
      objectIdMatches = this.exampleFilterLog.objectId == value.objectId;
    }
    if (this.exampleFilterLog.userId != null) {
      userIdMatches = this.exampleFilterLog.userId == value.userId;
    }
    if (this.exampleFilterLog.providerId != null) {
      providerIdMatches = this.exampleFilterLog.providerId == value.providerId;
    }
    if (this.exampleFilterLog.eventType != null) {
      eventTypeMatches = this.exampleFilterLog.eventType.replace('AuditLogType', '') == value.eventType;
    }
    return objectIdMatches && userIdMatches && providerIdMatches && eventTypeMatches;
  }

  viewJSON(objectId: string, json: string) {
    this.dialog.open(JsonViewDialogComponent, {
      panelClass: ['primary-dialog', 'dialog-lg'],
      data: {
        title: `JSON of Claim [${objectId}]`,
        json
      }
    });
  }

  get isFiltered() {
    return this.exampleFilterLog.id == 7;
  }

  get logsArray() {
    return this.isFiltered ? this.filteredlogs : this.logs;
  }

  setLastResultSize(size: number) {
    this.isFiltered ? this.filterLastResultSize = size : this.lastResultSize = size;
  }

  get isEmpty() {
    return this.logs.length == 0 || (this.isFiltered && this.filteredlogs.length == 0);
  }

  get thereIsMoreToLoad() {
    return this.isFiltered ? this.filterLastResultSize == 10 : this.lastResultSize == 10;
  }

  get loading() {
    return this.commenService.loading;
  }
  viewXml(item) {
    this.dialog.open(XmlViewDialogComponent, {
      panelClass: ['primary-dialog', 'dialog-lg'],
      data: {
        mainData: item,
      }
    });
  }

}
