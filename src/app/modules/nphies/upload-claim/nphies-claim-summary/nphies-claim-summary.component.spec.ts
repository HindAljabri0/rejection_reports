import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NphiesClaimSummaryComponent } from './nphies-claim-summary.component';

describe('NphiesClaimSummaryComponent', () => {
  let component: NphiesClaimSummaryComponent;
  let fixture: ComponentFixture<NphiesClaimSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NphiesClaimSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NphiesClaimSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
