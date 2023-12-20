import { createAction, props } from '@ngrx/store';
import { Character } from '../models/character';
import { HP } from '../models/hp';

export const saveCharacterAction = createAction(
  '[GAME] Save User',
  props<{ character: Character }>()
);

export const saveHealthAction = createAction(
  '[GAME] Set new HP',
  props<{ hp: HP }>()
);
