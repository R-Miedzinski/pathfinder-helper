import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { postDataGuard } from './post-data.guard';

describe('postDataGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => postDataGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
