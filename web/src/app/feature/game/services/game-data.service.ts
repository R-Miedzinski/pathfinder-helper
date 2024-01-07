import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Character } from '../models/character';
import { environment } from 'src/environment/environment';
import { Proficiency } from '../models/enums/proficiency';
import { Race } from '../models/enums/race';
import { cloneDeep } from 'lodash';
import { Skill } from '../models/skill';
import { Classes } from '../models/enums/classes';
import { Skills } from '../models/enums/skills';
import { SavingThrowName } from '../models/enums/saving-throw-names';
import { Abilities } from '../models/enums/abilities';
import { ItemsService } from './items.service';

@Injectable()
export class GameDataService {
  constructor(
    private httpClient: HttpClient,
    private itemsService: ItemsService
  ) {}

  public getCharacter(id: string): Observable<Character> {
    return of(characterMock).pipe(
      tap(character => {
        this.itemsService.getItems(character.inventory);
        character.investedItems?.map(item =>
          this.itemsService.investItem(item)
        );
        character.equippedItems?.map(item => this.itemsService.equipItem(item));
      })
    );
    return this.httpClient.get<Character>(
      environment.apiUrl + '/api/characters/' + id
    );
  }
}

const skillsMock: Skill[] = [
  {
    name: Skills.stealth,
    level: Proficiency.T,
    value: 5,
    ability: Abilities.dex,
  },
  {
    name: Skills.athletics,
    level: Proficiency.E,
    value: 10,
    ability: Abilities.str,
  },
  {
    name: Skills.performance,
    level: Proficiency.U,
    value: 1,
    ability: Abilities.cha,
  },
];

const inventoryMock = [
  { itemId: '1', count: 1 },
  { itemId: '2', count: 2 },
  { itemId: '3', count: 1 },
];

const spellsId = ['1', '2'];

const feats = ['1', '2', '3', '4', '5', '6'];

const characterMock: Character = {
  characterName: 'CHAR_NAME',
  class: Classes.alchemist,
  feats: cloneDeep(feats),
  race: Race.dwarf,
  level: 1,
  abilities: [
    {
      id: 'str',
      name: Abilities.str,
      score: 10,
      modifier: 0,
    },
    {
      id: 'dex',
      name: Abilities.dex,
      score: 13,
      modifier: 1,
    },
    {
      id: 'con',
      name: Abilities.con,
      score: 14,
      modifier: 2,
    },
    {
      id: 'int',
      name: Abilities.int,
      score: 8,
      modifier: -1,
    },
    {
      id: 'wis',
      name: Abilities.wis,
      score: 16,
      modifier: 3,
    },
    {
      id: 'cha',
      name: Abilities.cha,
      score: 7,
      modifier: -2,
    },
  ],
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
  savingThrows: [
    {
      id: '1',
      name: SavingThrowName.fortitude,
      ability: Abilities.con,
      proficiency: Proficiency.T,
      value: 0,
    },
    {
      id: '2',
      name: SavingThrowName.reflex,
      ability: Abilities.dex,
      proficiency: Proficiency.U,
      value: 0,
    },
    {
      id: '3',
      name: SavingThrowName.will,
      ability: Abilities.wis,
      proficiency: Proficiency.M,
      value: 0,
    },
  ],
  spellResistance: 80,
  baseAttackBonus: 81,
  cmb: 82,
  cmd: 83,
  skills: cloneDeep(skillsMock),
  inventory: cloneDeep(inventoryMock),
  spells: cloneDeep(spellsId),
  equippedItems: [{ itemId: '4', count: 1 }],
};
