import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricelistUploadComponent } from './pricelist-upload.component';

describe('PricelistUploadComponent', () => {
  let component: PricelistUploadComponent;
  let fixture: ComponentFixture<PricelistUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricelistUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricelistUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
