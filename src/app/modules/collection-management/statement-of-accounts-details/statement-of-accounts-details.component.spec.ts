import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementOfAccountsDetailsComponent } from './statement-of-accounts-details.component';

describe('StatementOfAccountsDetailsComponent', () => {
  let component: StatementOfAccountsDetailsComponent;
  let fixture: ComponentFixture<StatementOfAccountsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatementOfAccountsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatementOfAccountsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
