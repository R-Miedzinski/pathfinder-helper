import { createAction, props } from '@ngrx/store';
import { Character } from '../models/character';
import { HP } from '../models/hp';
import { Skill } from '../models/skill';

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
  '[GAME] Set new Saving Throws',
  props<{ savingThrows: { fortitude: number; reflex: number; will: number } }>()
);

export const saveAllSkillsAction = createAction(
  '[GAME] Set new Skills',
  props<{ skills: Skill[] }>()
);

export const saveSkillAction = createAction(
  '[GAME] Update a Skill',
  props<{ skill: Skill }>()
);
