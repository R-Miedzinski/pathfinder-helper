import { Component, OnDestroy, OnInit } from '@angular/core';
import { EnterDataService } from '../services/enter-data.service';
import { DataCategory, dataCategories } from '../model/data-entry-category';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-enter-data-form',
  templateUrl: './enter-data-form.component.html',
  styleUrls: ['./enter-data-form.component.scss'],
})
export class EnterDataFormComponent implements OnInit, OnDestroy {
  protected categoryControl = new FormControl();
  protected data: any = undefined;
  protected responseMsg?: string;

  protected readonly categories = DataCategory;
  protected readonly dataCategories = dataCategories;

  private readonly ngDestroyed$: Subject<void> = new Subject();
  constructor(private enterDataService: EnterDataService) {}

  public ngOnInit(): void {
    this.clearData();
  }

  public ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  protected submitData(): void {
    this.enterDataService
      .create(this.data, this.categoryControl.value)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: response => {
          this.responseMsg = response;
          this.clearData();
        },
        error: err => {
          this.responseMsg = err;
        },
      });
  }

  private clearData(): void {
    this.data = undefined;

    if (this.dataCategories.length === 1) {
      this.categoryControl.setValue(this.dataCategories[0]);
    } else {
      this.categoryControl.setValue(undefined);
    }
  }
}
