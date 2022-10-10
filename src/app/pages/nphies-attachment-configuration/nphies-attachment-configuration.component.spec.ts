import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NphiesAttachmentConfigurationComponent } from './nphies-attachment-configuration.component';

describe('NphiesAttachmentConfigurationComponent', () => {
  let component: NphiesAttachmentConfigurationComponent;
  let fixture: ComponentFixture<NphiesAttachmentConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NphiesAttachmentConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NphiesAttachmentConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
