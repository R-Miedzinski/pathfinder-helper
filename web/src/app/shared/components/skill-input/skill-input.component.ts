import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import {
  Abilities,
  Proficiency,
  Skill,
  Skills,
  createProfToValMap,
  createValToProfMap,
} from 'rpg-app-shared-package/dist/public-api';
import keepOrder from '../../helpers/keepOrder';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-skill-input',
  templateUrl: './skill-input.component.html',
  styleUrls: ['./skill-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: SkillInputComponent,
    },
  ],
})
export class SkillInputComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  public static id: number = 0;
  @Input() maxLevel: Proficiency = Proficiency.L;
  @Input() disableIncrease: boolean = false;
  @Input() upgradeOnly: boolean = false;
  @Input() _skill: Skill;
  @Output() skillChanged: EventEmitter<Skill> = new EventEmitter();

  @Output() levelChange: EventEmitter<1 | -1> = new EventEmitter();

  protected id: number;
  protected skillForm?: FormGroup;
  protected hasSpecialty: FormControl = new FormControl<boolean>(false);

  protected skills = Skills;
  protected proficiencies = Proficiency;
  protected abilities = Abilities;

  protected keepOrderLocal = keepOrder;

  private onTouched = () => {};
  private onChange = (data: Skill) => {};

  private readonly valToProfMap: Map<number, Proficiency> =
    createValToProfMap(0);
  private readonly profToValMap: Map<Proficiency, number> =
    createProfToValMap(0);
  private readonly ngDestroyed$: Subject<void> = new Subject();

  constructor(private fb: FormBuilder) {
    SkillInputComponent.id += 1;
    this.id = SkillInputComponent.id;

    this._skill = {} as Skill;
  }

  public ngOnInit(): void {
    this.initForm();
  }

  public ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  public writeValue(skill: Skill): void {
    this._skill = skill;
    this.setFormData(skill);
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.skillForm?.disable();
    } else {
      this.skillForm?.get('level')?.enable();
      this.skillForm?.get('specialty')?.enable();
    }
  }

  protected increaseLevel(): void {
    const currentLevel = this.skillForm?.value.level;

    if (currentLevel !== Proficiency.L && currentLevel !== this.maxLevel) {
      const newLevel = this.valToProfMap.get(
        (this.profToValMap.get(<Proficiency>currentLevel) ?? 0) + 2
      );

      this.skillForm?.get('level')?.setValue(newLevel);
      this.levelChange.emit(1);
    }
  }

  protected decreaseLevel(): void {
    const currentLevel = this.skillForm?.value.level;

    if (currentLevel !== Proficiency.U) {
      const newLevel = this.valToProfMap.get(
        (this.profToValMap.get(<Proficiency>currentLevel) ?? 0) - 2
      );

      this.skillForm?.get('level')?.setValue(newLevel);
      this.levelChange.emit(-1);
    }
  }

  private dispatchChange(): void {
    this.onChange(this._skill);
    this.skillChanged.emit(this._skill);
  }

  private initForm(): void {
    this.skillForm = this.fb.group({
      name: [null, Validators.required],
      level: [null, Validators.required],
      ability: [null, Validators.required],
      value: [null, Validators.required],
      specialty: null,
    });

    this.skillForm.valueChanges.pipe(takeUntil(this.ngDestroyed$)).subscribe({
      next: (skill: Skill) => {
        this.onTouched();
        this._skill = { ...this._skill, ...skill };
        this.dispatchChange();
      },
    });

    this.hasSpecialty.valueChanges
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: hasSpecialty => {
          if (!hasSpecialty) {
            this.skillForm?.get('specialty')?.setValue(null);
            this.skillForm?.get('specialty')?.disable();
          } else {
            this.skillForm?.get('specialty')?.setValue('');
            this.skillForm?.get('specialty')?.enable();
          }
        },
      });
  }

  private setFormData(skill: Skill): void {
    if (skill.specialty) {
      this.hasSpecialty.setValue(true);
    }

    this.skillForm?.patchValue(
      {
        name: skill.name,
        level: skill.level,
        ability: skill.ability,
        value: skill.value,
        specialty: skill?.specialty,
      },
      { emitEvent: false }
    );

    this.skillForm?.get('name')?.disable();
    this.skillForm?.get('ability')?.disable();
  }
}
