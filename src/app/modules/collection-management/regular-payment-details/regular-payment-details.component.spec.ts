import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularPaymentDetailsComponent } from './regular-payment-details.component';

describe('RegularPaymentDetailsComponent', () => {
  let component: RegularPaymentDetailsComponent;
  let fixture: ComponentFixture<RegularPaymentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegularPaymentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegularPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
