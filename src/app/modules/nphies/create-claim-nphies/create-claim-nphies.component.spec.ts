import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClaimNphiesComponent } from './create-claim-nphies.component';

describe('CreateClaimNphiesComponent', () => {
  let component: CreateClaimNphiesComponent;
  let fixture: ComponentFixture<CreateClaimNphiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateClaimNphiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateClaimNphiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
