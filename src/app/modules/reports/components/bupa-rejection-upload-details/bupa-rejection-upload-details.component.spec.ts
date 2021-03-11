import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BupaRejectionUploadDetailsComponent } from './bupa-rejection-upload-details.component';

describe('BupaRejectionUploadDetailsComponent', () => {
  let component: BupaRejectionUploadDetailsComponent;
  let fixture: ComponentFixture<BupaRejectionUploadDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BupaRejectionUploadDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BupaRejectionUploadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
