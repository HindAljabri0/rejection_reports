import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSupportingInfoComponent } from './manage-supporting-info.component';

describe('ManageSupportingInfoComponent', () => {
  let component: ManageSupportingInfoComponent;
  let fixture: ComponentFixture<ManageSupportingInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageSupportingInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSupportingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
