import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Character } from '../models/character';
import { environment } from 'src/environment/environment';
import { Proficiency } from '../models/enums/proficiency';
import { Abilities } from '../models/classes/abilities';
import { Race } from '../models/enums/race';
import { cloneDeep } from 'lodash';
import { Skill } from '../models/skill';
import { Item } from '../models/item';
import { Spell } from '../models/spell';
import { Weapon } from '../models/weapon';
import { WeaponGroup } from '../models/enums/weapon-group';
import { DamageType } from '../models/enums/damage-type';
import { Dice } from '../models/classes/dice';
import { Classes } from '../models/enums/classes';
import { Skills } from '../models/enums/skills';
import { Armor } from '../models/armor';
import { ArmorCategory } from '../models/enums/armor-category';
import { ArmorGroup } from '../models/enums/armor-group';
import { EquipmentSlots } from '../models/classes/equipment-slots';
import { ItemType } from '../models/enums/item-type';

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

const abilities = new Abilities();

const skillsMock: Skill[] = [
  {
    name: Skills.stealth,
    level: Proficiency.T,
    value: 5,
    ability: 'dex',
  },
  {
    name: Skills.athletics,
    level: Proficiency.E,
    value: 10,
    ability: 'str',
  },
  {
    name: Skills.performance,
    level: Proficiency.U,
    value: 1,
    ability: 'cha',
  },
];

const inventoryMock: Item[] = [
  {
    equippable: false,
    itemType: ItemType.item,
    name: 'testItem1',
    level: 1,
    description: 'descritpion of testItem1',
    usage: 'usage',
    activate: 3,
  },
  {
    equippable: false,
    itemType: ItemType.item,
    name: 'testItem2',
    level: 2,
    description: 'descritpion of testItem2',
    traits: ['with', 'traits'],
    type: 'with type',
  },
  {
    equippable: true,
    itemType: ItemType.item,
    name: 'testItem3',
    level: 3,
    price: 10,
    description: 'descritpion of testItem3',
    craftRequirenments: 'some craft reqs',
  },
  <Weapon>{
    equippable: true,
    itemType: ItemType.weapon,
    name: 'testItem4',
    level: 4,
    damage: new Dice(1, 8),
    group: WeaponGroup.sword,
    damageType: DamageType.slashing,
    hands: 1,
    description: `descritpion of testItem4. This one is quite long. Let's even say this one is a weapon.
    Deals ${new Dice(1, 8)} dmg `,
    craftRequirenments: 'some craft reqs, maybe some ore and wood.',
  },
  <Armor>{
    equippable: true,
    itemType: ItemType.armor,
    name: 'testItem5',
    level: 6,
    category: ArmorCategory.medium,
    group: ArmorGroup.leather,
    ACbonus: 3,
    DexcCap: 2,
    checkPenalty: 3,
    speedPenalty: 5,
    minStrenght: 14,
    description: 'descritpion of testItem5. Test armor',
  },
  {
    equippable: false,
    itemType: ItemType.item,
    name: 'testItem6',
    level: 3,
    price: 10,
    description: `descritpion of testItem6, which is really, really long. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris lacinia faucibus urna, eget lacinia sem suscipit non. Curabitur convallis placerat est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus iaculis tincidunt augue. Sed sollicitudin a justo sit amet sagittis. In non magna vitae nisi accumsan sagittis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla imperdiet dignissim nisi, et venenatis turpis pellentesque laoreet. Integer id libero tortor. Donec efficitur rutrum sapien, ac faucibus sem iaculis venenatis.
      Interdum et malesuada fames ac ante ipsum primis in faucibus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nunc eget eros suscipit, imperdiet nisi ac, ullamcorper risus. Suspendisse tempus massa nisl, ut varius risus lobortis sit amet. Mauris mauris tellus, fringilla id faucibus ut, semper placerat nulla. Mauris ac tortor in ex feugiat aliquet. Aenean velit dui, imperdiet quis porta a, tristique a urna. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam eget diam tincidunt, pharetra arcu nec, porttitor lacus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.`,
    craftRequirenments: 'some craft reqs',
  },
];

const spellsMock: Spell[] = [
  {
    name: 'spell1',
    type: 'spell',
    level: 1,
    tradition: ['Arcane'],
    description: 'description of spell 1',
    school: 'conjuration',
  },
  {
    name: 'spell2',
    type: 'cantrip',
    level: 4,
    tradition: ['Occult', 'Primal'],
    description: 'description of spell 2',
    school: 'destruction',
  },
];

const characterMock: Character = {
  characterName: 'CHAR_NAME',
  class: {
    name: Classes.alchemist,
    feats: [
      {
        name: 'someFeat',
        level: 1,
        description: 'someTestFeat',
        prerequisits: [
          {
            name: `Is ${Race.dwarf}?`,
            condition: (character: Character) => character.race === Race.dwarf,
          },
        ],
      },
    ],
  },
  race: Race.dwarf,
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
  skills: cloneDeep(skillsMock),
  inventory: cloneDeep(inventoryMock),
  spells: cloneDeep(spellsMock),
  equipment: new EquipmentSlots(),
  equippedItems: [{ item: inventoryMock[4].name, quantity: 1 }],
};
