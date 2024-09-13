import { TestBed } from '@angular/core/testing';

import { LevelUpBonusesService } from './level-up-bonuses.service';

describe('LevelUpBonusesService', () => {
  let service: LevelUpBonusesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LevelUpBonusesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
