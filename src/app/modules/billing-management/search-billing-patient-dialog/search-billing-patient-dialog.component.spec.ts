import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBillingPatientDialogComponent } from './search-billing-patient-dialog.component';

describe('SearchBillingPatientDialogComponent', () => {
  let component: SearchBillingPatientDialogComponent;
  let fixture: ComponentFixture<SearchBillingPatientDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchBillingPatientDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBillingPatientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
