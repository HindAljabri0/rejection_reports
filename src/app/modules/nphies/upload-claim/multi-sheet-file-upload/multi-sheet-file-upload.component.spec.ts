import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSheetFileUploadComponent } from './multi-sheet-file-upload.component';

describe('MultiSheetFileUploadComponent', () => {
  let component: MultiSheetFileUploadComponent;
  let fixture: ComponentFixture<MultiSheetFileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiSheetFileUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSheetFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
