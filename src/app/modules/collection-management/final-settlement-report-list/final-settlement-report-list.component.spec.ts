import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalSettlementReportListComponent } from './final-settlement-report-list.component';

describe('FinalSettlementReportListComponent', () => {
  let component: FinalSettlementReportListComponent;
  let fixture: ComponentFixture<FinalSettlementReportListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalSettlementReportListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalSettlementReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
