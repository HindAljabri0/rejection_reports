import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentsReportComponent } from './attachments-report.component';

describe('AttachmentsReportComponent', () => {
  let component: AttachmentsReportComponent;
  let fixture: ComponentFixture<AttachmentsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachmentsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
