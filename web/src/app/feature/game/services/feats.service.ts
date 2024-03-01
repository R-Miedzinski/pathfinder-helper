import { Injectable, OnDestroy } from '@angular/core';
import { Observable, ReplaySubject, Subject, of, takeUntil } from 'rxjs';
import { cloneDeep } from 'lodash';
import { GameState } from '../ngrx/game-reducer';
import * as GameActions from '../ngrx/game-actions';
import { Store } from '@ngrx/store';
import { FeatCategory } from '../../../shared/models/enums/feat-category';
import { Feat } from '../../../shared/models/interfaces/feat';
import { Classes } from '../../../shared/models/enums/classes';
import { Race } from '../../../shared/models/enums/race';

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
    prerequisits: [{ condition: 'Is Alchemist?', fills: true }],
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
    prerequisits: [{ condition: 'Is Rogue?', fills: false }],
    // activate?: number,
  },
  {
    id: '4',
    name: 'Feat4',
    level: 1,
    category: FeatCategory.general,
    traits: ['some', 'traits'],
    description: 'description of test feat 4',
    eligible: true,
    // activate?: number,
  },
  {
    id: '5',
    name: 'Feat5',
    level: 2,
    category: FeatCategory.feature,
    traits: ['some', 'traits'],
    description: 'description of test feat 5',
    eligible: true,
    // activate?: number,
  },
  {
    id: '6',
    name: 'Feat6',
    level: 3,
    category: FeatCategory.bonus,
    traits: ['some', 'traits'],
    description: 'description of test feat 6',
    eligible: true,
    // activate?: number,
  },
  {
    id: '7',
    name: 'Feat7',
    level: 3,
    category: FeatCategory.ancestry,
    traits: ['some', 'traits'],
    description: 'description of test feat 7',
    eligible: true,
    prerequisits: [{ condition: 'Is Elf?', fills: false }],
    // activate?: number,
  },
  {
    id: '8',
    name: 'Feat8',
    level: 3,
    category: FeatCategory.skill,
    traits: ['some', 'traits'],
    description: 'description of test feat 8',
    eligible: true,
    // activate?: number,
  },
];

@Injectable()
export class FeatsService implements OnDestroy {
  public featList$: ReplaySubject<Feat[]> = new ReplaySubject();
  private feats: Feat[] = [];
  private readonly ngOnDestroy$ = new Subject<void>();

  constructor(private store: Store<GameState>) {
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

  public addFeat(newFeat: Feat): void {
    if (!this.feats.some(feat => feat.id === newFeat.id)) {
      this.featList$.next([...this.feats, newFeat]);
      this.store.dispatch(GameActions.addFeatAction({ feat: newFeat }));
    } else {
      console.error(`Feat ${newFeat.name} already exists on this character`);
    }
  }

  public getFeatsToAdd(
    level: number,
    charClass?: Classes,
    race?: Race
  ): Observable<Feat[]> {
    console.log('Fetching feats: ', level, charClass, race);
    let featsToReturn: Feat[] = [];
    featList.forEach(feat => {
      if (feat.level <= level) {
        featsToReturn.push(feat);
      }
    });

    featsToReturn = <Feat[]>featsToReturn
      .map(feat => {
        if (feat.category === FeatCategory.ancestry) {
          return feat.prerequisits?.some(
            cond => cond.condition === `Is ${race}?`
          )
            ? feat
            : null;
        }

        if (feat.category === FeatCategory.class) {
          return feat.prerequisits?.some(
            cond => cond.condition === `Is ${charClass}?`
          )
            ? feat
            : null;
        }
        return feat;
      })
      .filter(Boolean);

    return of(featsToReturn);
  }
}
