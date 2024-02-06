import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { Skill } from '../models/skill';
import { cloneDeep } from 'lodash';
import stringSort from 'src/app/shared/helpers/string-sort';
import { CharacterSheetMode } from '../models/enums/character-sheet-mode';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { Proficiency } from '../models/enums/proficiency';
import keepOrder from 'src/app/shared/helpers/keepOrder';
import { SkillsService } from '../services/skills.service';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsComponent implements OnChanges {
  @Input() skills: Skill[] = [];
  @Input({ required: true }) mode!: CharacterSheetMode;
  protected modes = CharacterSheetMode;
  protected skillsForm!: FormGroup;
  protected proficiencies = Proficiency;
  protected keepOrderLocal = keepOrder;

  constructor(private fb: FormBuilder, private skillsService: SkillsService) {}

  ngOnChanges(): void {
    this.skills = cloneDeep(this.skills).sort((a, b) =>
      stringSort(a.name, b.name)
    );

    this.initForm();
  }

  protected initForm(): void {
    this.skillsForm = this.fb.group(this.createFormGroup(this.skills));
  }

  protected createFormGroup(skills: Skill[]): AbstractControl[] {
    let formControlObj: any = {};
    skills.forEach(skill => {
      formControlObj[skill.name] = skill.level;
    });

    return formControlObj;
  }

  protected valueChanged(skill: Skill): void {
    const updatedSkill = cloneDeep(skill);
    updatedSkill.level = this.skillsForm.get(skill.name)?.value ?? skill.level;

    this.skillsService.skillChangeHandler(updatedSkill);
  }
}
