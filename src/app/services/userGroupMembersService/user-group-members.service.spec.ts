import { TestBed } from '@angular/core/testing';

import { UserGroupMembersService } from './user-group-members.service';

describe('UserGroupMembersService', () => {
  let service: UserGroupMembersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserGroupMembersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
