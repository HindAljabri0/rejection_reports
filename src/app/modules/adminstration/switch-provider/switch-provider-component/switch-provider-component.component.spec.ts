import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchProviderComponentComponent } from './switch-provider-component.component';

describe('SwitchProviderComponentComponent', () => {
  let component: SwitchProviderComponentComponent;
  let fixture: ComponentFixture<SwitchProviderComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwitchProviderComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchProviderComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
