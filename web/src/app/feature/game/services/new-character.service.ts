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

@Injectable({
  providedIn: 'root',
})
export class NewCharacterService {
  public abilityModifiers?: Record<Abilities, number>;
  private _characterName?: string;
  private _backstory?: Backstory;
  private _classData?: DisplayInitClassData;
  private _classBoosts?: Abilities[];
  private _classFeat?: string;
  private _background?: BackgroundData;
  private _backgroundBoosts?: Abilities[];
  private _race?: RaceData;
  private _raceAbilities?: { boosts: Abilities[]; flaws: Abilities[] };
  private _heritageFeat?: string;
  private _heritageEffect?: EffectChoice;
  private _ancestryFeat?: string;
  private _ancestryEffect?: EffectChoice;

  constructor() {}

  public set characterName(name: string | undefined) {
    this._characterName = name;
  }

  public set backstory(story: Backstory | undefined) {
    this._backstory = story;
  }

  public set languages(languages: string[] | undefined) {
    if (this._backstory && languages?.length) {
      this._backstory.languages = languages;
    }
  }

  public set classData(data: DisplayInitClassData | undefined) {
    this._classData = data;
  }

  public set classBoosts(data: Abilities[] | undefined) {
    this._classBoosts = data;
  }

  public set classFeat(feat: string | undefined) {
    this._classFeat = feat;
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
    return !!this._classData && !!this._classBoosts && !!this._classFeat;
  }

  public get additionalChoicesCompleted(): boolean {
    return true;
  }

  public get backstoryCompleted(): boolean {
    return !!this._characterName && !!this._backstory;
  }

  public get newCaracterCompleted(): boolean {
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
      id: '0',
      name: this._characterName,
      class: this._classData?.name,
      race: this._race?.name,
      background: this._background?.id,
      level: 1,
      featChoices: this.gatherChoices(),
      feats: this.gatherFeats(),
      boosts: this.gatherBoosts(),
      flaws: this.gatherFlaws(),
      savingThrows: [...(this._classData?.savingThrows ?? [])],
      skills: [],
      // this.additionalSkills.value.filter(
      //   (el: Skill) =>
      //     !this.featSkills
      //       // .map(skill => ({ name: skill.name, specialty: skill.specialty }))
      //       .includes(el) //{ name: el.name, specialty: el.specialty })
      // ),
      attacks: this._classData?.weaponProficiencies ?? [],
      defences: this._classData?.armorProficiencies ?? [],
      inventory: [],
      equippedItems: [],
      investedItems: [],
      spells: [],
      actions: [],
      backstory: this.gatherBackstory(),
    } as SeedCharacterData;
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
  }

  public gatherFeats(): string[] {
    const feats: string[] = [];

    if (this._classFeat) {
      feats.push(this._classFeat);
    }

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

    return feats;
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

    const chosenSkills = (this._background?.proficiencies ?? [])
      .concat(this._classData?.proficiencies ?? [])
      .map(item => ({
        value: 0,
        ...item,
      }))
      .concat(featSkills);

    const skillsToChange =
      (this._classData?.additionalProficiencies ?? 0) +
      (this.abilityModifiers ? this.abilityModifiers[Abilities.int] : 0);

    return { skillsToChange, chosenSkills };
  }

  private gatherChoices(): EffectChoice[] {
    const choices: EffectChoice[] = [];

    if (this._ancestryEffect && this._heritageEffect) {
      choices.push(this._ancestryEffect);
      choices.push(this._heritageEffect);
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

    return backstory ? backstory : ({} as Backstory);
  }
}
