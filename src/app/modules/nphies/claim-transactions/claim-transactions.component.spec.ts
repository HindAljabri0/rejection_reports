import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimTransactionsComponent } from './claim-transactions.component';

describe('ClaimTransactionsComponent', () => {
  let component: ClaimTransactionsComponent;
  let fixture: ComponentFixture<ClaimTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
