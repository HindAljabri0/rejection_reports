import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionSummaryCreateComponent } from './collection-summary-create.component';

describe('CollectionSummaryCreateComponent', () => {
  let component: CollectionSummaryCreateComponent;
  let fixture: ComponentFixture<CollectionSummaryCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionSummaryCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionSummaryCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
