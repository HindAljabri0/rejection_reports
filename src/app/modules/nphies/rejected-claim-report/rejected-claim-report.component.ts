import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-rejected-claim-report',
    templateUrl: './rejected-claim-report.component.html',
    styles: []
})
export class RejectedClaimReportComponent implements OnInit {
    advanceSearchEnable = false;

    constructor() { }

    ngOnInit() {
    }

    toggleAdvanceSearch() {
        this.advanceSearchEnable = !this.advanceSearchEnable;
    }
}
