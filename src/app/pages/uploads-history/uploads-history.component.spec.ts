import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadsHistoryComponent } from './uploads-history.component';

describe('UploadsHistoryComponent', () => {
  let component: UploadsHistoryComponent;
  let fixture: ComponentFixture<UploadsHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadsHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
