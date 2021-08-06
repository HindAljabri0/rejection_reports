import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreauthorizationTransactionsComponent } from './preauthorization-transactions.component';

describe('PreauthorizationTransactionsComponent', () => {
  let component: PreauthorizationTransactionsComponent;
  let fixture: ComponentFixture<PreauthorizationTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreauthorizationTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreauthorizationTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
