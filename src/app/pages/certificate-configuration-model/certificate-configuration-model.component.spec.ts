import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateConfigurationModelComponent } from './certificate-configuration-model.component';

describe('CertificateConfigurationModelComponent', () => {
  let component: CertificateConfigurationModelComponent;
  let fixture: ComponentFixture<CertificateConfigurationModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificateConfigurationModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateConfigurationModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
