import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NphiesSearchClaimsComponent } from './nphies-search-claims.component';

describe('NphiesSearchClaimsComponent', () => {
  let component: NphiesSearchClaimsComponent;
  let fixture: ComponentFixture<NphiesSearchClaimsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NphiesSearchClaimsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NphiesSearchClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
