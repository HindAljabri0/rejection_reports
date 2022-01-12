import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimCommunicationRequestsComponent } from './claim-communication-requests.component';

describe('ClaimCommunicationRequestsComponent', () => {
  let component: ClaimCommunicationRequestsComponent;
  let fixture: ComponentFixture<ClaimCommunicationRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimCommunicationRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimCommunicationRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
