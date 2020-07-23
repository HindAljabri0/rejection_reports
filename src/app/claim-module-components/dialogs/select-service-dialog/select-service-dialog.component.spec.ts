import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectServiceDialogComponent } from './select-service-dialog.component';

describe('SelectServiceDialogComponent', () => {
  let component: SelectServiceDialogComponent;
  let fixture: ComponentFixture<SelectServiceDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectServiceDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectServiceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
