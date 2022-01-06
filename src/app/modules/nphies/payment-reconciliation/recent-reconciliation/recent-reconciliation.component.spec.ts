import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentReconciliationComponent } from './recent-reconciliation.component';

describe('RecentReconciliationComponent', () => {
  let component: RecentReconciliationComponent;
  let fixture: ComponentFixture<RecentReconciliationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentReconciliationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentReconciliationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
