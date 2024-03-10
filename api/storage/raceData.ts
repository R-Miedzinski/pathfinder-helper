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
        darkvision: `You can see in darkness and 
        dim light just as well as you can 
        see in bright light, though your 
        vision in darkness is in black 
        and white`,
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
        darkvision: `You can see in dim light as 
        though it were bright light, 
        so you ignore the concealed 
        condition due to dim light.`,
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
        darkvision: `You can see in dim light as 
        though it were bright light, 
        so you ignore the concealed 
        condition due to dim light.`,
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
        darkvision: `You can see in darkness and 
        dim light just as well as you 
        can see in bright light, though 
        your vision in darkness is in 
        black and white.`,
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
        darkvision: `Your eyes are sharp, allowing 
        you to make out small details 
        about concealed or even 
        invisible creatures that others 
        might miss. You gain a +2 
        circumstance bonus when using 
        the Seek action to find hidden or 
        undetected creatures within 30 
        feet of you. When you target an 
        opponent that is concealed from 
        you or hidden from you, reduce 
        the DC of the flat check to 3 for 
        a concealed target or 9 for a 
        hidden one`,
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
