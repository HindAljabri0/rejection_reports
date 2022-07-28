import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalJsonResponseComponent } from './approval-json-response.component';

describe('ApprovalJsonResponseComponent', () => {
  let component: ApprovalJsonResponseComponent;
  let fixture: ComponentFixture<ApprovalJsonResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalJsonResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalJsonResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
