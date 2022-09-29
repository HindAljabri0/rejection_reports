import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UcafFormTemplateComponent } from './ucaf-form-template.component';

describe('UcafFormTemplateComponent', () => {
  let component: UcafFormTemplateComponent;
  let fixture: ComponentFixture<UcafFormTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UcafFormTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UcafFormTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
