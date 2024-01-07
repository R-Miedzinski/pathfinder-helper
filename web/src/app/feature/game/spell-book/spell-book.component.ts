import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Spell } from '../models/spell';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-spell-book',
  templateUrl: './spell-book.component.html',
  styleUrls: ['./spell-book.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpellBookComponent {
  @Input() spellList!: Observable<Spell[]>;
}
