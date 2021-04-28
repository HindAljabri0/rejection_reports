import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PbmCommentsComponent } from './pbm-comments.component';

describe('PbmCommentsComponent', () => {
  let component: PbmCommentsComponent;
  let fixture: ComponentFixture<PbmCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PbmCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PbmCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
