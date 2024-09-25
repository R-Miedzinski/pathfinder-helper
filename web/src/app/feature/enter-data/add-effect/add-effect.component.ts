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
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import {
  ArmorCategory,
  CharacterEffectType,
  Proficiency,
  SavingThrowName,
  Skills,
  WeaponGroup,
} from 'rpg-app-shared-package/dist/public-api';
import { Subject, takeUntil } from 'rxjs';
import { CustomFormControl } from 'src/app/shared/components/custom-form-control/custom-form-control.component';
import { AddEffectService } from '../services/add-effect.service';
import { cloneDeep } from 'lodash';
import keepOrder from 'src/app/shared/helpers/keepOrder';

@Component({
  selector: 'app-add-effect',
  templateUrl: './add-effect.component.html',
  styleUrls: ['./add-effect.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => AddEffectComponent),
    },
  ],
})
export class AddEffectComponent
  extends CustomFormControl<any>
  implements OnInit, OnDestroy, OnChanges
{
  @Input() effectType?: CharacterEffectType;

  protected payloadForm: FormGroup = new FormGroup({});
  protected allFeats: { id: string; name: string }[] = [];
  protected filteredFeats: typeof this.allFeats = [];
  protected allActions: { id: string; name: string }[] = [];
  protected filteredActions: typeof this.allActions = [];

  protected readonly effectTypes = CharacterEffectType;
  protected readonly proficiencies = Proficiency;
  protected readonly savingThrows = SavingThrowName;
  protected readonly skills = Skills;
  protected readonly skillLore = Skills.lore;
  protected readonly armorCategories = ArmorCategory;
  protected readonly weaponGroups = WeaponGroup;
  protected readonly keepOrderLocal = keepOrder;

  private readonly ngDestroyed$: Subject<void> = new Subject();

  constructor(
    private fb: FormBuilder,
    private addEffectService: AddEffectService
  ) {
    super();
  }

  public get choicesArray(): FormArray {
    return this.payloadForm.get('data') as FormArray;
  }

  public ngOnInit(): void {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['effectType']) {
      this.resetForm();
      this.initForm();
    }
  }

  public ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  public override setDisabledState(isDisabled: boolean): void {}

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

  protected filterActions(event: KeyboardEvent): void {
    const input = (<any>event.target)!.value ?? '';

    if (input) {
      this.filteredActions = this.allActions.filter(action =>
        action.name.toLocaleLowerCase().includes(input.toLocaleLowerCase())
      );
    } else {
      this.filteredActions = cloneDeep(this.allActions);
    }
  }

  protected getActionName(id: string): string {
    return this.allActions.find(item => item.id === id)?.name ?? '';
  }

  protected addChoiceEffect(): void {
    this.choicesArray.push(
      this.fb.group({
        featId: '0',
        choiceName: [null, Validators.required],
        description: [null, Validators.required],
        effect: this.fb.array([]),
      })
    );
  }

  protected removeChoiceEffect(id: number): void {
    this.choicesArray.removeAt(id);
  }

  protected addEffect(id: number): void {
    (this.choicesArray.at(id).get('effect') as FormArray).push(
      this.fb.group({
        effectType: [null, Validators.required],
        level: null,
        payload: null,
      })
    );
  }

  protected removeEffect(effectId: number, choiceId: number): void {
    (this.choicesArray.at(choiceId).get('effect') as FormArray).removeAt(
      effectId
    );
  }

  protected getEffectTypes(): CharacterEffectType[] {
    return Object.values(this.effectTypes)
      .filter(type => type !== CharacterEffectType.choice)
      .sort();
  }

  private initForm(): void {
    switch (this.effectType) {
      case CharacterEffectType.description:
        setTimeout(() => {
          this.value = undefined;
          this.updateValue();
        }, 100);
        break;
      case CharacterEffectType.boost:
        this.payloadForm.addControl(
          'boost',
          this.fb.control(null, Validators.required)
        );
        break;
      case CharacterEffectType.flaw:
        this.payloadForm.addControl(
          'flaw',
          this.fb.control(null, Validators.required)
        );
        break;
      case CharacterEffectType.feat:
        this.addEffectService
          .getFeatIds()
          .pipe(takeUntil(this.ngDestroyed$))
          .subscribe({
            next: feats => {
              this.allFeats = feats;
              this.filteredFeats = feats;
            },
          });
        this.payloadForm.addControl(
          'featId',
          this.fb.control(null, Validators.required)
        );
        break;
      case CharacterEffectType.action:
        this.addEffectService
          .getActionIds()
          .pipe(takeUntil(this.ngDestroyed$))
          .subscribe({
            next: actions => {
              this.allActions = actions;
              this.filteredActions = actions;
            },
          });
        this.payloadForm.addControl(
          'actionId',
          this.fb.control(null, Validators.required)
        );
        break;
      case CharacterEffectType.armor:
        this.payloadForm.addControl(
          'armor',
          this.fb.control(null, Validators.required)
        );
        this.payloadForm.addControl(
          'level',
          this.fb.control(null, Validators.required)
        );
        break;
      case CharacterEffectType.weapon:
        this.payloadForm.addControl(
          'weapon',
          this.fb.control(null, Validators.required)
        );
        this.payloadForm.addControl(
          'level',
          this.fb.control(null, Validators.required)
        );
        break;
      case CharacterEffectType.skill:
        this.payloadForm.addControl(
          'skill',
          this.fb.control(null, Validators.required)
        );
        this.payloadForm.addControl(
          'level',
          this.fb.control(null, Validators.required)
        );
        this.payloadForm.addControl('specialty', this.fb.control(null));
        break;
      case CharacterEffectType.savingThrow:
        this.payloadForm.addControl(
          'savingThrow',
          this.fb.control(null, Validators.required)
        );
        this.payloadForm.addControl(
          'level',
          this.fb.control(null, Validators.required)
        );
        break;
      case CharacterEffectType.choice:
        this.payloadForm.addControl('data', this.fb.array([]));
        break;
      default:
        console.log('default add effect form');
    }

    this.payloadForm.valueChanges.pipe(takeUntil(this.ngDestroyed$)).subscribe({
      next: data => {
        if (this.payloadForm.valid) {
          this.value = data;
          this.updateValue();
        } else {
          this.value = undefined;
          this.updateValue();
        }
      },
    });
  }

  private resetForm(): void {
    const controls = Object.keys(this.payloadForm.controls);

    controls.forEach(ctrl => this.payloadForm.removeControl(ctrl));
  }
}

// EffectChoice {
//   featId: string;
//   choiceName: string;
//   description: string;
//   effect: CharacterEffect[];
// }
