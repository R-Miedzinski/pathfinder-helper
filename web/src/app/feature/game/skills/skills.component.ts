import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { cloneDeep } from 'lodash';
import stringSort from 'src/app/shared/helpers/string-sort';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import keepOrder from 'src/app/shared/helpers/keepOrder';
import { SkillsService } from '../services/skills.service';
import {
  ArmorProficiency,
  CharacterSheetMode,
  Proficiency,
  Skill,
  WeaponProficiency,
  createProfToValMap,
} from 'rpg-app-shared-package/dist/public-api';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsComponent implements OnChanges, OnInit {
  @Input() skills: Skill[] = [];
  @Input() weapons: WeaponProficiency[] = [];
  @Input() armores: ArmorProficiency[] = [];
  @Input() level: number = 0;
  @Input({ required: true }) mode!: CharacterSheetMode;
  protected modes = CharacterSheetMode;
  protected skillsForm!: FormGroup;
  protected proficiencies = Proficiency;
  protected profToValMap: Map<Proficiency, number> = new Map();
  protected keepOrderLocal = keepOrder;

  constructor(private fb: FormBuilder, private skillsService: SkillsService) {}

  public ngOnInit(): void {
    this.profToValMap = createProfToValMap(this.level);
  }

  public ngOnChanges(change: SimpleChanges): void {
    if (change['skills']) {
      this.skills = cloneDeep(this.skills).sort((a, b) =>
        stringSort(a.name, b.name)
      );

      this.initForm();
    }
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
