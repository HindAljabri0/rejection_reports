import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProviderContractDialogComponent } from './add-provider-contract-dialog.component';

describe('AddProviderContractDialogComponent', () => {
  let component: AddProviderContractDialogComponent;
  let fixture: ComponentFixture<AddProviderContractDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProviderContractDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProviderContractDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
