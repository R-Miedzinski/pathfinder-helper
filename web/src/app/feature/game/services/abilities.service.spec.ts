import { TestBed } from '@angular/core/testing';

import { AbilitiesService } from './abilities.service';

describe('AbilitiesService', () => {
  let service: AbilitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbilitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
