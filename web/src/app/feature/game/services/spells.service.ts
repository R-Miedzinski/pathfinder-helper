import { Injectable, OnDestroy } from '@angular/core';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { cloneDeep } from 'lodash';
import { Spell, SpellType } from 'rpg-app-shared-package/dist/public-api';

export const spellsList: Spell[] = [];

@Injectable()
export class SpellsService implements OnDestroy {
  public spellList$: ReplaySubject<Spell[]> = new ReplaySubject();
  private spells: Spell[] = [];
  private readonly ngOnDestroy$ = new Subject<void>();

  constructor() {
    this.spellList$.pipe(takeUntil(this.ngOnDestroy$)).subscribe({
      next: list => (this.spells = cloneDeep(list)),
    });
  }

  public ngOnDestroy(): void {
    this.ngOnDestroy$.next();
    this.ngOnDestroy$.complete();
  }

  public getSpells(spellIds: string[]): void {
    this.spellList$.next(
      spellIds.map(id => {
        return spellsList.find(spell => spell._id === id) || ({} as Spell);
      })
    );
  }
}
