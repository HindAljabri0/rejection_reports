import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadBeneficiaryComponent } from './upload-beneficiary.component';

describe('UploadBeneficiaryComponent', () => {
  let component: UploadBeneficiaryComponent;
  let fixture: ComponentFixture<UploadBeneficiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadBeneficiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
