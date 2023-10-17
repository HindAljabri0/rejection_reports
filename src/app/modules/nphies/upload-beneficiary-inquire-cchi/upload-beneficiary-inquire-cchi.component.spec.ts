import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadBeneficiaryInquireCchiComponent } from './upload-beneficiary-inquire-cchi.component';

describe('UploadBeneficiaryInquireCchiComponent', () => {
  let component: UploadBeneficiaryInquireCchiComponent;
  let fixture: ComponentFixture<UploadBeneficiaryInquireCchiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadBeneficiaryInquireCchiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadBeneficiaryInquireCchiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
