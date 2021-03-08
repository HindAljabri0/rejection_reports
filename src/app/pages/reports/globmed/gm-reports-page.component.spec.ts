import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GmReportsPageComponent } from './gm-reports-page.component';

describe('GmReportsPageComponent', () => {
  let component: GmReportsPageComponent;
  let fixture: ComponentFixture<GmReportsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GmReportsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GmReportsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
