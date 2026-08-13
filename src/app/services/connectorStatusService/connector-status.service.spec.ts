import { TestBed } from '@angular/core/testing';

import { ConnectorStatusService } from './connector-status.service';

describe('ConnectorStatusService', () => {
  let service: ConnectorStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnectorStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
