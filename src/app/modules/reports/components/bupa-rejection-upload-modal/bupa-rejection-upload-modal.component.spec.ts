import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BupaRejectionUploadModalComponent } from './bupa-rejection-upload-modal.component';

describe('BupaRejectionUploadModalComponent', () => {
  let component: BupaRejectionUploadModalComponent;
  let fixture: ComponentFixture<BupaRejectionUploadModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BupaRejectionUploadModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BupaRejectionUploadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
