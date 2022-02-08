import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUploadsComponent } from './admin-uploads.component';

describe('AdminUploadsComponent', () => {
  let component: AdminUploadsComponent;
  let fixture: ComponentFixture<AdminUploadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUploadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUploadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
