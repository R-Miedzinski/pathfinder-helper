import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { cloneDeep } from 'lodash';
import {
  Abilities,
  AbilityBoostType,
  BackgroundData,
  Proficiency,
  Skill,
  Skills,
  skillToAbilityMap,
} from 'rpg-app-shared-package/dist/public-api';
import { Subject, takeUntil } from 'rxjs';
import { CustomFormControl } from 'src/app/shared/components/custom-form-control/custom-form-control.component';
import { AddEffectService } from '../../services/add-effect.service';

@Component({
  selector: 'app-add-background',
  templateUrl: './add-background.component.html',
  styleUrls: ['./add-background.component.scss'],
})
export class AddBackgroundComponent
  extends CustomFormControl<BackgroundData | undefined>
  implements OnInit, OnDestroy
{
  protected allFeats: { id: string; name: string }[] = [];
  protected filteredFeats: typeof this.allFeats = [];

  protected newBackgroundForm: FormGroup = new FormGroup({});
  protected readonly traits = [] as string[];

  protected readonly boostTypes = Object.values(AbilityBoostType);
  protected readonly abilities = Object.values(Abilities);
  protected readonly allSkills = Object.values(Skills);
  protected readonly allProficiencies = Object.values(Proficiency).filter(
    level => level !== Proficiency.U
  );
  protected readonly skillLore = Skills.lore;
  private readonly ngDestroyed$: Subject<void> = new Subject();

  constructor(
    private fb: FormBuilder,
    private addEffectService: AddEffectService
  ) {
    super();
  }

  public get boosts(): FormArray {
    return this.newBackgroundForm.get('boosts') as FormArray;
  }

  public get skills(): FormArray {
    return this.newBackgroundForm.get('proficiencies') as FormArray;
  }

  public ngOnInit(): void {
    this.addEffectService
      .getFeatIds()
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: feats => {
          this.allFeats = feats;
          this.filteredFeats = feats;
        },
      });
    this.initForm();
  }

  public ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  public override setDisabledState(isDisabled: boolean): void {
    isDisabled
      ? this.newBackgroundForm.disable()
      : this.newBackgroundForm.enable();
  }

  protected filterFeats(event: KeyboardEvent): void {
    const input = (<any>event.target)!.value ?? '';

    if (input) {
      this.filteredFeats = this.allFeats.filter(feat =>
        feat.name.toLocaleLowerCase().includes(input.toLocaleLowerCase())
      );
    } else {
      this.filteredFeats = cloneDeep(this.allFeats);
    }
  }

  protected getFeatName(id: string): string {
    return this.allFeats.find(item => item.id === id)?.name ?? '';
  }

  protected addBoost(): void {
    const group = this.fb.group({
      type: [null, Validators.required],
      abilities: [[]],
    });

    group.addValidators((control: AbstractControl) => {
      const type = control.get('type')?.value;
      const abilities = control.get('abilities')?.value;

      if (type === AbilityBoostType.set && abilities.length !== 1) {
        return { invalidAbilitiesNumber: true };
      } else if (
        type === AbilityBoostType.choice &&
        (abilities.length === 0 || abilities.length === this.abilities.length)
      ) {
        return { invalidAbilitiesNumber: true };
      } else if (type === AbilityBoostType.free && abilities.length) {
        return { invalidAbilitiesNumber: true };
      }

      return null;
    });

    this.boosts.push(group);
  }

  protected removeBoost(id: number): void {
    this.boosts.removeAt(id);
  }

  protected addProficiency(): void {
    this.skills.push(
      this.fb.group({
        name: [null, Validators.required],
        level: [null, Validators.required],
        specialty: null,
        ability: null,
      })
    );
  }

  protected removeProficiency(id: number): void {
    this.skills.removeAt(id);
  }

  private initForm(): void {
    this.newBackgroundForm = this.fb.group({
      id: '0',
      name: [null, Validators.required],
      description: [null, Validators.required],
      boosts: this.fb.array([]),
      proficiencies: this.fb.array([]),
      feats: [[]],
    });

    this.newBackgroundForm.valueChanges
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: background => {
          if (this.newBackgroundForm.valid) {
            background.proficiencies.forEach(
              (skill: Skill) => (skill.ability = skillToAbilityMap[skill.name])
            );
            this.value = background;
          } else {
            this.value = undefined;
          }
          this.updateValue();
        },
      });
  }
}
