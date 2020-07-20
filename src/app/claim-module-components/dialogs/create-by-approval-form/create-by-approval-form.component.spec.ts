import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateByApprovalFormComponent } from './create-by-approval-form.component';

describe('CreateByApprovalFormComponent', () => {
  let component: CreateByApprovalFormComponent;
  let fixture: ComponentFixture<CreateByApprovalFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateByApprovalFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateByApprovalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
