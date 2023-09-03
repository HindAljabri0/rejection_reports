import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReuseApprovalModalComponent } from './reuse-approval-modal.component';

describe('ReuseApprovalModalComponent', () => {
  let component: ReuseApprovalModalComponent;
  let fixture: ComponentFixture<ReuseApprovalModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReuseApprovalModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReuseApprovalModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
