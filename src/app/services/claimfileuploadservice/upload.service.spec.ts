import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UploadService } from './upload.service';

describe('UploadService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [UploadService]
  }));
  
  const service:UploadService = TestBed.get(UploadService);
  const httpMock = TestBed.get(HttpTestingController);

  it('shoud post data successful', () => {
    
  });
});
