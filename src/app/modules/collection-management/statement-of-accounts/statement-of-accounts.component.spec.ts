import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementOfAccountsComponent } from './statement-of-accounts.component';

describe('StatementOfAccountsComponent', () => {
  let component: StatementOfAccountsComponent;
  let fixture: ComponentFixture<StatementOfAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatementOfAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatementOfAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
