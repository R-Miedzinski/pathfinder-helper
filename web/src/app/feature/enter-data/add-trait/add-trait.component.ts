import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Trait } from 'rpg-app-shared-package/dist/public-api';
import { Subject, takeUntil } from 'rxjs';
import { CustomFormControl } from 'src/app/shared/components/custom-form-control/custom-form-control.component';

@Component({
  selector: 'app-add-trait',
  templateUrl: './add-trait.component.html',
  styleUrls: ['./add-trait.component.scss'],
})
export class AddTraitComponent
  extends CustomFormControl<Trait | undefined>
  implements OnInit, OnDestroy
{
  protected newTraitForm: FormGroup = new FormGroup({});

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
    isDisabled ? this.newTraitForm.disable() : this.newTraitForm.enable();
  }

  private initForm(): void {
    this.newTraitForm = this.fb.group({
      id: '0',
      name: [null, Validators.required],
      description: '',
    });

    this.newTraitForm.valueChanges
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: trait => {
          this.value = this.newTraitForm.valid ? trait : undefined;
          this.updateValue();
        },
      });
  }
}
