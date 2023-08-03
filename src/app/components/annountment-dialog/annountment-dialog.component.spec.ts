import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnountmentDialogComponent } from './annountment-dialog.component';

describe('AnnountmentDialogComponent', () => {
  let component: AnnountmentDialogComponent;
  let fixture: ComponentFixture<AnnountmentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnountmentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnountmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
