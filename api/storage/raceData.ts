import { Abilities, AbilityBoostType, CreatureSize, Race, RaceData } from 'rpg-app-shared-package'

export const raceData: RaceData[] = [
  {
    name: Race.dwarf,
    description: `Dwarves are a short, stocky people who are often stubborn, fierce, and devoted.`,
    boosts: [
      {
        type: AbilityBoostType.set,
        abilities: [Abilities.con],
      },
      {
        type: AbilityBoostType.set,
        abilities: [Abilities.wis],
      },
      {
        type: AbilityBoostType.free,
        abilities: [],
      },
    ],
    flaws: [
      {
        type: AbilityBoostType.set,
        abilities: [Abilities.cha],
      },
    ],
    size: CreatureSize.medium,
    baseSpeed: 20,
    languages: ['Common', 'Dwarven'],
    traits: [Race.dwarf, 'Humanoid'],
    baseHp: 10,
    darkvision: 'darkvision',
  },
  {
    name: Race.elf,
    description: `Elves are a tall, slender, long-lived people with a strong tradition of art and magic.`,
    boosts: [
      {
        type: AbilityBoostType.set,
        abilities: [Abilities.dex],
      },
      {
        type: AbilityBoostType.set,
        abilities: [Abilities.int],
      },
      {
        type: AbilityBoostType.free,
        abilities: [],
      },
    ],
    flaws: [
      {
        type: AbilityBoostType.set,
        abilities: [Abilities.con],
      },
    ],
    size: CreatureSize.medium,
    baseSpeed: 30,
    languages: ['Common', 'Elven'],
    traits: [Race.elf, 'Humanoid'],
    baseHp: 6,
    darkvision: 'low-light-vision',
  },
  {
    name: Race.gnome,
    description: `Gnomes are short and hardy folk, with an unquenchable curiosity and eccentric habits.`,
    boosts: [
      {
        type: AbilityBoostType.set,
        abilities: [Abilities.con],
      },
      {
        type: AbilityBoostType.set,
        abilities: [Abilities.cha],
      },
      {
        type: AbilityBoostType.free,
        abilities: [],
      },
    ],
    flaws: [
      {
        type: AbilityBoostType.set,
        abilities: [Abilities.str],
      },
    ],
    size: CreatureSize.small,
    baseSpeed: 25,
    languages: ['Common', 'Gnomish'],
    traits: [Race.gnome, 'Humanoid'],
    baseHp: 8,
    darkvision: 'low-light-vision',
  },
  {
    name: Race.goblin,
    description: `Goblins are a short, scrappy, energetic people who have spent millennia maligned and feared.`,
    boosts: [
      {
        type: AbilityBoostType.set,
        abilities: [Abilities.dex],
      },
      {
        type: AbilityBoostType.set,
        abilities: [Abilities.cha],
      },
      {
        type: AbilityBoostType.free,
        abilities: [],
      },
    ],
    flaws: [
      {
        type: AbilityBoostType.set,
        abilities: [Abilities.wis],
      },
    ],
    size: CreatureSize.small,
    baseSpeed: 25,
    languages: ['Common', 'Goblin'],
    traits: [Race.goblin, 'Humanoid'],
    baseHp: 6,
    darkvision: 'darkvision',
  },
  {
    name: Race.halfling,
    description: `Halflings are a short, adaptable people who exhibit remarkable curiosity and humor.`,
    boosts: [
      {
        type: AbilityBoostType.set,
        abilities: [Abilities.dex],
      },
      {
        type: AbilityBoostType.set,
        abilities: [Abilities.wis],
      },
      {
        type: AbilityBoostType.free,
        abilities: [],
      },
    ],
    flaws: [
      {
        type: AbilityBoostType.set,
        abilities: [Abilities.str],
      },
    ],
    size: CreatureSize.small,
    baseSpeed: 25,
    languages: ['Common', 'Halfling'],
    traits: [Race.halfling, 'Humanoid'],
    baseHp: 6,
    darkvision: 'keen-eyes',
  },
  {
    name: Race.human,
    description: `Humans are incredibly diverse. Some, such as half-elves and half-orcs, even have non-human ancestors.`,
    boosts: [
      {
        type: AbilityBoostType.free,
        abilities: [],
      },
      {
        type: AbilityBoostType.free,
        abilities: [],
      },
    ],
    flaws: [],
    size: CreatureSize.small,
    baseSpeed: 25,
    languages: ['Common'],
    traits: [Race.human, 'Humanoid'],
    baseHp: 8,
  },
  {
    name: Race.halfElf,
    description: `A half-elf is born to an elf and a human, or to two half-elves. The life of a half-elf can be difficult, often marked by a struggle to fit in.`,
    boosts: [
      {
        type: AbilityBoostType.free,
        abilities: [],
      },
      {
        type: AbilityBoostType.free,
        abilities: [],
      },
    ],
    flaws: [],
    size: CreatureSize.small,
    baseSpeed: 25,
    languages: ['Common'],
    traits: [Race.human, Race.halfElf, 'Humanoid'],
    baseHp: 8,
  },
  {
    name: Race.halfOrc,
    description: `A half-orc is the offspring of a human and an orc, or of two half-orcs. Because some intolerant people see orcs as more akin to monsters than people, they sometimes hate and fear half-orcs simply due to their lineage.`,
    boosts: [
      {
        type: AbilityBoostType.free,
        abilities: [],
      },
      {
        type: AbilityBoostType.free,
        abilities: [],
      },
    ],
    flaws: [],
    size: CreatureSize.small,
    baseSpeed: 25,
    languages: ['Common'],
    traits: [Race.human, Race.halfOrc, 'Humanoid'],
    baseHp: 8,
  },
]
