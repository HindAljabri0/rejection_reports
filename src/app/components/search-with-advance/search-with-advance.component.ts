import { Component, OnInit, ViewChild, SystemJsNgModuleLoader } from '@angular/core';
import { Query } from 'src/app/models/searchData/query';
import { QueryType } from 'src/app/models/searchData/queryType';
import { Router, RouterEvent, NavigationEnd, ActivatedRoute } from '@angular/router';
import { SharedServices } from 'src/app/services/shared.services';
import { MatMenuTrigger, MatDatepickerInputEvent, MatSelectChange, MatChipInputEvent } from '@angular/material';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { filter } from 'rxjs/operators';
import { query } from '@angular/animations';
import { AuthService } from 'src/app/services/authService/authService.service';

@Component({
  selector: 'app-search-with-advance',
  templateUrl: './search-with-advance.component.html',
  styleUrls: ['./search-with-advance.component.css']
})
export class SearchWithAdvanceComponent implements OnInit {

  queries: Query[] = [];
  payers: { id: number, name: string }[];
  casetypes: { value: string, name: string }[] = [
    { value: "OUTPATIENT,INPATIENT", name: "Any" },
    { value: "OUTPATIENT", name: "Outpatient" },
    { value: "INPATIENT", name: "Inpatient" },
  ];
  @ViewChild(MatMenuTrigger, {static: false}) trigger: MatMenuTrigger;

  searchControl: FormControl = new FormControl();

  fromDateControl: FormControl = new FormControl();
  fromDateHasError: boolean = false;
  toDateControl: FormControl = new FormControl();
  toDateHasError: boolean = false;
  payerIdControl: FormControl = new FormControl();
  payerIdHasError: boolean = false;
  outpatientControl: boolean = true;
  inpatientControl: boolean = true;

  fromDate: QueryType = QueryType.DATEFROM;
  toDate: QueryType = QueryType.DATETO;
  payerId: QueryType = QueryType.PAYERID;
  batchId: QueryType = QueryType.BATCHID;
  casetype: QueryType = QueryType.CASETYPE;

  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(private router: Router, private routeActive: ActivatedRoute, private commen: SharedServices, private authService: AuthService) {
    this.authService.isUserNameUpdated.subscribe((isUpdated) => {
      if (isUpdated) {
        this.payers = this.commen.getPayersList();
      }
    });
  }

  ngOnInit() {
    this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.payers = this.commen.getPayersList();
      if (this.queries.length != 0) this.searchControl.setValue(' ');
      else this.searchControl.setValue('');
      if (this.router.url.includes('claims')) {
        this.routeActive.queryParams.subscribe(value => {
          if (value.from != null) {
            const str = value.from.split('-');
            const date = new Date(str[0] + '/' + str[1] + '/' + str[2]);
            this.fromDateControl.setValue(date);
            this.updateChips(QueryType.DATEFROM, str[2] + '/' + str[1] + '/' + str[0]);
          }
          if (value.to != null) {
            const str = value.to.split('-');
            const date = new Date(str[0] + '/' + str[1] + '/' + str[2]);
            this.toDateControl.setValue(date);
            this.updateChips(QueryType.DATETO, str[2] + '/' + str[1] + '/' + str[0]);
          }
          if (value.payer != null) {
            this.payerIdControl.setValue(Number.parseInt(value.payer));
            this.updateChips(QueryType.PAYERID, value.payer);
          }
          if (value.casetype != null) {
            switch (value.casetype) {
              case this.casetypes[1].value:
                this.outpatientControl = true;
                this.inpatientControl = false;
                this.updateChips(QueryType.CASETYPE, value.casetype);
                break;
              case this.casetypes[2].value:
                this.outpatientControl = false;
                this.inpatientControl = true;
                this.updateChips(QueryType.CASETYPE, value.casetype);
                break;
            }
          }
          if (value.batchId != null && (this.queries[0] == null || this.queries[0].content != value.batchId)) {
            this.updateChips(QueryType.BATCHID, value.batchId);
          }
        });
      }
      else {
        this.clear();
      }
    });
  }

  remove(query: Query) {
    const index = this.queries.indexOf(query);

    if (index >= 0) {
      this.queries.splice(index, 1);
    }
    switch (query.type) {
      case QueryType.BATCHID:
        this.toDateControl.setValue('');
        break;
      case QueryType.PAYERID:
        this.payerIdControl.setValue('');
        break;
      case QueryType.DATEFROM:
        this.fromDateControl.setValue('');
        break;
      case QueryType.DATETO:
        this.toDateControl.setValue('');
        break;
    }
    if (this.queries.length == 0) {
      this.searchControl.setValue('');
    }
  }



  getQueryTypeText(queryType: QueryType): string {
    switch (queryType) {
      case QueryType.BATCHID:
        return "Batch ID"
      case QueryType.PAYERID:
        return "Payer"
      case QueryType.DATEFROM:
        return "From Claim Date"
      case QueryType.DATETO:
        return "To Claim Date"
      case QueryType.CASETYPE:
        return "Case Type";
      default:
        return "";
    }
  }

  queryToText(query: Query) {
    switch (query.type) {
      case QueryType.PAYERID:
        return this.payers.find(value => `${value.id}` == query.content).name
      case QueryType.DATEFROM:
      case QueryType.DATETO:
        return query.content.replace('-', '/').replace('-', '/');
      default:
        return query.content;
    }
  }

  search() {
    this.fromDateHasError = true;
    this.toDateHasError = true;
    this.payerIdHasError = true;
    if (this.queries.map(value => value.type == QueryType.DATEFROM || value.type == QueryType.DATETO || value.type == QueryType.PAYERID).includes(true)) {
      if (this.fromDateControl.invalid || this.fromDateControl.value == null) {
        this.trigger.openMenu();
        this.fromDateHasError = true;
      } else if (this.toDateControl.invalid || this.toDateControl.value == null) {
        this.trigger.openMenu();
        this.toDateHasError = true;
      } else if (this.payerIdControl.invalid || this.payerIdControl.value == null) {
        this.trigger.openMenu();
        this.payerIdHasError = true;
      } else {
        let fromDate = new Date(this.fromDateControl.value);
        let toDate = new Date(this.toDateControl.value);
        const from = fromDate.getFullYear() + '-' + (fromDate.getMonth() + 1) + '-' + fromDate.getDate();
        const to = toDate.getFullYear() + '-' + (toDate.getMonth() + 1) + '-' + toDate.getDate();
        const payer = this.payerIdControl.value;
        let selectedCasetype: string;
        if (this.outpatientControl && !this.inpatientControl) {
          selectedCasetype = this.casetypes[1].value;
        } else if (!this.outpatientControl && this.inpatientControl) {
          selectedCasetype = this.casetypes[2].value;
        }
        let queryParams: any = { from: from, to: to, payer: payer }
        if (selectedCasetype != null) queryParams.casetype = selectedCasetype;
        this.router.navigate([this.commen.providerId, 'claims'], { queryParams: queryParams });
      }
    } else if (this.queries.length == 1 && this.queries.map(value => value.type == QueryType.BATCHID).includes(true)) {
      let batchId = this.queries.find(query => query.type == QueryType.BATCHID).content;
      this.router.navigate([this.commen.providerId, 'claims'], { queryParams: { batchId: batchId } });
    } else {
      this.trigger.openMenu();
    }
  }

  updateChips(queryType: QueryType, content: string) {
    content = `${content}`;
    if (content != null && content.trim().length != 0) {
      let query: Query = this.queries.find(query => query.type == queryType);
      if (query != null) {
        query.content = content.trim();
      } else {
        if (queryType == QueryType.BATCHID) this.clear();
        this.queries.push({ type: queryType, content: content.trim() });
      }
    }
    if (queryType == QueryType.BATCHID) {
    } else {
      let query: Query = this.queries.find(query => query.type == QueryType.BATCHID);
      if (query != null) this.remove(query);
    }
    this.searchControl.setValue(" ");
  }

  searchWithBatchId() {
    this.router.navigate([this.commen.providerId, 'claims'], { queryParams: { batchId: this.currentBatchId } });
  }

  get currentBatchId() {
    if (this.searchControl.value != null && this.searchControl.value != ' ') {
      return this.searchControl.value.trim();
    } else if (this.queries.map(query => query.type == QueryType.BATCHID).includes(true)) {
      return this.queries.map(query => { if (query.type == QueryType.BATCHID) return query.content; })
    } else return '';
  }

  toggleSelectionOutpatient() {
    this.outpatientControl = !this.outpatientControl;
    this.editCaseTypeChip();
  }

  toggleSelectionInpatient() {
    this.inpatientControl = !this.inpatientControl;
    this.editCaseTypeChip();
  }

  editCaseTypeChip() {
    if(this.outpatientControl && this.inpatientControl){
      const query = this.queries.find(query => query.type == QueryType.CASETYPE);
      if(query != null)  
        this.remove(query)
    } else if (this.outpatientControl){
      this.updateChips(QueryType.CASETYPE, this.casetypes[1].value)
    }else if (this.inpatientControl){
      this.updateChips(QueryType.CASETYPE, this.casetypes[2].value)
    }
  }

  clear() {
    this.queries = [];
    this.searchControl.setValue('');
    this.fromDateControl.setValue('');
    this.toDateControl.setValue('');
    this.payerIdControl.setValue('');
  }

}




