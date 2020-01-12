import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadHistoryCenterComponent } from './upload-history-center.component';

describe('UploadHistoryCenterComponent', () => {
  let component: UploadHistoryCenterComponent;
  let fixture: ComponentFixture<UploadHistoryCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadHistoryCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadHistoryCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
