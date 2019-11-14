import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchClaimsComponent } from './search-claims.component';

describe('SearchClaimsComponent', () => {
  let component: SearchClaimsComponent;
  let fixture: ComponentFixture<SearchClaimsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchClaimsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
