import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CreditReportCreateConfirmDialogComponent } from './credit-report-create-confirm-dialog.component';



describe('CreditReportCreateConfirmDialogComponent', () => {
  let component: CreditReportCreateConfirmDialogComponent;
  let fixture: ComponentFixture<CreditReportCreateConfirmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreditReportCreateConfirmDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditReportCreateConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
