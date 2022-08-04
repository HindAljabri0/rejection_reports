import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EligiblityJsonResponseComponent } from './eligiblity-json-response.component';

describe('EligiblityJsonResponseComponent', () => {
  let component: EligiblityJsonResponseComponent;
  let fixture: ComponentFixture<EligiblityJsonResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EligiblityJsonResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EligiblityJsonResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
