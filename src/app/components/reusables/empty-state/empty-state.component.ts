import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styles: []
})
export class EmptyStateComponent implements OnInit {

  @Input() message = 'No data found!';
  @Input() className = '';
  @Input() icon = 'ic-empty-state.svg';

  constructor() { }

  ngOnInit() {
  }

}
