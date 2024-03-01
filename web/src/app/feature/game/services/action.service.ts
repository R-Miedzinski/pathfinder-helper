import { Injectable, OnDestroy } from '@angular/core';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { cloneDeep } from 'lodash';
import { CharacterActionType } from '../../../shared/models/enums/character-action-type';
import { CharacterAction } from '../../../shared/models/interfaces/character-action';

const actionList: CharacterAction[] = [
  {
    id: '1',
    name: 'action1',
    description: 'description of action1',
    type: CharacterActionType.base,
    cost: 1,
  },
  {
    id: '2',
    name: 'action2',
    description: 'description of action2',
    type: CharacterActionType.exploration,
    trigger: 'reaction',
    cost: -1,
  },
  {
    id: '3',
    name: 'action3',
    description: 'description of action3',
    type: CharacterActionType.encounter,
    traits: ['action', 'with', 'traits'],
  },
  {
    id: '4',
    name: 'action4',
    description: 'description of action4',
    type: CharacterActionType.downtime,
    requirements: 'with some requirement',
  },
  {
    id: '5',
    name: 'action5 with long name',
    description:
      'description of action5. this is long description with some inner html <strong>some text</strong>',
    type: CharacterActionType.downtime,
  },
];

@Injectable()
export class ActionService implements OnDestroy {
  public actionsList$: ReplaySubject<CharacterAction[]> = new ReplaySubject();
  private actions: CharacterAction[] = [];
  private readonly ngOnDestroy$ = new Subject<void>();

  constructor() {
    this.actionsList$.pipe(takeUntil(this.ngOnDestroy$)).subscribe({
      next: list => (this.actions = cloneDeep(list)),
    });
  }

  public ngOnDestroy(): void {
    this.ngOnDestroy$.next();
    this.ngOnDestroy$.complete();
  }

  public getActions(actionIds: string[]): void {
    this.actionsList$.next(
      actionIds.map(id => {
        return (
          actionList.find(action => action.id === id) || ({} as CharacterAction)
        );
      })
    );
  }
}
