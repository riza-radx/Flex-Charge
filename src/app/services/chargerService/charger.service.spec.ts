import { TestBed } from '@angular/core/testing';

import { ChargerService } from './charger.service';

describe('ChargerService', () => {
  let service: ChargerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChargerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
