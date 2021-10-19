import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NphiesUploadsComponent } from './nphies-uploads.component';

describe('NphiesUploadsComponent', () => {
  let component: NphiesUploadsComponent;
  let fixture: ComponentFixture<NphiesUploadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NphiesUploadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NphiesUploadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
