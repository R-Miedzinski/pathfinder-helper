import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import keepOrder from 'src/app/shared/helpers/keepOrder';
import { Ability } from '../models/ability';

@Component({
  selector: 'app-ability-scores',
  templateUrl: './ability-scores.component.html',
  styleUrls: ['./ability-scores.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AbilityScoresComponent {
  @Input() abilityScores: Ability[] = [];
  Number = Number;
  keepOrderLocal = keepOrder;
}
