import { createFeature, createReducer, on } from '@ngrx/store';
import { Character } from '../models/character';
import * as GameActions from './game-actions';

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
      const gameStateCopy = JSON.parse(JSON.stringify(state));
      gameStateCopy.character = JSON.parse(JSON.stringify(props.character));

      return gameStateCopy;
    }
  )
);

export const gameFeature = createFeature({
  name: 'gameData',
  reducer: gameReducer,
});
