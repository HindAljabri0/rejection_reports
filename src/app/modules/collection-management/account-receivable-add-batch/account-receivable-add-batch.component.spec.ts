import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountReceivableAddBatchComponent } from './account-receivable-add-batch.component';

describe('AccountReceivableAddBatchComponent', () => {
  let component: AccountReceivableAddBatchComponent;
  let fixture: ComponentFixture<AccountReceivableAddBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountReceivableAddBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountReceivableAddBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
