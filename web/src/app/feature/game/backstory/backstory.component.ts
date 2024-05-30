import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { GameState } from '../ngrx/game-reducer';
import * as GameActions from '../ngrx/game-actions';
import keepOrder from 'src/app/shared/helpers/keepOrder';
import {
  Alignment,
  Backstory,
  CharacterSheetMode,
  Race,
} from 'rpg-app-shared-package/dist/public-api';

@Component({
  selector: 'app-backstory',
  templateUrl: './backstory.component.html',
  styleUrls: ['./backstory.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackstoryComponent implements OnInit, OnDestroy {
  @Input({ required: true }) backstory!: Backstory;
  @Input({ required: true }) race!: Race;
  @Input() rowHeight!: number;
  @Input() name: string = '';
  protected backstoryForm!: FormGroup;
  protected alignments = Alignment;
  private readonly ngDestroyed$: Subject<void> = new Subject();
  protected keepOrderLocal = keepOrder;

  constructor(private fb: FormBuilder, private store: Store<GameState>) {}

  public ngOnInit(): void {
    this.initForm();
  }

  public ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  protected initForm(): void {
    this.backstoryForm = this.fb.group({
      name: [this.name, Validators.required],
      race: [this.race, Validators.required],
      alignment: [this.backstory.alignment, Validators.required],
      story: [this.backstory.story, Validators.required],
      image: this.backstory?.image,
      notes: this.backstory?.notes,
      nationality: this.backstory?.nationality,
      ethnicity: this.backstory?.ethnicity,
      age: this.backstory?.age,
      gender: this.backstory?.gender,
      pronouns: this.backstory?.pronouns,
      height: this.backstory?.height,
      weight: this.backstory?.weight,
      appearence: this.backstory?.appearence,
      attitude: this.backstory?.attitude,
      beliefs: this.backstory?.beliefs,
      likes: this.backstory?.likes,
      dislikes: this.backstory?.dislikes,
      deity: this.backstory?.deity,
    });

    this.backstoryForm.controls['race']?.disable();

    this.backstoryForm.controls['name']?.valueChanges
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: name => this.store.dispatch(GameActions.saveNameAction({ name })),
      });

    this.backstoryForm.controls['race']?.valueChanges
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: race => this.store.dispatch(GameActions.saveRaceAction({ race })),
      });
  }

  protected valueChanged(): void {
    const backstory: Backstory = {
      id: this.backstory.id,
      alignment: this.backstoryForm.controls['alignment'].value,
      story: this.backstoryForm.controls['story'].value,
      notes: this.backstoryForm.controls['notes'].value,
      image: this.backstoryForm.controls['image'].value,
      nationality: this.backstoryForm.controls['nationality'].value,
      ethnicity: this.backstoryForm.controls['ethnicity'].value,
      age: this.backstoryForm.controls['age'].value,
      gender: this.backstoryForm.controls['gender'].value,
      pronouns: this.backstoryForm.controls['pronouns'].value,
      height: this.backstoryForm.controls['height'].value,
      weight: this.backstoryForm.controls['weight'].value,
      appearence: this.backstoryForm.controls['appearence'].value,
      attitude: this.backstoryForm.controls['attitude'].value,
      beliefs: this.backstoryForm.controls['beliefs'].value,
      likes: this.backstoryForm.controls['likes'].value,
      dislikes: this.backstoryForm.controls['dislikes'].value,
      deity: this.backstoryForm.controls['deity'].value,
    };
    this.store.dispatch(GameActions.saveBackstoryAction({ backstory }));
  }
}
