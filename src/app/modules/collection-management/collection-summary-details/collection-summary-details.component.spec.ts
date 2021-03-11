import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionSummaryDetailsComponent } from './collection-summary-details.component';

describe('CollectionSummaryDetailsComponent', () => {
  let component: CollectionSummaryDetailsComponent;
  let fixture: ComponentFixture<CollectionSummaryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionSummaryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionSummaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
