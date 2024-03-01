import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import keepOrder from 'src/app/shared/helpers/keepOrder';
import { Spell } from '../../../shared/models/interfaces/spell';
import { SpellType } from '../../../shared/models/enums/spell-type';

@Component({
  selector: 'app-spell-book',
  templateUrl: './spell-book.component.html',
  styleUrls: ['./spell-book.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpellBookComponent implements OnInit {
  @Input() spellList: Spell[] | null = [];
  sortedSpells: { [key: string]: Spell[] } = {
    cantrips: [],
    focus: [],
    'level 1': [],
    'level 2': [],
    'level 3': [],
    'level 4': [],
    'level 5': [],
    'level 6': [],
    'level 7': [],
    'level 8': [],
    'level 9': [],
    'level 10': [],
  };
  protected keepOrderLocal = keepOrder;

  public ngOnInit(): void {
    // console.log('spell List received: ', this.spellList);
    if (this.spellList !== null) {
      this.sortSpells(this.spellList);
      // console.log('sorted spell list: ', this.sortedSpells);
    }
  }

  protected sortSpells(spells: Spell[]): void {
    spells.forEach(spell => {
      // console.log('current sorted spell: ', spell);
      if (spell.type === SpellType.Cantrip) {
        this.sortedSpells['cantrips']?.indexOf(spell) > -1
          ? console.log('spell already in the spell list', spell.name)
          : this.sortedSpells['cantrips'].length >= 0
          ? this.sortedSpells['cantrips'].push(spell)
          : (this.sortedSpells['cantrips'] = [spell]);
      }

      if (spell.type === SpellType.Focus) {
        this.sortedSpells['focus']?.indexOf(spell) > -1
          ? ''
          : this.sortedSpells['focus']?.length > 0
          ? this.sortedSpells['focus'].push(spell)
          : (this.sortedSpells['focus'] = [spell]);
      }

      if (spell.type === SpellType.Spell) {
        this.sortedSpells[`level ${spell.level}`]?.indexOf(spell) > -1
          ? ''
          : this.sortedSpells[`level ${spell.level}`]?.length > 0
          ? this.sortedSpells[`level ${spell.level}`].push(spell)
          : (this.sortedSpells[`level ${spell.level}`] = [spell]);
      }
    });
  }
}
