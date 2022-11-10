import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchGroupProviderComponent } from './switch-group-provider.component';

describe('SwitchGroupProviderComponent', () => {
  let component: SwitchGroupProviderComponent;
  let fixture: ComponentFixture<SwitchGroupProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwitchGroupProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchGroupProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
