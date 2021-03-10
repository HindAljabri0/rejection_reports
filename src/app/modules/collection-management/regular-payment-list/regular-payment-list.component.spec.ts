import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularPaymentListComponent } from './regular-payment-list.component';

describe('RegularPaymentListComponent', () => {
  let component: RegularPaymentListComponent;
  let fixture: ComponentFixture<RegularPaymentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegularPaymentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegularPaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
