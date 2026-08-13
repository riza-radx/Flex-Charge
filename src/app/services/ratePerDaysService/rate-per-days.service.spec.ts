import { TestBed } from '@angular/core/testing';

import { RatePerDaysService } from './rate-per-days.service';

describe('RatePerDaysService', () => {
  let service: RatePerDaysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RatePerDaysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
