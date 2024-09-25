import { Injectable } from '@angular/core';
import {
  Abilities,
  BackgroundData,
  Backstory,
  CharacterEffectType,
  DisplayInitClassData,
  EffectChoice,
  Feat,
  GrantSkillProficiencyEffect,
  RaceData,
  SeedCharacterData,
  Skill,
  skillToAbilityMap,
} from 'rpg-app-shared-package/dist/public-api';
import { LevelUpBonusesService } from './level-up-bonuses.service';

@Injectable({
  providedIn: 'root',
})
export class NewCharacterService {
  public abilityModifiers?: Record<Abilities, number>;
  private _characterName?: string;
  private _backstory?: Backstory;
  private _classData?: DisplayInitClassData;
  private _classBoosts?: Abilities[];
  private _background?: BackgroundData;
  private _backgroundBoosts?: Abilities[];
  private _race?: RaceData;
  private _raceAbilities?: { boosts: Abilities[]; flaws: Abilities[] };
  private _heritageFeat?: string;
  private _heritageEffect?: EffectChoice;
  private _ancestryFeat?: string;
  private _ancestryEffect?: EffectChoice;
  private _skills?: Skill[];
  private _languages?: string[];

  private languagesToAdd: number = 0;
  private skillsToAdd: number = 0;

  constructor(private levelUpBonusesService: LevelUpBonusesService) {}

  public set characterName(name: string | undefined) {
    this._characterName = name;
  }

  public set backstory(story: Backstory | undefined) {
    this._backstory = story;
  }

  public set languages(languages: string[] | undefined) {
    this._languages = languages;
  }

  public get languages(): string[] | undefined {
    return this._languages;
  }

  public set classData(data: DisplayInitClassData | undefined) {
    this._classData = data;
  }

  public set classBoosts(data: Abilities[] | undefined) {
    this._classBoosts = data;
  }

  public set background(data: BackgroundData | undefined) {
    this._background = data;
  }

  public set backgroundBoosts(data: Abilities[] | undefined) {
    this._backgroundBoosts = data;
  }

  public set race(data: RaceData | undefined) {
    this._race = data;
  }

  public set abilities(
    data: { boosts: Abilities[]; flaws: Abilities[] } | undefined
  ) {
    this._raceAbilities = data;
  }

  public set heritageFeat(data: string | undefined) {
    this._heritageFeat = data;
  }

  public set heritageEffect(data: EffectChoice | undefined) {
    this._heritageEffect = data;
  }

  public set ancestryFeat(data: string | undefined) {
    this._ancestryFeat = data;
  }

  public set ancestryEffect(data: EffectChoice | undefined) {
    this._ancestryEffect = data;
  }

  public set skills(data: Skill[] | undefined) {
    this._skills = data;
  }

  public get skills(): Skill[] | undefined {
    return this._skills;
  }

  public get raceChoiceCompleted(): boolean {
    return (
      !!this._race &&
      !!this._raceAbilities &&
      !!this._ancestryFeat &&
      !!this._heritageFeat
    );
  }

  public get backgroundChoiceCompleted(): boolean {
    return !!this._background && !!this._backgroundBoosts;
  }

  public get classChoiceCompleted(): boolean {
    return (
      !!this._classData &&
      !!this._classBoosts &&
      !!this.levelUpBonusesService.feats.length
    );
  }

  public get additionalChoicesCompleted(): boolean {
    return (
      this.raceChoiceCompleted &&
      this.backgroundChoiceCompleted &&
      this.classChoiceCompleted &&
      this.languagesToAdd +
        (this._race?.languages.length ?? 0) -
        (this._languages?.length ?? 0) ===
        0 &&
      this.skillsToAdd - (this._skills?.length ?? 0) === 0
    );
  }

  public get backstoryCompleted(): boolean {
    return !!this._characterName && !!this._backstory;
  }

  public get newCharacterCompleted(): boolean {
    return (
      this.raceChoiceCompleted &&
      this.backgroundChoiceCompleted &&
      this.classChoiceCompleted &&
      this.additionalChoicesCompleted &&
      this.backstoryCompleted
    );
  }

  public createNewCharacter(): SeedCharacterData {
    const newCharacter = {
      name: this._characterName,
      class: this._classData?.id,
      race: this._race?._id,
      background: this._background?._id,
      level: 1,
      featChoices: this.gatherChoices(),
      feats: this.gatherFeats(),
      boosts: this.gatherBoosts(),
      flaws: this.gatherFlaws(),
      savingThrows: [...(this._classData?.savingThrows ?? [])],
      skills: this.gatherSkills(),
      attacks: this._classData?.weaponProficiencies ?? [],
      defences: this._classData?.armorProficiencies ?? [],
      inventory: [],
      equippedItems: [],
      investedItems: [],
      spells: [],
      actions: [],
      backstory: this.gatherBackstory(),
    } as unknown as SeedCharacterData;
    return newCharacter;
  }

  public calculateModifiers(): void {
    const boosts: Abilities[] = this.gatherBoosts();
    const flaws: Abilities[] = this.gatherFlaws();

    const getModifier = (count: number): number => {
      let addedValue = 0;
      if (count <= 4) {
        addedValue = count * 2;
      } else {
        addedValue = 8 + (count - 4);
      }

      return Math.floor(addedValue / 2);
    };

    const intModifier = this.abilityModifiers
      ? this.abilityModifiers[Abilities.int]
      : 0;

    this.abilityModifiers = {
      [Abilities.str]: getModifier(
        boosts.filter(item => item === Abilities.str).length -
          flaws.filter(item => item === Abilities.str).length
      ),
      [Abilities.dex]: getModifier(
        boosts.filter(item => item === Abilities.dex).length -
          flaws.filter(item => item === Abilities.dex).length
      ),
      [Abilities.con]: getModifier(
        boosts.filter(item => item === Abilities.con).length -
          flaws.filter(item => item === Abilities.con).length
      ),
      [Abilities.wis]: getModifier(
        boosts.filter(item => item === Abilities.wis).length -
          flaws.filter(item => item === Abilities.wis).length
      ),
      [Abilities.int]: getModifier(
        boosts.filter(item => item === Abilities.int).length -
          flaws.filter(item => item === Abilities.int).length
      ),
      [Abilities.cha]: getModifier(
        boosts.filter(item => item === Abilities.cha).length -
          flaws.filter(item => item === Abilities.cha).length
      ),
    };

    if (intModifier !== this.abilityModifiers[Abilities.int]) {
      this.skillsToAdd = 0;
      this.skills = [];

      this.languagesToAdd = 0;
      this.languages = [];
    }
  }

  public gatherFeats(): string[] {
    const feats: string[] = [];

    if (this._background?.feats) {
      feats.push(...this._background.feats);
    }

    if (this._heritageFeat && this._ancestryFeat) {
      feats.push(this._heritageFeat);
      feats.push(this._ancestryFeat);
    }

    if (this._race?.darkvision) {
      feats.push(this._race.darkvision);
    }

    if (this.levelUpBonusesService.feats.length) {
      feats.push(...this.levelUpBonusesService.feats);
    }

    return feats;
  }

  public initLanguages(): {
    languagesToAdd: number;
    initialLanguages: string[];
  } {
    this.languagesToAdd = this.abilityModifiers
      ? this.abilityModifiers[Abilities.int]
      : 0;

    const initialLanguages = this._languages?.length
      ? this._languages
      : [...(this._race?.languages ?? [])];

    return { languagesToAdd: this.languagesToAdd, initialLanguages };
  }

  public initAdditionalSkills(characterFeats: Feat[]): {
    skillsToChange: number;
    chosenSkills: Skill[];
  } {
    const featSkills = characterFeats
      .map(feat =>
        feat.effect
          .filter(effect => effect.effectType === CharacterEffectType.skill)
          .map(effect => {
            const skill = (effect as GrantSkillProficiencyEffect).payload;
            const mappedSkill: Skill = {
              name: skill.skill,
              level: skill.level,
              value: 0,
              ability: skillToAbilityMap[skill.skill],
            };

            if (skill.specialty) {
              mappedSkill.specialty = skill.specialty;
            }

            return mappedSkill;
          })
      )
      .flat();

    const effectSkills = this.gatherChoices()
      .map(choice => choice.effect)
      .flat()
      .filter(effect => effect.effectType === CharacterEffectType.skill)
      .map(effect => {
        const skill = (effect as GrantSkillProficiencyEffect).payload;
        const mappedSkill: Skill = {
          name: skill.skill,
          level: skill.level,
          value: 0,
          ability: skillToAbilityMap[skill.skill],
        };

        if (skill.specialty) {
          mappedSkill.specialty = skill.specialty;
        }

        return mappedSkill;
      });

    const allChosenSkills = (this._background?.proficiencies ?? [])
      .concat(this._classData?.proficiencies ?? [])
      .map(item => ({
        value: 0,
        ...item,
      }))
      .concat(featSkills)
      .concat(effectSkills);

    const chosenSkills = allChosenSkills.reduce((acc, curr) => {
      const id = acc.findIndex(
        item => item.name === curr.name && item.specialty === curr.specialty
      );

      if (id === -1) {
        acc.push(curr);
      }

      return acc;
    }, [] as Skill[]);

    let repeating = allChosenSkills.length - chosenSkills.length;

    this.skillsToAdd =
      repeating +
      (this._classData?.additionalProficiencies ?? 0) +
      (this.abilityModifiers ? this.abilityModifiers[Abilities.int] : 0);

    return { skillsToChange: this.skillsToAdd, chosenSkills };
  }

  private gatherChoices(): EffectChoice[] {
    const choices: EffectChoice[] = [];

    if (this._ancestryEffect && this._heritageEffect) {
      choices.push(this._ancestryEffect);
      choices.push(this._heritageEffect);
    }

    if (this.levelUpBonusesService.effects.length) {
      choices.push(...this.levelUpBonusesService.effects);
    }

    return choices;
  }

  private gatherBoosts(): Abilities[] {
    const boosts: Abilities[] = [];

    if (this._classBoosts?.length) {
      boosts.push(...this._classBoosts);
    }

    if (this._backgroundBoosts?.length) {
      boosts.push(...this._backgroundBoosts);
    }

    if (this._raceAbilities?.boosts.length) {
      boosts.push(...this._raceAbilities.boosts);
    }

    if (this.levelUpBonusesService.boosts.length) {
      boosts.push(...this.levelUpBonusesService.boosts);
    }

    return boosts;
  }

  private gatherFlaws(): Abilities[] {
    const flaws: Abilities[] = [];

    if (this._raceAbilities?.flaws.length) {
      flaws.push(...this._raceAbilities.flaws);
    }

    return flaws;
  }

  private gatherBackstory(): Backstory {
    const backstory = this._backstory;
    if (backstory) {
      backstory.languages = this._languages ?? [];
    }

    return backstory ? backstory : ({} as Backstory);
  }

  private gatherSkills(): Skill[] {
    let skills = this._skills ?? [];

    if (this._background?.proficiencies?.length) {
      skills = skills.concat(
        ...this._background.proficiencies.map(item => ({ ...item, value: 0 }))
      );
    }

    return skills;
  }
}
