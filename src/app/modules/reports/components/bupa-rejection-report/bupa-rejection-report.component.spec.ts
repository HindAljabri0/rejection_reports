import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BupaRejectionReportComponent } from './bupa-rejection-report.component';

describe('BupaRejectionReportComponent', () => {
  let component: BupaRejectionReportComponent;
  let fixture: ComponentFixture<BupaRejectionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BupaRejectionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BupaRejectionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
