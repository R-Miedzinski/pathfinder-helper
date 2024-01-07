import { Injectable } from '@angular/core';
import { Spell } from '../models/spell';
import { spellsList } from './game-data.service';
import { Observable, of } from 'rxjs';

@Injectable()
export class SpellsService {
  constructor() {}

  public getSpells(spellIds: string[]): Observable<Array<Spell>> {
    return of(
      spellIds.map(id => {
        return spellsList.find(spell => spell.id === id) || ({} as Spell);
      })
    );
  }
}
