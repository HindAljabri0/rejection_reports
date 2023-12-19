import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MreCommentsComponent } from './mre-comments.component';

describe('MreCommentsComponent', () => {
  let component: MreCommentsComponent;
  let fixture: ComponentFixture<MreCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MreCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MreCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
