import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  forwardRef,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { cloneDeep } from 'lodash';
import {
  Abilities,
  Proficiency,
  Skill,
  newSkills,
} from 'rpg-app-shared-package/dist/public-api';
import { Subject, retry, takeUntil } from 'rxjs';
import { CustomFormControl } from '../custom-form-control/custom-form-control.component';
import { P } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-skill-proficiencies-form',
  templateUrl: './skill-proficiencies-form.component.html',
  styleUrls: ['./skill-proficiencies-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SkillProficienciesFormComponent),
    },
  ],
})
export class SkillProficienciesFormComponent
  extends CustomFormControl<Skill[]>
  implements OnInit, OnDestroy, OnChanges
{
  @Input() maxLevel: Proficiency = Proficiency.L;
  @Input() toChange: number = 0;
  @Input() currentProficiencies: Skill[] = [];

  protected availableSkills: Skill[] = [];
  protected disableIncrease: boolean = false;
  protected skillsForm?: FormGroup;

  private readonly basicProficiencies = newSkills();
  private readonly ngDestroyed$: Subject<void> = new Subject();

  constructor(private fb: FormBuilder) {
    super();
  }

  public ngOnInit(): void {
    this.disableIncrease = this.toChange <= 0;

    this.initProficienciesForm();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const currentProficienciesChanges = changes['currentProficiencies'];
    const toChange = changes['toChange'];

    if (currentProficienciesChanges) {
      this.initProficienciesForm();
    }

    if (toChange) {
      this.disableIncrease = toChange.currentValue <= 0;
    }
  }

  public ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  public setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.skillsForm?.disable();
    } else {
      this.skillsForm?.enable();
    }
  }

  protected onLevelChange(event: 1 | -1): void {
    this.toChange -= event;

    this.disableIncrease = this.toChange <= 0;
    this.updateValue();
  }

  protected override updateValue(): void {
    const upgradedSkills = this.availableSkills?.filter(
      skill =>
        skill.level !== Proficiency.U &&
        !this.currentProficiencies.some(
          item =>
            item.name === skill.name && item?.specialty === item?.specialty
        )
    );

    this.onChange(upgradedSkills);
    this.valueChange.emit(upgradedSkills);
  }

  protected canDecrease(skill: Skill): boolean {
    return (
      skill.level === Proficiency.U ||
      this.currentProficiencies.some(
        item => item.name === skill.name && item?.specialty === skill?.specialty
      )
    );
  }

  private initProficienciesForm(): void {
    const savedSkills = cloneDeep(this.currentProficiencies);

    const basicSkills = this.basicProficiencies.filter(
      skill =>
        !savedSkills.some(
          item =>
            item.name === skill.name &&
            (item?.specialty ?? '') === (skill?.specialty ?? '')
        )
    );

    this.availableSkills = basicSkills
      .concat(savedSkills)
      .sort(this.compareSkills);
  }

  private compareSkills(a: Skill, b: Skill): number {
    if (a.name > b.name) {
      return 1;
    } else if (b.name > a.name) {
      return -1;
    } else if ((a.specialty ?? '') > (b.specialty ?? '')) {
      return 1;
    } else if ((b.specialty ?? '') > (a.specialty ?? '')) {
      return -1;
    } else {
      return 0;
    }
  }
}
