import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NphiesConfigurationsComponent } from './nphies-configurations.component';

describe('NphiesConfigurationsComponent', () => {
  let component: NphiesConfigurationsComponent;
  let fixture: ComponentFixture<NphiesConfigurationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NphiesConfigurationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NphiesConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
