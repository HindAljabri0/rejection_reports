import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectionReportsComponent } from './rejection-reports.component';

describe('RejectionReportsComponent', () => {
  let component: RejectionReportsComponent;
  let fixture: ComponentFixture<RejectionReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectionReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectionReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
