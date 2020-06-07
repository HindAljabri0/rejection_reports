import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvidersConfigComponent } from './providers-config.component';

describe('ProvidersConfigComponent', () => {
  let component: ProvidersConfigComponent;
  let fixture: ComponentFixture<ProvidersConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvidersConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvidersConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
