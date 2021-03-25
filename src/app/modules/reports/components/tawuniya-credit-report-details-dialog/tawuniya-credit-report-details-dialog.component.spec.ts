import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TawuniyaCreditReportDetailsDialogComponent } from './tawuniya-credit-report-details-dialog.component';

describe('TawuniyaCreditReportDetailsDialogComponent', () => {
  let component: TawuniyaCreditReportDetailsDialogComponent;
  let fixture: ComponentFixture<TawuniyaCreditReportDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TawuniyaCreditReportDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TawuniyaCreditReportDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
