import { TestBed } from '@angular/core/testing';

import { AddEffectService } from './add-effect.service';

describe('AddEffectService', () => {
  let service: AddEffectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddEffectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
