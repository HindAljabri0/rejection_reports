import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementCenterComponent } from './announcement-center.component';

describe('AnnouncementCenterComponent', () => {
  let component: AnnouncementCenterComponent;
  let fixture: ComponentFixture<AnnouncementCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnouncementCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnouncementCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
