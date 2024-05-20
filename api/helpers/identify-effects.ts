import { FeatData, FeatEffectType } from 'rpg-app-shared-package'
import { FeatHandler } from '../models/feat-handler'
import { ActionHandler } from '../models/feat-handlers/action-handler'
import { AddFeatHandler } from '../models/feat-handlers/add-feat-handler'
import { SkillProficiencyHandler } from '../models/feat-handlers/skill-proficiency-handler'
import { DescriptionHandler } from '../models/feat-handlers/description-handler'
import { BoostHandler } from '../models/feat-handlers/boost-handler'
import { FlawHandler } from '../models/feat-handlers/flaw-handler'
import { WeaponProficiencyHandler } from '../models/feat-handlers/weapon-proficiency-handler'
import { ArmorProficiencyHandler } from '../models/feat-handlers/armor-proficiency-handler'
import { SavingThrowHandler } from '../models/feat-handlers/saving-throw-handler'
import { FeatFetcher } from './feat-fetcher'

export function identifyEffects(feat: FeatData, featFetcher: FeatFetcher): FeatHandler[] {
  return feat.effect.map((effect) => {
    switch (effect.effectType) {
      case FeatEffectType.action:
        return new ActionHandler(effect)
      case FeatEffectType.feat:
        return new AddFeatHandler(effect, featFetcher)
      case FeatEffectType.skill:
        return new SkillProficiencyHandler(effect)
      case FeatEffectType.weapon:
        return new WeaponProficiencyHandler(effect)
      case FeatEffectType.armor:
        return new ArmorProficiencyHandler(effect)
      case FeatEffectType.savingThrow:
        return new SavingThrowHandler(effect)
      case FeatEffectType.boost:
        return new BoostHandler(effect)
      case FeatEffectType.flaw:
        return new FlawHandler(effect)
      default:
        return new DescriptionHandler(effect)
    }
  })
}
