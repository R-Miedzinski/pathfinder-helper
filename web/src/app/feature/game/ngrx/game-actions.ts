import { createAction, props } from '@ngrx/store';
import { Character } from '../models/character';

export const saveCharacterAction = createAction(
  '[GAME] Save User',
  props<{ character: Character }>()
);
