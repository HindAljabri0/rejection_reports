import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimDataComponent } from './claim-data.component';

describe('ClaimDataComponent', () => {
  let component: ClaimDataComponent;
  let fixture: ComponentFixture<ClaimDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
