import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountReceivableDetailsComponent } from './account-receivable-details.component';

describe('AccountReceivableDetailsComponent', () => {
  let component: AccountReceivableDetailsComponent;
  let fixture: ComponentFixture<AccountReceivableDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountReceivableDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountReceivableDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
