import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TawuniyaGssComponent } from './tawuniya-gss.component';

describe('TawuniyaGssComponent', () => {
  let component: TawuniyaGssComponent;
  let fixture: ComponentFixture<TawuniyaGssComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TawuniyaGssComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TawuniyaGssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
