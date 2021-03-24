import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TawuniyaCreditReportDetailsComponent } from './tawuniya-credit-report-details.component';

describe('TawuniyaCreditReportDetailsComponent', () => {
  let component: TawuniyaCreditReportDetailsComponent;
  let fixture: ComponentFixture<TawuniyaCreditReportDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TawuniyaCreditReportDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TawuniyaCreditReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
