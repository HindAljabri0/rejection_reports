import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotuploadedsummaryComponent } from './notuploadedsummary.component';

describe('NotuploadedsummaryComponent', () => {
  let component: NotuploadedsummaryComponent;
  let fixture: ComponentFixture<NotuploadedsummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotuploadedsummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotuploadedsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
