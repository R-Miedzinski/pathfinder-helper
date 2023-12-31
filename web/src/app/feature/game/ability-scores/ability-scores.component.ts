import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import keepOrder from 'src/app/shared/helpers/keepOrder';

@Component({
  selector: 'app-ability-scores',
  templateUrl: './ability-scores.component.html',
  styleUrls: ['./ability-scores.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AbilityScoresComponent {
  @Input() abilityScores: any;
  Number = Number;
  keepOrderLocal = keepOrder;
}
