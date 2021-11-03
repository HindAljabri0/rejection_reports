import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingOrNewContractDialogComponent } from './existing-or-new-contract-dialog.component';

describe('ExistingOrNewContractDialogComponent', () => {
  let component: ExistingOrNewContractDialogComponent;
  let fixture: ComponentFixture<ExistingOrNewContractDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistingOrNewContractDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingOrNewContractDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
