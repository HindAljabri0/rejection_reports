import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtractClaimsComponent } from './extract-claims.component';

describe('ExtractClaimsComponent', () => {
  let component: ExtractClaimsComponent;
  let fixture: ComponentFixture<ExtractClaimsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtractClaimsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtractClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
