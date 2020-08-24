import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopFiveRejectionsComponent } from './top-five-rejections.component';

describe('TopFiveRejectionsComponent', () => {
  let component: TopFiveRejectionsComponent;
  let fixture: ComponentFixture<TopFiveRejectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopFiveRejectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopFiveRejectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
