import { TestBed } from '@angular/core/testing';

import { ChargingStatusService } from './charging-status.service';

describe('ChargingStatusService', () => {
  let service: ChargingStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChargingStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
