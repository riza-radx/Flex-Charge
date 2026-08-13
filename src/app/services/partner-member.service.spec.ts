import { TestBed } from '@angular/core/testing';

import { PartnerMemberService } from './partner-member.service';

describe('PartnerMemberService', () => {
  let service: PartnerMemberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartnerMemberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
