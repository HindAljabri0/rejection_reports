import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsLogComponent } from './transactions-log.component';

describe('TransactionsLogComponent', () => {
  let component: TransactionsLogComponent;
  let fixture: ComponentFixture<TransactionsLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionsLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
