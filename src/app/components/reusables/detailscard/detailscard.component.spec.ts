import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailscardComponent } from './detailscard.component';

describe('DetailscardComponent', () => {
  let component: DetailscardComponent;
  let fixture: ComponentFixture<DetailscardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailscardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailscardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
