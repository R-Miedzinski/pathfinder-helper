import { CharacterEffect, CharacterEffectType } from 'rpg-app-shared-package'
import { EffectHandler } from '../models/feat-handler'
import { ActionHandler } from '../models/feat-handlers/action-handler'
import { AddFeatHandler } from '../models/feat-handlers/add-feat-handler'
import { SkillProficiencyHandler } from '../models/feat-handlers/skill-proficiency-handler'
import { DescriptionHandler } from '../models/feat-handlers/description-handler'
import { BoostHandler } from '../models/feat-handlers/boost-handler'
import { FlawHandler } from '../models/feat-handlers/flaw-handler'
import { WeaponProficiencyHandler } from '../models/feat-handlers/weapon-proficiency-handler'
import { ArmorProficiencyHandler } from '../models/feat-handlers/armor-proficiency-handler'
import { SavingThrowHandler } from '../models/feat-handlers/saving-throw-handler'
import { FeatFetcher } from '../services/feat-fetcher'

export function identifyEffect(effect: CharacterEffect, featFetcher: FeatFetcher): EffectHandler {
  // return effect.map((effect) => {
  switch (effect.effectType) {
    case CharacterEffectType.action:
      return new ActionHandler(effect)
    case CharacterEffectType.feat:
      return new AddFeatHandler(effect, featFetcher)
    case CharacterEffectType.skill:
      return new SkillProficiencyHandler(effect)
    case CharacterEffectType.weapon:
      return new WeaponProficiencyHandler(effect)
    case CharacterEffectType.armor:
      return new ArmorProficiencyHandler(effect)
    case CharacterEffectType.savingThrow:
      return new SavingThrowHandler(effect)
    case CharacterEffectType.boost:
      return new BoostHandler(effect)
    case CharacterEffectType.flaw:
      return new FlawHandler(effect)
    default:
      return new DescriptionHandler(effect)
  }
  // })
}
