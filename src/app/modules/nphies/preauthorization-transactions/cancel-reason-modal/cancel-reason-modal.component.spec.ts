import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelReasonModalComponent } from './cancel-reason-modal.component';

describe('CancelReasonModalComponent', () => {
  let component: CancelReasonModalComponent;
  let fixture: ComponentFixture<CancelReasonModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelReasonModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelReasonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
