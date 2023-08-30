import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCareTeamModalComponent } from './add-edit-care-team-modal.component';

describe('AddEditCareTeamModalComponent', () => {
  let component: AddEditCareTeamModalComponent;
  let fixture: ComponentFixture<AddEditCareTeamModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditCareTeamModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCareTeamModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
