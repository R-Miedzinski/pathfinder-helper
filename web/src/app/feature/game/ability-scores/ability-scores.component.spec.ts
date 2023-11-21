import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbilityScoresComponent } from './ability-scores.component';

describe('AbilityScoresComponent', () => {
  let component: AbilityScoresComponent;
  let fixture: ComponentFixture<AbilityScoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AbilityScoresComponent]
    });
    fixture = TestBed.createComponent(AbilityScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
