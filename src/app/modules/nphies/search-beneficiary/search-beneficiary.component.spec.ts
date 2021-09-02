import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBeneficiaryComponent } from './search-beneficiary.component';

describe('SearchBeneficiaryComponent', () => {
  let component: SearchBeneficiaryComponent;
  let fixture: ComponentFixture<SearchBeneficiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchBeneficiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
