import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelBonusComponent } from './LevelBonusComponent';

describe('LevelBonusComponent', () => {
  let component: LevelBonusComponent;
  let fixture: ComponentFixture<LevelBonusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LevelBonusComponent],
    });
    fixture = TestBed.createComponent(LevelBonusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
