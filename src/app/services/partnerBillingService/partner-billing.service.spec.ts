import { TestBed } from '@angular/core/testing';

import { PartnerBillingService } from './partner-billing.service';

describe('PartnerBillingService', () => {
  let service: PartnerBillingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartnerBillingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
