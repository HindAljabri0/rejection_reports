import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiErrorsDialogComponent } from './api-errors-dialog.component';

describe('ApiErrorsDialogComponent', () => {
  let component: ApiErrorsDialogComponent;
  let fixture: ComponentFixture<ApiErrorsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiErrorsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiErrorsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
