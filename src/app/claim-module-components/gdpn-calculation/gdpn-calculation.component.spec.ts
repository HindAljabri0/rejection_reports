import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GdpnCalculationComponent } from './gdpn-calculation.component';

describe('GdpnCalculationComponent', () => {
  let component: GdpnCalculationComponent;
  let fixture: ComponentFixture<GdpnCalculationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GdpnCalculationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GdpnCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
