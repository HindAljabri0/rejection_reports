import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectionCardComponent } from './rejection-card.component';

describe('RejectionCardComponent', () => {
  let component: RejectionCardComponent;
  let fixture: ComponentFixture<RejectionCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectionCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
