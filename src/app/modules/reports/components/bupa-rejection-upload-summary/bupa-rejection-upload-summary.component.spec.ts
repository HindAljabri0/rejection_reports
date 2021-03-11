import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BupaRejectionUploadSummaryComponent } from './bupa-rejection-upload-summary.component';

describe('BupaRejectionUploadSummaryComponent', () => {
  let component: BupaRejectionUploadSummaryComponent;
  let fixture: ComponentFixture<BupaRejectionUploadSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BupaRejectionUploadSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BupaRejectionUploadSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
