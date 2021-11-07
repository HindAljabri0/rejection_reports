import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicationRequestsComponent } from './communication-requests.component';

describe('CommunicationRequestsComponent', () => {
  let component: CommunicationRequestsComponent;
  let fixture: ComponentFixture<CommunicationRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunicationRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunicationRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
