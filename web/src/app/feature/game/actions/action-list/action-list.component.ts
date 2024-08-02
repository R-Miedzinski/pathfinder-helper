import { Component, Input } from '@angular/core';
import {
  ActionSource,
  CharacterAction,
  CharacterActionType,
} from 'rpg-app-shared-package/dist/public-api';

@Component({
  selector: 'app-action-list',
  templateUrl: './action-list.component.html',
  styleUrls: ['./action-list.component.scss'],
})
export class ActionListComponent {
  @Input() actions: CharacterAction[] = [];
  @Input() filters?: {
    source: ActionSource[];
    category: CharacterActionType[];
    name: string;
  };

  protected shouldDisplayAction(action: CharacterAction): boolean {
    return (
      (action.name
        .toLowerCase()
        .includes(this.filters?.name?.toLocaleLowerCase() ?? '') ||
        (action.traits ?? []).some(trait =>
          trait.includes(this.filters?.name?.toLocaleLowerCase() ?? '')
        )) &&
      (this.filters?.source?.includes(action.source) ||
        !this.filters?.source?.length)
    );
  }
}
