import { Abilities } from "../enums/abilities";
import { Classes } from "../enums/classes";
import { Proficiency } from "../enums/proficiency";
import { Race } from "../enums/race";
import { SavingThrowName } from "../enums/saving-throw-names";
import { Skills } from "../enums/skills";
import { Backstory } from "./backstory";

export interface SeedCharacterData {
  id: string
  name: string
  class: Classes
  ancestryFeats: { id: string; payload: unknown }[]
  classFeats: { id: string; payload: unknown }[]
  skillFeats: { id: string; payload: unknown }[]
  bonusFeats: { id: string; payload: unknown }[]
  generalFeats: { id: string; payload: unknown }[]
  race: Race
  level: number
  boosts: Abilities[]
  flaws: Abilities[]
  savingThrows: { name: SavingThrowName; level: Proficiency }[]
  skills: { name: Skills; level: Proficiency; ability: Abilities; specialty?: string }[]
  inventory: { itemId: string; count: number }[]
  spells: string[]
  equippedItems: { itemId: string; count: number }[]
  investedItems: { itemId: string; count: number }[]
  actions: string[]
  backstory: Backstory
  hp?: {
    maximum?: number
    current?: number
    temporary?: number
  }
}