import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimProcessedTransactionsComponent } from './claim-processed-transactions.component';

describe('ClaimProcessedTransactionsComponent', () => {
  let component: ClaimProcessedTransactionsComponent;
  let fixture: ComponentFixture<ClaimProcessedTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimProcessedTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimProcessedTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
