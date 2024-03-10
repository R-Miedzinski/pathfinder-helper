import { createAction, props } from '@ngrx/store';
import {
  Ability,
  Backstory,
  Character,
  CharacterSheetMode,
  Feat,
  HP,
  Race,
  SavingThrow,
  Skill,
} from 'rpg-app-shared-package/dist/public-api';

export const setMode = createAction(
  '[GAME] Set Mode',
  props<{ mode: CharacterSheetMode }>()
);

export const saveCharacterAction = createAction(
  '[GAME] Save User',
  props<{ character: Character }>()
);

export const saveHealthAction = createAction(
  '[GAME] Set new HP',
  props<{ hp: HP }>()
);

export const saveInitiativeAction = createAction(
  '[GAME] Set new Initiative Modifier',
  props<{ initiativeMod: number }>()
);

export const saveArmorClassAction = createAction(
  '[GAME] Set new Armor Class',
  props<{ armorClass: number }>()
);

export const saveSavingThrowsAction = createAction(
  '[GAME] Set Saving Throws',
  props<{ savingThrows: SavingThrow[] }>()
);

export const saveSavingThrowAction = createAction(
  '[GAME] Update Saving Throw',
  props<{ savingThrow: SavingThrow }>()
);

export const saveAllSkillsAction = createAction(
  '[GAME] Set new Skills',
  props<{ skills: Skill[] }>()
);

export const saveSkillAction = createAction(
  '[GAME] Update a Skill',
  props<{ skill: Skill }>()
);

export const saveAbilitiesAction = createAction(
  '[GAME] Set new Abilities',
  props<{ abilities: Ability[] }>()
);

export const saveAbilityAction = createAction(
  '[GAME] Update an Ability',
  props<{ ability: Ability }>()
);

export const saveFeatsAction = createAction(
  '[GAME] Set new Feats',
  props<{ feats: Feat[] }>()
);

export const addFeatAction = createAction(
  '[GAME] Add new Feat',
  props<{ feat: Feat }>()
);

export const saveNameAction = createAction(
  '[GAME] Set new Name',
  props<{ name: string }>()
);

export const saveRaceAction = createAction(
  '[GAME] Set new Race',
  props<{ race: Race }>()
);

export const saveBackstoryAction = createAction(
  '[GAME] Set new Backstory',
  props<{ backstory: Backstory }>()
);
