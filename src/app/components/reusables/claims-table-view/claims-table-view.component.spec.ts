import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsTableViewComponent } from './claims-table-view.component';

describe('ClaimsTableViewComponent', () => {
  let component: ClaimsTableViewComponent;
  let fixture: ComponentFixture<ClaimsTableViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimsTableViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsTableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
