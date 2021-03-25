import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalSettlementReportDetailsComponent } from './final-settlement-report-details.component';

describe('FinalSettlementReportDetailsComponent', () => {
  let component: FinalSettlementReportDetailsComponent;
  let fixture: ComponentFixture<FinalSettlementReportDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalSettlementReportDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalSettlementReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
