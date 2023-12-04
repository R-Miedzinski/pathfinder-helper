import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GameState } from './game-reducer';

export const gameFeature = createFeatureSelector<GameState>('gameData');

export const getCharacter = createSelector(
  gameFeature,
  (state: GameState) => state.character
);
