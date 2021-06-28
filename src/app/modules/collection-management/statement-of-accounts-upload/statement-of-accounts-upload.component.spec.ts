import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementOfAccountsUploadComponent } from './statement-of-accounts-upload.component';

describe('StatementOfAccountsUploadComponent', () => {
  let component: StatementOfAccountsUploadComponent;
  let fixture: ComponentFixture<StatementOfAccountsUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatementOfAccountsUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatementOfAccountsUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
