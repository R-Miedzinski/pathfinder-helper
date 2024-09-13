import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillProficienciesFormComponent } from './skill-proficiencies-form.component';

describe('SkillProficienciesFormComponent', () => {
  let component: SkillProficienciesFormComponent;
  let fixture: ComponentFixture<SkillProficienciesFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SkillProficienciesFormComponent]
    });
    fixture = TestBed.createComponent(SkillProficienciesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
