import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FeatChoice } from 'rpg-app-shared-package/dist/models/game/interfaces/feat-choice';
import { Feat } from 'rpg-app-shared-package/dist/public-api';

@Component({
  selector: 'app-feat',
  templateUrl: './feat.component.html',
  styleUrls: ['./feat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatComponent {
  @Input() feat?: Feat;
  @Input() cardOnly?: boolean;
  @Input() choiceData?: FeatChoice;
}
