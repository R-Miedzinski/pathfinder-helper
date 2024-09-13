import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Spell } from 'rpg-app-shared-package/dist/public-api';

@Component({
  selector: 'app-spell',
  templateUrl: './spell.component.html',
  styleUrls: ['./spell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpellComponent {
  @Input() spell!: Spell;
}
