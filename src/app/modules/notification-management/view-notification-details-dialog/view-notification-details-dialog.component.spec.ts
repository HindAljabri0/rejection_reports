import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNotificationDetailsDialogComponent } from './view-notification-details-dialog.component';

describe('ViewNotificationDetailsDialogComponent', () => {
  let component: ViewNotificationDetailsDialogComponent;
  let fixture: ComponentFixture<ViewNotificationDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewNotificationDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewNotificationDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
