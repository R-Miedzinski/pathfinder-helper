import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  ControlValueAccessor,
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
  Skills,
  newSkills,
} from 'rpg-app-shared-package/dist/public-api';
import { Subject, takeUntil } from 'rxjs';

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
  implements ControlValueAccessor, OnInit, OnDestroy, OnChanges
{
  @Input() maxLevel: Proficiency = Proficiency.L;
  @Input() toChange: number = 0;
  @Input({ required: false }) upgradeOnly: boolean = false;
  @Input() currentProficiencies: Skill[] = [];
  @Input() _proficiencies: Skill[] = [];

  @Output() proficienciesChanged: EventEmitter<Skill[]> = new EventEmitter();

  protected disableIncrease: boolean = false;
  protected skillsForm?: FormGroup;

  private onTouched = () => {};
  private onChange = (data: Skill[]) => {};
  private readonly basicProficiencies = newSkills();
  private readonly ngDestroyed$: Subject<void> = new Subject();

  constructor(private fb: FormBuilder) {}

  public ngOnInit(): void {
    this.disableIncrease = this.toChange <= 0;

    this.initProficienciesForm();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const currentProficienciesChanges = changes['currentProficiencies'];
    const toChange = changes['toChange'];

    if (currentProficienciesChanges) {
      (currentProficienciesChanges.currentValue as Skill[]).forEach(skill => {
        const id = this.skills.value.findIndex(
          item => item?.name === skill.name
        );

        if (id !== -1) {
          const control = this.skills.controls[id];

          control.setValue(skill);
          control.disable();
        } else {
          //TODO fix this push
          this.skills.push(new FormControl(skill));
        }
      });
    }

    if (toChange) {
      this.disableIncrease = toChange.currentValue <= 0;
    }
  }

  public ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  public writeValue(obj: Skill[]): void {
    obj.forEach(skill => {
      const id = this.skills.value.findIndex(item => item?.name === skill.name);

      if (id !== -1) {
        this.skills.controls[id].setValue(skill);
      }
    });
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
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

  private dispatchChange(): void {
    const upgradedSkills = this._proficiencies.filter(
      skill => skill.level !== Proficiency.U
    );

    this.onChange(upgradedSkills);
    this.proficienciesChanged.emit(upgradedSkills);
  }

  private initProficienciesForm(): void {
    const savedSkills = cloneDeep(this.currentProficiencies);

    const basicSkills = this.basicProficiencies.filter(
      skill =>
        !savedSkills.map(skill => skill.name).some(name => name === skill.name)
    );

    this._proficiencies = basicSkills.concat(savedSkills);

    this.skillsForm = this.fb.group({
      skills: this.fb.array(
        this._proficiencies.map(skill => new FormControl(skill))
      ),
    });

    this.skillsForm
      .get('skills')
      ?.valueChanges.pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: skills => {
          const newSkills = this._proficiencies.reduce((acc, curr) => {
            const item = skills.find(
              (skill: Skill) => skill.name === curr.name
            );
            return acc.concat(Object.assign(curr, item));
          }, [] as Skill[]);

          this._proficiencies = newSkills;
          this.dispatchChange();
        },
      });
  }
}
