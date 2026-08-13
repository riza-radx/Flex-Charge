import { TestBed } from '@angular/core/testing';

import { EvVehicleService } from './ev-vehicle.service';

describe('EvVehicleService', () => {
  let service: EvVehicleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvVehicleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
