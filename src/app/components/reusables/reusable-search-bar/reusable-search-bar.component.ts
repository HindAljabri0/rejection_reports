import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Query } from 'src/app/models/searchData/query';
import { QueryType } from 'src/app/models/searchData/queryType';
import { MatMenuTrigger } from '@angular/material';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'reusable-search-bar',
  templateUrl: './reusable-search-bar.component.html',
  styles: []
})
export class ReusableSearchBarComponent implements OnInit {

  @Input() queries: Query[] = [];
  @Input() searchBy: string;

  @Output() onSearch = new EventEmitter();
  @Output() onQueryRemoved = new EventEmitter();

  @ViewChild(MatMenuTrigger, { static: false }) trigger: MatMenuTrigger;

  searchTextControl: FormControl = new FormControl();

  fromDateControl: FormControl = new FormControl();
  fromDateHasError = false;
  toDateControl: FormControl = new FormControl();
  toDateHasError = false;

  fromDate: QueryType = QueryType.DATEFROM;
  toDate: QueryType = QueryType.DATETO;
  text: QueryType = QueryType.TEXT;

  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor() { }

  ngOnInit() {
  }

  remove(query: Query) {
    const index = this.queries.indexOf(query);

    if (index >= 0) {
      this.queries.splice(index, 1);
    }
    switch (query.type) {
      case QueryType.TEXT:
        this.searchTextControl.setValue('');
        break;
      case QueryType.DATEFROM:
      case QueryType.DATETO:
        this.fromDateControl.setValue('');
        this.toDateControl.setValue('');
        break;
    }

    this.onQueryRemoved.emit(query);
  }



  getQueryTypeText(queryType: QueryType): string {
    switch (queryType) {
      case QueryType.TEXT:
        return this.searchBy;
      case QueryType.DATEFROM:
        return 'From Claim Date';
      case QueryType.DATETO:
        return 'To Claim Date';
      default:
        return '';
    }
  }

  queryToText(query: Query) {
    switch (query.type) {
      case QueryType.DATEFROM:
      case QueryType.DATETO:
        return query.content.replace('-', '/').replace('-', '/');
      default:
        return query.content;
    }
  }

  search() {
    this.onSearch.emit(this.queries);
  }
  searchWithText() {
    this.updateChips(QueryType.TEXT, this.searchTextControl.value);
    this.search();
  }

  updateChips(queryType: QueryType, content: string) {
    if (content != null && content.trim().length != 0) {
      const query: Query = this.queries.find(query => query.type == queryType);
      if (query != null) {
        query.content = content.trim();
      } else {
        if (queryType == QueryType.TEXT) {
          this.clear();
        }
        this.queries.push({ type: queryType, content: content.trim() });
      }
    }

    if (queryType != QueryType.TEXT) {
      const query: Query = this.queries.find(query => query.type == QueryType.TEXT);
      if (query != null) { this.remove(query); }
    }
    this.searchTextControl.setValue('', { emitEvent: false });
  }


  get currentTEXT() {
    if (this.searchTextControl.value != null && this.searchTextControl.value.trim().length != 0) {
      return this.searchTextControl.value.trim();
    } else if (this.queries.map(query => query.type == QueryType.TEXT).includes(true)) {
      return this.queries.map(query => { if (query.type == QueryType.TEXT) { return query.content; } });
    } else { return ''; }
  }

  clear() {
    if (this.queries.length != 0) {
      this.queries = [];
      this.onQueryRemoved.emit();
    }
    this.searchTextControl.setValue('');
    this.fromDateControl.setValue('');
    this.toDateControl.setValue('');
  }

}
