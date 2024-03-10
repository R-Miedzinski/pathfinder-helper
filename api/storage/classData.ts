import {
    Abilities,
    AbilityBoostType,
    ArmorCategory,
    ClassData,
    Classes,
    Proficiency,
    SavingThrowName,
    Skills,
    WeaponGroup,
} from 'rpg-app-shared-package/dist/public-api'

export const classData: ClassData[] = [
    {
        id: Classes.alchemist,
        name: Classes.alchemist,
        boosts: [
            {
                type: AbilityBoostType.set,
                abilities: [Abilities.int],
            },
        ],
        keyAbility: Abilities.int,
        description: `The alchemist uses their skill at crafting 
    to create alchemical items—such as 
    bombs, elixirs, and poisons—that they 
    use to defeat foes and aid allies. Smart 
    and resourceful, an alchemist often has 
    just the right tool for the job and esoteric 
    knowledge to help their friends get out of a jam.`,
        baseHp: 8,
        savingThrows: [
            {
                name: SavingThrowName.fortitude,
                level: Proficiency.E,
            },
            {
                name: SavingThrowName.reflex,
                level: Proficiency.E,
            },
            {
                name: SavingThrowName.will,
                level: Proficiency.T,
            },
        ],
        proficiencies: [
            {
                skill: Skills.perception,
                level: Proficiency.T,
            },
            {
                skill: Skills.crafting,
                level: Proficiency.T,
            },
        ],
        weaponProficiencies: [
            {
                type: WeaponGroup.simple,
                level: Proficiency.T,
            },
            {
                type: WeaponGroup.bomb,
                level: Proficiency.T,
            },
            {
                type: WeaponGroup.unarmed,
                level: Proficiency.T,
            },
        ],
        armorProficiencies: [
            {
                type: ArmorCategory.light,
                level: Proficiency.T,
            },
            {
                type: ArmorCategory.unarmored,
                level: Proficiency.T,
            },
        ],
    },
    {
        id: Classes.barbarian,
        name: Classes.barbarian,
        boosts: [
            {
                type: AbilityBoostType.set,
                abilities: [Abilities.str],
            },
        ],
        keyAbility: Abilities.str,
        description: `he barbarian is a fearsome embodiment 
        of rage, focusing the deadly power 
        of their anger against anyone who 
        stands in their way. A barbarian is 
        quick to enter battle and, once their fury 
        has been unleashed, is immensely strong, 
        often unpredictable, and nearly unstoppable.`,
        baseHp: 12,
        savingThrows: [
            {
                name: SavingThrowName.fortitude,
                level: Proficiency.E,
            },
            {
                name: SavingThrowName.reflex,
                level: Proficiency.T,
            },
            {
                name: SavingThrowName.will,
                level: Proficiency.E,
            },
        ],
        proficiencies: [
            {
                skill: Skills.perception,
                level: Proficiency.E,
            },
            {
                skill: Skills.athletics,
                level: Proficiency.T,
            },
        ],
        weaponProficiencies: [
            {
                type: WeaponGroup.simple,
                level: Proficiency.T,
            },
            {
                type: WeaponGroup.martial,
                level: Proficiency.T,
            },
            {
                type: WeaponGroup.unarmed,
                level: Proficiency.T,
            },
        ],
        armorProficiencies: [
            {
                type: ArmorCategory.light,
                level: Proficiency.T,
            },
            {
                type: ArmorCategory.medium,
                level: Proficiency.T,
            },
            {
                type: ArmorCategory.unarmored,
                level: Proficiency.T,
            },
        ],
    },
]
