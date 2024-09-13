import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Alignment, Backstory } from 'rpg-app-shared-package/dist/public-api';
import { Subject, takeUntil } from 'rxjs';
import keepOrder from 'src/app/shared/helpers/keepOrder';

@Component({
  selector: 'app-backstory-form',
  templateUrl: './backstory-form.component.html',
  styleUrls: ['./backstory-form.component.scss'],
})
export class BackstoryFormComponent implements OnInit, OnDestroy {
  @Output() backstory: EventEmitter<Backstory> = new EventEmitter();
  @Output() name: EventEmitter<string> = new EventEmitter();

  protected backstoryForm: FormGroup = new FormGroup({});
  protected nameControl: FormControl = new FormControl<string>(
    '',
    Validators.required
  );

  protected readonly alignments = Alignment;
  protected readonly keepOrderLocal = keepOrder;
  private readonly ngDestroyed$: Subject<void> = new Subject();

  constructor(private fb: FormBuilder) {}

  public ngOnInit(): void {
    this.initBackstoryForm();
  }

  public ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  private initBackstoryForm(): void {
    this.backstoryForm = this.fb.group({
      story: ['', Validators.required],
      alignment: [Alignment.N, Validators.required],
      languages: [[]],
      nationality: [''],
      ethnicity: [''],
      deity: [''],
      age: [''],
      gender: [''],
      pronouns: [''],
      height: [''],
      weight: [''],
      appearence: [''],
      attitude: [''],
      beliefs: [''],
      likes: [''],
      dislikes: [''],
      notes: [''],
    });

    this.backstoryForm.valueChanges
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: (backstory: Backstory) => {
          if (this.backstoryForm?.valid) {
            this.backstory.emit(backstory);
          }
        },
      });

    this.nameControl.valueChanges.pipe(takeUntil(this.ngDestroyed$)).subscribe({
      next: name => {
        console.log('name changed:', name, this.nameControl.valid);
        if (this.nameControl.valid) {
          this.name.emit(name);
        }
      },
    });
  }
}
