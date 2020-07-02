import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicesServicesComponent } from './invoices-services.component';

describe('InvoicesServicesComponent', () => {
  let component: InvoicesServicesComponent;
  let fixture: ComponentFixture<InvoicesServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicesServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicesServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
