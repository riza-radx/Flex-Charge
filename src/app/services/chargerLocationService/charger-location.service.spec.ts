import { TestBed } from '@angular/core/testing';

import { ChargerLocationService } from './charger-location.service';

describe('ChargerLocationService', () => {
  let service: ChargerLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChargerLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
