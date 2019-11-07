import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractcardComponent } from './abstractcard.component';

describe('AbstractcardComponent', () => {
  let component: AbstractcardComponent;
  let fixture: ComponentFixture<AbstractcardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbstractcardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbstractcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
