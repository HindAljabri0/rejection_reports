import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancePreauthTransactionsComponent } from './advance-preauth-transactions.component';

describe('AdvancePreauthTransactionsComponent', () => {
  let component: AdvancePreauthTransactionsComponent;
  let fixture: ComponentFixture<AdvancePreauthTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancePreauthTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancePreauthTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
