import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountReceivableAddMonthComponent } from './account-receivable-add-month.component';

describe('AccountReceivableAddMonthComponent', () => {
  let component: AccountReceivableAddMonthComponent;
  let fixture: ComponentFixture<AccountReceivableAddMonthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountReceivableAddMonthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountReceivableAddMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
