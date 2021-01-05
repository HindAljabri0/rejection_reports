import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EbillingComponent } from './ebilling.component';

describe('EbillingComponent', () => {
  let component: EbillingComponent;
  let fixture: ComponentFixture<EbillingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EbillingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EbillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
