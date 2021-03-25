import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditReportUploadModalComponent } from './credit-report-upload-modal.component';

describe('CreditReportUploadModalComponent', () => {
  let component: CreditReportUploadModalComponent;
  let fixture: ComponentFixture<CreditReportUploadModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreditReportUploadModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditReportUploadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
