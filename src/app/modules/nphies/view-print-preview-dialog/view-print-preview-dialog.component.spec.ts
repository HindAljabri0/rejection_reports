import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPrintPreviewDialogComponent } from './view-print-preview-dialog.component';

describe('ViewPrintPreviewDialogComponent', () => {
  let component: ViewPrintPreviewDialogComponent;
  let fixture: ComponentFixture<ViewPrintPreviewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPrintPreviewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPrintPreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
