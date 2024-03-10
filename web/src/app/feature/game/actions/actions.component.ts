import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  CharacterAction,
  CharacterActionType,
} from 'rpg-app-shared-package/dist/public-api';
import keepOrder from 'src/app/shared/helpers/keepOrder';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsComponent implements OnInit {
  @Input() rowHeight!: number;
  @Input() actions: CharacterAction[] | null = [];
  protected actionType = CharacterActionType;
  protected columnsToShow: CharacterActionType[] = [
    CharacterActionType.base,
    CharacterActionType.encounter,
    CharacterActionType.exploration,
    CharacterActionType.downtime,
  ];
  protected sortedActions: { [key: string]: CharacterAction[] } = {
    [CharacterActionType.base]: [],
    [CharacterActionType.encounter]: [],
    [CharacterActionType.exploration]: [],
    [CharacterActionType.downtime]: [],
  };
  protected keepOrderLocal = keepOrder;

  public ngOnInit(): void {
    this.actions?.forEach(action => {
      this.sortedActions[action.type].push(action);
    });
  }
}
