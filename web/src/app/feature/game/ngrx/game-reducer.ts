import { createFeature, createReducer, on } from '@ngrx/store';
import { Character } from '../models/character';
import * as GameActions from './game-actions';
import { HP } from '../models/hp';
import { cloneDeep } from 'lodash';

export interface GameState {
  character: Character;
}

const initialGameState: GameState = {
  character: {} as Character,
};

const gameReducer = createReducer(
  initialGameState,
  on(
    GameActions.saveCharacterAction,
    (state: GameState, props: { character: Character }) => {
      const gameStateCopy = cloneDeep(state);
      gameStateCopy.character = cloneDeep(props.character);

      return gameStateCopy;
    }
  ),
  on(GameActions.saveHealthAction, (state: GameState, props: { hp: HP }) => {
    const gameStateCopy = cloneDeep(state);
    gameStateCopy.character.hp = cloneDeep(props.hp);

    return gameStateCopy;
  })
);

export const gameFeature = createFeature({
  name: 'gameData',
  reducer: gameReducer,
});
