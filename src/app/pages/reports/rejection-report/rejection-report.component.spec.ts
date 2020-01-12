import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectionReportComponent } from './rejection-report.component';

describe('RejectionReportComponent', () => {
  let component: RejectionReportComponent;
  let fixture: ComponentFixture<RejectionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
