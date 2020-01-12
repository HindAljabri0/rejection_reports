import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadHistoryCardComponent } from './upload-history-card.component';

describe('UploadHistoryCardComponent', () => {
  let component: UploadHistoryCardComponent;
  let fixture: ComponentFixture<UploadHistoryCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadHistoryCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadHistoryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
