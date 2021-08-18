import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPreauthorizationDetailsComponent } from './view-preauthorization-details.component';

describe('ViewPreauthorizationDetailsComponent', () => {
  let component: ViewPreauthorizationDetailsComponent;
  let fixture: ComponentFixture<ViewPreauthorizationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPreauthorizationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPreauthorizationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
