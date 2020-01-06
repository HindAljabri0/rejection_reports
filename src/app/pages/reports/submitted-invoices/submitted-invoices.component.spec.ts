import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittedInvoicesComponent } from './submitted-invoices.component';

describe('SubmittedInvoicesComponent', () => {
  let component: SubmittedInvoicesComponent;
  let fixture: ComponentFixture<SubmittedInvoicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmittedInvoicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmittedInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
