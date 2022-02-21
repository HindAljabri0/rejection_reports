import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryTabComponent } from './beneficiary-tab.component';

describe('BeneficiaryTabComponent', () => {
  let component: BeneficiaryTabComponent;
  let fixture: ComponentFixture<BeneficiaryTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeneficiaryTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiaryTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
