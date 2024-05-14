import {
  Abilities,
  AbilityBoostType,
  BackgroundData,
  Proficiency,
  Skills,
} from 'rpg-app-shared-package/dist/public-api'

export const backgroundData: BackgroundData[] = [
  {
    id: '1',
    name: 'Acolyte',
    description: `You spent your early days in a religious monastery or 
        cloister. You may have traveled out into the world to spread 
        the message of your religion or because you cast away the 
        teachings of your faith, but deep down you’ll always carry 
        within you the lessons you learned.`,
    boosts: [
      {
        type: AbilityBoostType.choice,
        abilities: [Abilities.int, Abilities.wis],
      },
      {
        type: AbilityBoostType.free,
        abilities: [],
      },
    ],
    proficiencies: [
      {
        name: Skills.religion,
        level: Proficiency.T,
        ability: Abilities.wis,
      },
      {
        name: Skills.lore,
        level: Proficiency.T,
        specialty: 'Scribing',
        ability: Abilities.int,
      },
    ],
    feats: ['Student of the Canon'],
  },
  {
    id: '2',
    name: 'Acrobat',
    description: `In a circus or on the streets, you earned your pay by 
        performing as an acrobat. You might have turned to 
        adventuring when the money dried up, or simply decided to 
        put your skills to better use.`,
    boosts: [
      {
        type: AbilityBoostType.choice,
        abilities: [Abilities.str, Abilities.dex],
      },
      {
        type: AbilityBoostType.free,
        abilities: [],
      },
    ],
    proficiencies: [
      {
        name: Skills.acrobatics,
        level: Proficiency.T,
        ability: Abilities.dex,
      },
      {
        name: Skills.lore,
        level: Proficiency.T,
        specialty: 'Circus',
        ability: Abilities.int,
      },
    ],
    feats: ['Steady Balance'],
  },
  {
    id: '3',
    name: 'Animal Whisperer',
    description: `You have always felt a connection to animals, and it was 
        only a small leap to learn to train them. As you travel, you 
        continuously encounter different creatures, befriending them 
        along the way.`,
    boosts: [
      {
        type: AbilityBoostType.choice,
        abilities: [Abilities.wis, Abilities.cha],
      },
      {
        type: AbilityBoostType.free,
        abilities: [],
      },
    ],
    proficiencies: [
      {
        name: Skills.nature,
        level: Proficiency.T,
        ability: Abilities.wis,
      },
      {
        name: Skills.lore,
        level: Proficiency.T,
        specialty: 'Terrain',
        ability: Abilities.int,
      },
    ],
    feats: ['Train Animal'],
  },
]
