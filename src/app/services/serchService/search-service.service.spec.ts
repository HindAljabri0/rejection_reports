import { TestBed } from '@angular/core/testing';

import { ViewedClaim } from '../../models/viewedClaim';
import { SearchService } from './search.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpResponse, HttpClientModule } from '@angular/common/http';

fdescribe('Search Service', () => {
  beforeEach(() => 
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
      ]
    })
  );

  it('object should be created', () => {
    const service:SearchService  = TestBed.get(SearchService);
    expect(service).toBeTruthy();
  });

  xit('getting claim function should get a claim', (done)=>{
    const service:SearchService  = TestBed.get(SearchService);
    let claim:ViewedClaim;
    service.getClaim('104', '7692').subscribe(event =>{
      if(event instanceof HttpResponse){
        expect(event.body).toBeTruthy();
        claim = JSON.parse(JSON.stringify(event.body));
        expect(claim).toBeTruthy();
        expect(claim.claimid).toBe(7692);
        expect(claim.services.length).toBeGreaterThan(0);
        done();
      }
    });
  });
  
});
