import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonResponseComponent } from './json-response.component';

describe('JsonResponseComponent', () => {
  let component: JsonResponseComponent;
  let fixture: ComponentFixture<JsonResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JsonResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
