import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DcafFormTemplateComponent } from './dcaf-form-template.component';

describe('DcafFormTemplateComponent', () => {
  let component: DcafFormTemplateComponent;
  let fixture: ComponentFixture<DcafFormTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DcafFormTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DcafFormTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
