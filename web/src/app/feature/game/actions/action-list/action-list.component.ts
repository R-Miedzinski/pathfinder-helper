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
}
