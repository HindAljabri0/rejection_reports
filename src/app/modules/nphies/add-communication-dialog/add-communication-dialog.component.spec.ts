import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCommunicationDialogComponent } from './add-communication-dialog.component';

describe('AddCommunicationDialogComponent', () => {
  let component: AddCommunicationDialogComponent;
  let fixture: ComponentFixture<AddCommunicationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCommunicationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCommunicationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
