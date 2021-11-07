import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NphiesUploadCardComponent } from './nphies-upload-card.component';

describe('NphiesUploadCardComponent', () => {
  let component: NphiesUploadCardComponent;
  let fixture: ComponentFixture<NphiesUploadCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NphiesUploadCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NphiesUploadCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
