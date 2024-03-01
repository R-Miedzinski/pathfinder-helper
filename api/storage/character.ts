import { cloneDeep } from 'lodash'
import { Character } from '../models/interfaces/character'
import { Classes } from '../models/enums/classes'
import { Race } from '../models/enums/race'
import { Abilities } from '../models/enums/abilities'
import { newSavingThrows } from '../models/interfaces/saving-throw'
import { newSkills } from '../models/interfaces/skill'
import { Alignment } from '../models/enums/alignment'

const inventoryMock = [
    { itemId: '1', count: 1 },
    { itemId: '2', count: 2 },
    { itemId: '3', count: 3 },
    { itemId: '4', count: 1 },
]

const actionsList = ['1', '2', '3', '4', '5']

const spellsId = ['1', '2']

const feats = ['1', '2', '4', '5', '6', '8']

const loremIpsum = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vehicula justo sed risus lacinia, at sagittis lorem malesuada. Vivamus ultricies ullamcorper tortor, non bibendum turpis commodo at. Maecenas nunc lacus, luctus id ante at, egestas ornare tortor. Morbi id erat at ipsum luctus facilisis. In at pretium nisl. Praesent finibus iaculis justo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec a lacus sed turpis lobortis scelerisque. Vivamus bibendum tortor id rhoncus aliquet.</p>
<p>Proin viverra metus ac vulputate accumsan. Praesent aliquet sit amet metus ut faucibus. Vestibulum varius condimentum tellus, sed cursus dui sodales sed. Pellentesque vestibulum at risus vitae suscipit. Sed id venenatis dolor. Vivamus enim augue, tristique a facilisis nec, elementum et eros. Aliquam at velit enim. Morbi ut sollicitudin magna. Fusce ac ipsum lacus. Praesent facilisis ut ipsum a euismod. Nam eu urna augue. Maecenas vulputate vulputate eros, nec porttitor arcu ornare eu. Nam malesuada lacus aliquam lectus elementum laoreet. Suspendisse orci ex, maximus quis dolor eget, egestas auctor tellus.</p>
<p>Phasellus augue erat, rutrum non nisl eu, posuere vestibulum velit. Aliquam sagittis faucibus ornare. Sed eros dolor, finibus non egestas et, fringilla quis magna. Duis sagittis elementum aliquam. Sed sit amet enim eros. Aliquam lacinia commodo quam ut congue. Nam mollis lectus et condimentum iaculis. Sed augue orci, pulvinar rhoncus tortor ac, pharetra pretium ipsum.</p>`

export const characterMock: Character = {
    id: '1',
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
            modifier: 10,
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
        temporary: 10,
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
    savingThrows: newSavingThrows(),
    spellResistance: 80,
    baseAttackBonus: 81,
    cmb: 82,
    cmd: 83,
    skills: newSkills(),
    inventory: cloneDeep(inventoryMock),
    spells: cloneDeep(spellsId),
    actions: cloneDeep(actionsList),
    equippedItems: [{ itemId: '4', count: 1 }],
    backstory: {
        id: '1',
        alignment: Alignment.CE,
        story: loremIpsum,
        image: 'some test image',
        notes: 'Some other notes',
        nationality: 'Aussie',
        ethnicity: 'Also Aussie',
        age: 'Old',
        gender: 'man',
        pronouns: 'he/him',
        height: 1.23,
        weight: 'overweight',
        appearence: 'overweight aussie',
        attitude: 'fine, acceptable',
        beliefs: 'chemtrail enthusiast',
        likes: 'chemtrails',
        dislikes: 'wind and grass',
        deity: 'Grand Kangaroo',
    },
}
