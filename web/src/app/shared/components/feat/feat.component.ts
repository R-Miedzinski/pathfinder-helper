import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Feat, EffectChoice } from 'rpg-app-shared-package/dist/public-api';

@Component({
  selector: 'app-feat',
  templateUrl: './feat.component.html',
  styleUrls: ['./feat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatComponent {
  @Input() feat?: Feat;
  @Input() cardOnly?: boolean;
  @Input() choiceData?: EffectChoice;
}
