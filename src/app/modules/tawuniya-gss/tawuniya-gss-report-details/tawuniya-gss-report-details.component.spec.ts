import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TawuniyaGssReportDetailsComponent } from './tawuniya-gss-report-details.component';

describe('TawuniyaGssReportDetailsComponent', () => {
  let component: TawuniyaGssReportDetailsComponent;
  let fixture: ComponentFixture<TawuniyaGssReportDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TawuniyaGssReportDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TawuniyaGssReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
