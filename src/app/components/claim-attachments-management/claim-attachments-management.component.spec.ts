import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimAttachmentsManagementComponent } from './claim-attachments-management.component';

describe('ClaimAttachmentsManagementComponent', () => {
  let component: ClaimAttachmentsManagementComponent;
  let fixture: ComponentFixture<ClaimAttachmentsManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimAttachmentsManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimAttachmentsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
