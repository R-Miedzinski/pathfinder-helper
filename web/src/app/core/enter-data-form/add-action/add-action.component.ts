import { trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import {
  ActionSource,
  CharacterAction,
  CharacterActionType,
} from 'rpg-app-shared-package/dist/public-api';
import { Subject, takeUntil } from 'rxjs';
import { CustomFormControl } from 'src/app/shared/components/custom-form-control/custom-form-control.component';

@Component({
  selector: 'app-add-action',
  templateUrl: './add-action.component.html',
  styleUrls: ['./add-action.component.scss'],
})
export class AddActionComponent
  extends CustomFormControl<CharacterAction | undefined>
  implements OnInit, OnDestroy
{
  protected newActionForm: FormGroup = new FormGroup({});
  protected readonly traits = [] as string[];

  protected readonly actionSources = Object.values(ActionSource);
  protected readonly actionTypes = Object.values(CharacterActionType);
  protected readonly actionCosts = [-1, 0, 1, 2, 3];

  private readonly ngDestroyed$: Subject<void> = new Subject();

  constructor(private fb: FormBuilder) {
    super();
  }

  public ngOnInit(): void {
    this.initForm();
  }

  public ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  public override setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.newActionForm.disable() : this.newActionForm.enable();
  }

  protected removeTrait(trait: string) {
    const index = this.traits.indexOf(trait);
    if (index >= 0) {
      this.traits.splice(index, 1);
      this.newActionForm.get('traits')?.setValue(this.traits);
    }
  }

  protected add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.traits.push(value);
      this.newActionForm.get('traits')?.setValue(this.traits);
    }

    event.chipInput!.clear();
  }

  private initForm(): void {
    this.newActionForm = this.fb.group({
      id: '0',
      name: [null, Validators.required],
      description: [null, Validators.required],
      type: [null, Validators.required],
      source: [null, Validators.required],
      effects: this.fb.group({
        criticalSuccess: null,
        success: null,
        failure: null,
        criticalFailure: null,
      }),
      cost: null,
      materials: null,
      traits: [],
      trigger: null,
      rules: null,
    });

    this.newActionForm.valueChanges
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: action => {
          this.value = this.newActionForm.valid ? action : undefined;
          this.updateValue();
        },
      });
  }
}
