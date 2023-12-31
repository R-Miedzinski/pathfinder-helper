import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Spell } from 'src/app/feature/game/models/spell';

@Component({
  selector: 'app-spell',
  templateUrl: './spell.component.html',
  styleUrls: ['./spell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpellComponent {
  @Input() spell!: Spell;
}
