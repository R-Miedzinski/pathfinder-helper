import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GameState } from './game-reducer';

export const gameFeature = createFeatureSelector<GameState>('gameData');

export const getMode = createSelector(
  gameFeature,
  (state: GameState) => state.mode
);

export const getCharacter = createSelector(
  gameFeature,
  (state: GameState) => state.character
);

export const getInventory = createSelector(
  gameFeature,
  (state: GameState) => state.character.inventory || []
);

export const getSpells = createSelector(
  gameFeature,
  (state: GameState) => state.character.spells || []
);

export const getFeats = createSelector(
  gameFeature,
  (state: GameState) => state.character.feats || []
);

export const getActions = createSelector(
  gameFeature,
  (state: GameState) => state.character.actions || []
);

export const getAbilities = createSelector(
  gameFeature,
  (state: GameState) => state.character.abilities || []
);
