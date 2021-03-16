import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CreditReportSummaryDetailsComponent } from './credit-report-summary-details.component';



describe('CreditReportSummaryDetailsComponent', () => {
  let component: CreditReportSummaryDetailsComponent;
  let fixture: ComponentFixture<CreditReportSummaryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreditReportSummaryDetailsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditReportSummaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
