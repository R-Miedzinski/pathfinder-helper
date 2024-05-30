import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
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
  Proficiency,
  Skill,
  newSkills,
} from 'rpg-app-shared-package/dist/public-api';
import { Subject, takeUntil } from 'rxjs';
import { CustomFormControl } from '../custom-form-control/custom-form-control.component';

@Component({
  selector: 'app-skill-proficiencies-form',
  templateUrl: './skill-proficiencies-form.component.html',
  styleUrls: ['./skill-proficiencies-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: SkillProficienciesFormComponent,
    },
  ],
})
export class SkillProficienciesFormComponent
  extends CustomFormControl<Skill[]>
  implements OnInit, OnDestroy, OnChanges
{
  @Input() maxLevel: Proficiency = Proficiency.L;
  @Input() toChange: number = 0;
  @Input({ required: false }) upgradeOnly: boolean = false;
  @Input() currentProficiencies: Skill[] = [];

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
      const controlsToPush: FormControl<Skill | null>[] = [];
      const idsToDisable: number[] = [];
      this.skills?.controls.forEach(control => control.enable());

      (currentProficienciesChanges.currentValue as Skill[]).forEach(skill => {
        const id = this.skills?.value.findIndex(
          item =>
            item?.name === skill.name &&
            (item.specialty ?? '') === (skill.specialty ?? '')
        );

        if (id !== -1) {
          const control = this.skills.controls[id];

          control.setValue(skill);
          idsToDisable.push(id);
        } else {
          const control = new FormControl<Skill>(skill);

          control.disable();
          controlsToPush.push(control);
        }
      });

      controlsToPush.forEach(ctrl => this.skills.push(ctrl));
      idsToDisable.forEach(id => this.skills.controls[id].disable());
    }

    if (toChange) {
      this.disableIncrease = toChange.currentValue <= 0;
    }
  }

  public ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  public override writeValue(value: Skill[]): void {
    value.forEach(skill => {
      const id = this.skills.value.findIndex(item => item?.name === skill.name);

      if (id !== -1) {
        this.skills.controls[id].setValue(skill);
      }
    });

    this.updateValue();
  }

  public setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.skillsForm?.disable();
    } else {
      this.skillsForm?.enable();
    }
  }

  protected get skills(): FormArray<FormControl<Skill | null>> {
    return this.skillsForm?.get('skills') as FormArray;
  }

  protected onLevelChange(event: 1 | -1): void {
    this.toChange -= event;

    this.disableIncrease = this.toChange <= 0;
  }

  protected override updateValue(): void {
    const upgradedSkills = this.value.filter(
      skill => skill.level !== Proficiency.U
    );

    this.onChange(upgradedSkills);
    this.valueChange.emit(upgradedSkills);
  }

  private initProficienciesForm(): void {
    const savedSkills = cloneDeep(this.currentProficiencies);

    const basicSkills = this.basicProficiencies.filter(
      skill =>
        !savedSkills.map(skill => skill.name).some(name => name === skill.name)
    );

    this.value = basicSkills.concat(savedSkills);

    this.skillsForm = this.fb.group({
      skills: this.fb.array(this.value.map(skill => new FormControl(skill))),
    });

    this.skills?.valueChanges.pipe(takeUntil(this.ngDestroyed$)).subscribe({
      next: skills => {
        const newSkills = this.value.reduce((acc, curr) => {
          const item = skills.find(skill => skill?.name === curr.name);
          return acc.concat(Object.assign(curr, item));
        }, [] as Skill[]);

        this.value = newSkills;
        this.updateValue();
      },
    });
  }
}
