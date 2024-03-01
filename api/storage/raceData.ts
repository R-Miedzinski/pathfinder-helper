import { Abilities } from '../models/enums/abilities'
import { Race } from '../models/enums/race'
import { AbilityBoostType } from '../models/interfaces/ability-boost'
import { RaceData } from '../models/interfaces/race-data'

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
    },
]
