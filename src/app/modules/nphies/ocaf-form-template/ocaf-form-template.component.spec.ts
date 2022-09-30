import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OcafFormTemplateComponent } from './ocaf-form-template.component';

describe('OcafFormTemplateComponent', () => {
  let component: OcafFormTemplateComponent;
  let fixture: ComponentFixture<OcafFormTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OcafFormTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OcafFormTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
