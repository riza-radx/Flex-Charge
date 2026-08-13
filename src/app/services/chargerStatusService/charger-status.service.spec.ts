import { TestBed } from '@angular/core/testing';

import { ChargerStatusService } from './charger-status.service';

describe('ChargerStatusService', () => {
  let service: ChargerStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChargerStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
