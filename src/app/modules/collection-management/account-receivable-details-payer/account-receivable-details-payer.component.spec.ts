import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountReceivableDetailsPayerComponent } from './account-receivable-details-payer.component';

describe('AccountReceivableDetailsPayerComponent', () => {
  let component: AccountReceivableDetailsPayerComponent;
  let fixture: ComponentFixture<AccountReceivableDetailsPayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountReceivableDetailsPayerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountReceivableDetailsPayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
