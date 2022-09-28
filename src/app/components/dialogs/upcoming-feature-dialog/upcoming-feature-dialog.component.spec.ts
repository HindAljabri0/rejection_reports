import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingFeatureDialogComponent } from './upcoming-feature-dialog.component';

describe('UpcomingFeatureDialogComponent', () => {
  let component: UpcomingFeatureDialogComponent;
  let fixture: ComponentFixture<UpcomingFeatureDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpcomingFeatureDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingFeatureDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
