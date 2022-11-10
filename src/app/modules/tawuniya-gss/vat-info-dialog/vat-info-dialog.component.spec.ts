import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VatInfoDialogComponent } from './vat-info-dialog.component';

describe('VatInfoDialogComponent', () => {
  let component: VatInfoDialogComponent;
  let fixture: ComponentFixture<VatInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VatInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VatInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
