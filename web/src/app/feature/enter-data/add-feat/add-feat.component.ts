import {
  Component,
  OnDestroy,
  OnInit,
  forwardRef,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import {
  CharacterEffectType,
  Feat,
  FeatCategory,
} from 'rpg-app-shared-package/dist/public-api';
import { Subject, takeUntil } from 'rxjs';
import { CustomFormControl } from 'src/app/shared/components/custom-form-control/custom-form-control.component';

@Component({
  selector: 'app-add-feat',
  templateUrl: './add-feat.component.html',
  styleUrls: ['./add-feat.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => AddFeatComponent),
    },
  ],
})
export class AddFeatComponent
  extends CustomFormControl<Feat | undefined>
  implements OnInit, OnDestroy
{
  protected newFeatForm: FormGroup = new FormGroup({});

  protected readonly traits = [] as string[];
  protected readonly featCategories = Object.values(FeatCategory).sort();
  protected readonly effectTypes = Object.values(CharacterEffectType).sort();

  private readonly ngDestroyed$: Subject<void> = new Subject();
  constructor(private fb: FormBuilder) {
    super();
  }

  public get effects(): FormArray {
    return this.newFeatForm.get('effect') as FormArray;
  }

  public ngOnInit(): void {
    this.initForm();
  }

  public ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  public override setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.newFeatForm.disable() : this.newFeatForm.enable();
  }

  protected removeTrait(trait: string) {
    const index = this.traits.indexOf(trait);
    if (index >= 0) {
      this.traits.splice(index, 1);
      this.newFeatForm.get('traits')?.setValue(this.traits);
    }
  }

  protected add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.traits.push(value);
      this.newFeatForm.get('traits')?.setValue(this.traits);
    }

    event.chipInput!.clear();
  }

  protected addEffect(): void {
    const newEffect = this.fb.group({
      effectType: [CharacterEffectType.description, Validators.required],
      level: null,
      payload: null,
    });

    this.effects.push(newEffect);
  }

  protected removeEffect(id: number): void {
    this.effects.removeAt(id);
  }

  private initForm(): void {
    this.newFeatForm = this.fb.group({
      name: [null, Validators.required],
      level: [null, Validators.required],
      category: [null, Validators.required],
      traits: [[]],
      description: [null, Validators.required],
      rules: [[]],
      effect: this.fb.array([]),
    });

    this.newFeatForm.valueChanges.pipe(takeUntil(this.ngDestroyed$)).subscribe({
      next: data => {
        if (this.newFeatForm.valid) {
          this.value = data;
        } else {
          this.value = undefined;
        }
        this.updateValue();
      },
    });
  }
}
