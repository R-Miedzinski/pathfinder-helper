import { Injectable, OnDestroy } from '@angular/core';
import { Feat } from '../models/feat';
import { FeatCategory } from '../models/enums/feat-category';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { cloneDeep } from 'lodash';

export const featList: Feat[] = [
  {
    id: '1',
    name: 'Feat1',
    level: 1,
    category: FeatCategory.ancestry,
    traits: ['some', 'traits'],
    description: 'description of test feat 1',
    eligible: true,
    prerequisits: [{ condition: 'Is Dwarf?', fills: true }],
    // activate?: number,
  },
  {
    id: '2',
    name: 'Feat2',
    level: 2,
    category: FeatCategory.class,
    traits: ['class feat'],
    description: 'description of test feat 2',
    eligible: true,
    prerequisits: [{ condition: 'Is aclhemist?', fills: true }],
    // activate?: number,
  },
  {
    id: '3',
    name: 'Feat3',
    level: 5,
    category: FeatCategory.class,
    traits: ['rogue feat'],
    description: 'description of test feat 3',
    eligible: true,
    prerequisits: [
      { condition: 'Is Dwarf?', fills: true },
      { condition: 'is Rogue', fills: false },
    ],
    // activate?: number,
  },
  {
    id: '4',
    name: 'Feat4',
    level: 1,
    category: FeatCategory.skill,
    traits: ['some', 'traits'],
    description: 'description of test feat 4',
    eligible: true,
    prerequisits: [{ condition: 'Is Dwarf?', fills: true }],
    // activate?: number,
  },
  {
    id: '5',
    name: 'Feat5',
    level: 2,
    category: FeatCategory.class,
    traits: ['some', 'traits'],
    description: 'description of test feat 5',
    eligible: true,
    // activate?: number,
  },
  {
    id: '6',
    name: 'Feat6',
    level: 3,
    category: FeatCategory.class,
    traits: ['some', 'traits'],
    description: 'description of test feat 6',
    eligible: true,
    // activate?: number,
  },
];

@Injectable()
export class FeatsService implements OnDestroy {
  public featList$: ReplaySubject<Feat[]> = new ReplaySubject();
  private feats: Feat[] = [];
  private readonly ngOnDestroy$ = new Subject<void>();

  constructor() {
    this.featList$.pipe(takeUntil(this.ngOnDestroy$)).subscribe({
      next: list => (this.feats = cloneDeep(list)),
    });
  }

  public ngOnDestroy(): void {
    this.ngOnDestroy$.next();
    this.ngOnDestroy$.complete();
  }

  public getFeats(featIds: string[]): void {
    this.featList$.next(
      featIds.map(id => {
        return featList.find(feat => feat.id === id) || ({} as Feat);
      })
    );
  }
}
