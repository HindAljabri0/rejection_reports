import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricelistDetailsComponent } from './pricelist-details.component';

describe('PricelistDetailsComponent', () => {
  let component: PricelistDetailsComponent;
  let fixture: ComponentFixture<PricelistDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricelistDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricelistDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
