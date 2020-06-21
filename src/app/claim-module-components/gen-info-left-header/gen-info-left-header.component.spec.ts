import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenInfoLeftHeaderComponent } from './gen-info-left-header.component';

describe('GenInfoLeftHeaderComponent', () => {
  let component: GenInfoLeftHeaderComponent;
  let fixture: ComponentFixture<GenInfoLeftHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenInfoLeftHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenInfoLeftHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
