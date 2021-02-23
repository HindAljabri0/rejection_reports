import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BupaRejectionConfirmDialogComponent } from './bupa-rejection-confirm-dialog.component';

describe('BupaRejectionConfirmDialogComponent', () => {
  let component: BupaRejectionConfirmDialogComponent;
  let fixture: ComponentFixture<BupaRejectionConfirmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BupaRejectionConfirmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BupaRejectionConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
