import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EligibilityTransactionsComponent } from './eligibility-transactions.component';

describe('EligibilityTransactionsComponent', () => {
  let component: EligibilityTransactionsComponent;
  let fixture: ComponentFixture<EligibilityTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EligibilityTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EligibilityTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
