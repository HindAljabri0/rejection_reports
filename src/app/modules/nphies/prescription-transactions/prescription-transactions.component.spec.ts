import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionTransactionsComponent } from './prescription-transactions.component';

describe('PrescriptionTransactionsComponent', () => {
  let component: PrescriptionTransactionsComponent;
  let fixture: ComponentFixture<PrescriptionTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrescriptionTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
