import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Backstory } from '../models/interfaces/backstory';
import { Race } from '../models/enums/race';
import { CharacterSheetMode } from '../models/enums/character-sheet-mode';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { GameState } from '../ngrx/game-reducer';
import * as GameActions from '../ngrx/game-actions';
import { Alignment } from '../models/enums/alignment';
import keepOrder from 'src/app/shared/helpers/keepOrder';

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
  @Input({ required: true }) mode!: CharacterSheetMode;
  protected modes = CharacterSheetMode;
  protected backstoryForm!: FormGroup;
  protected alignments = Alignment;
  protected ngDestroyed$: Subject<void> = new Subject();
  protected keepOrderLocal = keepOrder;

  constructor(private fb: FormBuilder, private store: Store<GameState>) {}

  public ngOnInit(): void {
    this.initForm();

    this.backstoryForm
      .get('name')
      ?.valueChanges.pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: name => this.store.dispatch(GameActions.saveNameAction({ name })),
      });

    this.backstoryForm
      .get('race')
      ?.valueChanges.pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: race => this.store.dispatch(GameActions.saveRaceAction({ race })),
      });

    this.backstoryForm
      .get('backstory')
      ?.valueChanges.pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: backstory =>
          this.store.dispatch(GameActions.saveBackstoryAction({ backstory })),
      });
  }

  public ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  protected initForm(): void {
    this.backstoryForm = this.fb.group({
      name: [this.name, Validators.required],
      race: [this.race, Validators.required],
      backstory: this.fb.group({
        alignment: [this.backstory.alignment, Validators.required],
        story: [this.backstory.story, Validators.required],
        notes: this.backstory.notes,
        nationality: this.backstory.nationality,
        ethnicity: this.backstory.ethnicity,
        age: this.backstory.age,
        gender: this.backstory.gender,
        pronouns: this.backstory.pronouns,
        height: this.backstory.height,
        weight: this.backstory.weight,
        appearence: this.backstory.appearence,
        attitude: this.backstory.attitude,
        beliefs: this.backstory.beliefs,
        likes: this.backstory.likes,
        dislikes: this.backstory.dislikes,
        deity: this.backstory.deity,
      }),
    });

    this.backstoryForm.get('race')?.disable();
  }
}
