import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableSearchBarComponent } from './reusable-search-bar.component';

describe('SearchBarComponent', () => {
  let component: ReusableSearchBarComponent;
  let fixture: ComponentFixture<ReusableSearchBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReusableSearchBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReusableSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
