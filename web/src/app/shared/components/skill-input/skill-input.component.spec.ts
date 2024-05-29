import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillInputComponent } from './skill-input.component';

describe('SkillInputComponent', () => {
  let component: SkillInputComponent;
  let fixture: ComponentFixture<SkillInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SkillInputComponent]
    });
    fixture = TestBed.createComponent(SkillInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
