import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TawuniyaGssGenerateReportDialogComponent } from './tawuniya-gss-generate-report-dialog.component';

describe('TawuniyaGssGenerateReportDialogComponent', () => {
  let component: TawuniyaGssGenerateReportDialogComponent;
  let fixture: ComponentFixture<TawuniyaGssGenerateReportDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TawuniyaGssGenerateReportDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TawuniyaGssGenerateReportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
