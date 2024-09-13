import { TestBed } from '@angular/core/testing';

import { NewCharacterService } from './new-character.service';

describe('NewCharacterService', () => {
  let service: NewCharacterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewCharacterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
