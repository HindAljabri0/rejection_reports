import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BupaRejectionListComponent } from './bupa-rejection-list.component';

describe('BupaRejectionListComponent', () => {
  let component: BupaRejectionListComponent;
  let fixture: ComponentFixture<BupaRejectionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BupaRejectionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BupaRejectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
