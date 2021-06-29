import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderContractComponent } from './provider-contract.component';

describe('ProviderContractComponent', () => {
  let component: ProviderContractComponent;
  let fixture: ComponentFixture<ProviderContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
