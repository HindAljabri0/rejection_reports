import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';


@Component({
    selector: 'app-accounts-receivable-list',
    templateUrl: './accounts-receivable-list.component.html',
    styles: []
})
export class AccountsReceivableListComponent implements OnInit {
    datePickerConfig: Partial<BsDatepickerConfig> = { dateInputFormat: 'YYYY' };
    YearDatePickerTitle = 'year';
    constructor() { }

    ngOnInit() {
    }



    onOpenCalendar(container) {
            container.yearSelectHandler = (event: any): void => {
                container._store.dispatch(container._actions.select(event.date));
            };
            container.setViewMode('year');
        
    }
}