import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchWithAdvanceComponent } from './search-with-advance.component';

describe('SearchWithAdvanceComponent', () => {
  let component: SearchWithAdvanceComponent;
  let fixture: ComponentFixture<SearchWithAdvanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchWithAdvanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchWithAdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
