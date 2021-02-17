import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeLogDialogComponent } from './change-log-dialog.component';

describe('ChangeLogDialogComponent', () => {
  let component: ChangeLogDialogComponent;
  let fixture: ComponentFixture<ChangeLogDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeLogDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeLogDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
