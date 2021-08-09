/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CollectionManagementService } from './collection-management.service';

describe('Service: CollectionManagement', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CollectionManagementService]
    });
  });

  it('should ...', inject([CollectionManagementService], (service: CollectionManagementService) => {
    expect(service).toBeTruthy();
  }));
});
