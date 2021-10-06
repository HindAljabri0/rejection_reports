import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessedTransactionsComponent } from './processed-transactions.component';

describe('ProcessedTransactionsComponent', () => {
  let component: ProcessedTransactionsComponent;
  let fixture: ComponentFixture<ProcessedTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessedTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessedTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
