import { TestBed } from '@angular/core/testing';

import { ChargingService } from './charging.service';

describe('ChargingService', () => {
  let service: ChargingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChargingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
