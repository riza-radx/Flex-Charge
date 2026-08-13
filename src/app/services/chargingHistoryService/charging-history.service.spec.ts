import { TestBed } from '@angular/core/testing';

import { ChargingHistoryService } from './charging-history.service';

describe('ChargingHistoryService', () => {
  let service: ChargingHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChargingHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
