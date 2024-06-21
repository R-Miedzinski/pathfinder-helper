import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  forwardRef,
} from '@angular/core';
import {
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
import { CustomFormControl } from '../custom-form-control/custom-form-control.component';

@Component({
  selector: 'app-skill-input',
  templateUrl: './skill-input.component.html',
  styleUrls: ['./skill-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SkillInputComponent),
    },
  ],
})
export class SkillInputComponent
  extends CustomFormControl<Skill>
  implements OnInit, OnDestroy
{
  public static id: number = 0;
  @Input() maxLevel: Proficiency = Proficiency.L;
  @Input() disableIncrease: boolean = false;
  @Input() upgradeOnly: boolean = false;

  @Output() levelChange: EventEmitter<1 | -1> = new EventEmitter();

  protected id: number;
  protected skillForm?: FormGroup;
  protected hasSpecialty: FormControl = new FormControl<boolean>(false);

  protected skills = Skills;
  protected proficiencies = Proficiency;
  protected abilities = Abilities;

  protected keepOrderLocal = keepOrder;

  private readonly valToProfMap: Map<number, Proficiency> =
    createValToProfMap(0);
  private readonly profToValMap: Map<Proficiency, number> =
    createProfToValMap(0);
  private readonly ngDestroyed$: Subject<void> = new Subject();

  constructor(private fb: FormBuilder) {
    super();
    SkillInputComponent.id += 1;
    this.id = SkillInputComponent.id;
  }

  public ngOnInit(): void {
    this.initForm();
  }

  public ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  public override writeValue(value: Skill): void {
    super.writeValue(value);
    this.setFormData(value);
  }

  public setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.skillForm?.disable();
    } else {
      this.skillForm?.get('level')?.enable();
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
        this.value = { ...this.value, ...skill };
        this.updateValue();
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
      }
      // { emitEvent: false }
    );

    this.skillForm?.get('name')?.disable();
    this.skillForm?.get('ability')?.disable();
    this.skillForm?.get('specialty')?.disable();
    this.hasSpecialty.disable();
  }
}
