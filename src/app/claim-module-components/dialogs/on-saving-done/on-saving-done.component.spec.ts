import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnSavingDoneComponent } from './on-saving-done.component';

describe('OnSavingDoneComponent', () => {
  let component: OnSavingDoneComponent;
  let fixture: ComponentFixture<OnSavingDoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnSavingDoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnSavingDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
