import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionSummaryListComponent } from './collection-summary-list.component';

describe('CollectionSummaryListComponent', () => {
  let component: CollectionSummaryListComponent;
  let fixture: ComponentFixture<CollectionSummaryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionSummaryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionSummaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
