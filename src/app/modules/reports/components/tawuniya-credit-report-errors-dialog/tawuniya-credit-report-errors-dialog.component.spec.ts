import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TawuniyaCreditReportErrorsDialogComponent } from './tawuniya-credit-report-errors-dialog.component';

describe('TawuniyaCreditReportErrorsDialogComponent', () => {
  let component: TawuniyaCreditReportErrorsDialogComponent;
  let fixture: ComponentFixture<TawuniyaCreditReportErrorsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TawuniyaCreditReportErrorsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TawuniyaCreditReportErrorsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
