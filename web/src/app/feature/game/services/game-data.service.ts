import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Character } from '../models/character';
import { environment } from 'src/environment/environment';
import { CharacterClassName } from '../models/character-class';
import { Proficiency } from '../models/proficiency';

@Injectable()
export class GameDataService {
  constructor(private httpClient: HttpClient) {}

  getCharacter(id: string): Observable<Character> {
    return of(characterMock);
    return this.httpClient.get<Character>(
      environment.apiUrl + '/api/characters/' + id
    );
  }
}

const characterMock: Character = {
  characterName: 'CHAR_NAME',
  class: {
    name: CharacterClassName.Alchemist,
    feats: [],
  },
  race: {},
  level: 1,
  abilities: {
    str: 7,
    dex: 9,
    con: 12,
    int: 20,
    wis: 14,
    cha: 15,
  },
  hp: {
    current: 20,
    maximum: 25,
    temporary: 0,
  },
  speed: {
    base: 30,
    armored: 25,
    fly: 20,
    swim: 15,
    climb: 10,
    burrow: 5,
  },
  initiativeMod: 2,
  armorClass: 30,
  savingThrows: {
    fortitude: 71,
    reflex: 72,
    will: 73,
  },
  spellResistance: 80,
  baseAttackBonus: 81,
  cmb: 82,
  cmd: 83,
  skills: [
    {
      name: 'skill1',
      level: Proficiency.T,
      value: 5,
    },
    {
      name: 'skill2',
      level: Proficiency.E,
      value: 10,
    },
    {
      name: 'skill3',
      level: Proficiency.U,
      value: 1,
    },
  ],
};
