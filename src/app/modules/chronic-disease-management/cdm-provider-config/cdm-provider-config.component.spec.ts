import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CdmProviderConfigComponent } from './cdm-provider-config.component';

describe('CdmProviderConfigComponent', () => {
  let component: CdmProviderConfigComponent;
  let fixture: ComponentFixture<CdmProviderConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CdmProviderConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CdmProviderConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
