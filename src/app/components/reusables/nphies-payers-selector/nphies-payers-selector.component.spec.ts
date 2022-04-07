import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NphiesPayersSelectorComponent } from './nphies-payers-selector.component';

describe('NphiesPayersSelectorComponent', () => {
  let component: NphiesPayersSelectorComponent;
  let fixture: ComponentFixture<NphiesPayersSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NphiesPayersSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NphiesPayersSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
