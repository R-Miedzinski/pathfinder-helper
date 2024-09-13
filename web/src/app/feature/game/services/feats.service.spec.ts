import { TestBed } from '@angular/core/testing';

import { FeatsService } from './feats.service';

describe('FeatsService', () => {
  let service: FeatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
