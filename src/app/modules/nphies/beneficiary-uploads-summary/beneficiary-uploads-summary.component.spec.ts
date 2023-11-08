import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryUploadsSummaryComponent } from './beneficiary-uploads-summary.component';

describe('BeneficiaryUploadsSummaryComponent', () => {
  let component: BeneficiaryUploadsSummaryComponent;
  let fixture: ComponentFixture<BeneficiaryUploadsSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeneficiaryUploadsSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiaryUploadsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
