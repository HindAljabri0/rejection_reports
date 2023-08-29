import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApaProcessedTransaction } from 'src/app/models/apa-processed-transaction-model';

describe('ApaProcessedTransactionsComponent', () => {
  let component: ApaProcessedTransaction;
  let fixture: ComponentFixture<ApaProcessedTransaction>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApaProcessedTransaction ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApaProcessedTransaction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
