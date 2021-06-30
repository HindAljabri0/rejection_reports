import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStatementOfAccountsDialogComponent } from './add-statement-of-accounts-dialog.component';

describe('AddStatementOfAccountsDialogComponent', () => {
  let component: AddStatementOfAccountsDialogComponent;
  let fixture: ComponentFixture<AddStatementOfAccountsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStatementOfAccountsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStatementOfAccountsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
