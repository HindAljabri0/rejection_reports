import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateBillInvoiceComponent } from './generate-bill-invoice.component';

describe('GenerateBillInvoiceComponent', () => {
  let component: GenerateBillInvoiceComponent;
  let fixture: ComponentFixture<GenerateBillInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateBillInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateBillInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
