import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  ActionSource,
  CharacterAction,
  CharacterActionType,
} from 'rpg-app-shared-package/dist/public-api';
import keepOrder from 'src/app/shared/helpers/keepOrder';
import { GameState } from '../ngrx/game-reducer';
import * as GameSelectors from '../ngrx/game-selector';
import { Subject, takeUntil } from 'rxjs';
import { ActionService } from '../services/action.service';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})
export class ActionsComponent implements OnInit, OnDestroy {
  @Input() public rowHeight!: number;
  protected actionType = CharacterActionType;
  protected actionSource = ActionSource;
  protected sortedActions: { [key: string]: CharacterAction[] } = {
    [CharacterActionType.base]: [],
    [CharacterActionType.encounter]: [],
    [CharacterActionType.exploration]: [],
    [CharacterActionType.downtime]: [],
    [CharacterActionType.skilled]: [],
  };
  protected filters: {
    source: ActionSource[];
    category: CharacterActionType[];
    name: string;
  } = {
    source: [
      // ActionSource.BASE,
      ActionSource.CLASS,
      ActionSource.FEAT,
      ActionSource.OTHER,
    ],
    category: [
      // CharacterActionType.base,
      CharacterActionType.skilled,
      // CharacterActionType.downtime,
      CharacterActionType.encounter,
      CharacterActionType.exploration,
    ],
    name: '',
  };
  protected keepOrderLocal = keepOrder;

  private readonly ngDestroyed$: Subject<void> = new Subject();

  constructor(
    private store: Store<GameState>,
    private actionService: ActionService
  ) {}

  public ngOnInit(): void {
    this.store
      .select(GameSelectors.getActions)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: (actionIds: string[]) => {
          if (actionIds.length) {
            this.actionService
              .getActions(actionIds)
              .pipe(takeUntil(this.ngDestroyed$))
              .subscribe({
                next: data => {
                  this.clearSortedActions();
                  data.forEach(action => {
                    this.sortedActions[action.type].push(action);
                  });
                },
              });
          }
        },
      });
  }

  public ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  private clearSortedActions(): void {
    this.sortedActions = {
      [CharacterActionType.base]: [],
      [CharacterActionType.encounter]: [],
      [CharacterActionType.exploration]: [],
      [CharacterActionType.downtime]: [],
      [CharacterActionType.skilled]: [],
    };
  }
}
