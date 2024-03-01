import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CharacterAction } from '../../../../shared/models/interfaces/character-action';

@Component({
  selector: 'app-action-list',
  templateUrl: './action-list.component.html',
  styleUrls: ['./action-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionListComponent {
  @Input() actions: CharacterAction[] = [];
}
