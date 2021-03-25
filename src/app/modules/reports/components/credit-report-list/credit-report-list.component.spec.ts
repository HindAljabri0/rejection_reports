import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditReportListComponent } from './credit-report-list.component';

describe('CreditReportListComponent', () => {
  let component: CreditReportListComponent;
  let fixture: ComponentFixture<CreditReportListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreditReportListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
