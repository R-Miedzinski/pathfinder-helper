import { TestBed } from '@angular/core/testing';

import { EnterDataService } from './enter-data.service';

describe('EnterDataService', () => {
  let service: EnterDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnterDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
