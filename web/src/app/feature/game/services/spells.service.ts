import { Injectable, OnDestroy } from '@angular/core';
import { Spell } from '../models/interfaces/spell';
import { ReplaySubject, Subject, of, takeUntil } from 'rxjs';
import { cloneDeep } from 'lodash';
import { SpellType } from '../models/enums/spell-type';

export const spellsList: Spell[] = [
  {
    id: '1',
    name: 'spell1',
    type: SpellType.Spell,
    level: 1,
    tradition: ['Arcane'],
    description: 'description of spell 1',
    school: 'conjuration',
  },
  {
    id: '2',
    name: 'spell2',
    type: SpellType.Cantrip,
    level: 4,
    tradition: ['Occult', 'Primal'],
    description: 'description of spell 2',
    school: 'destruction',
  },
];

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
        return spellsList.find(spell => spell.id === id) || ({} as Spell);
      })
    );
  }
}
