import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditReportCreateComponent } from './credit-report-create.component';

describe('CreditReportCreateComponent', () => {
  let component: CreditReportCreateComponent;
  let fixture: ComponentFixture<CreditReportCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreditReportCreateComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditReportCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
