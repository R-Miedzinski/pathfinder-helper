import { createFeature, createReducer, on } from '@ngrx/store';
import { Character } from '../models/character';
import * as GameActions from './game-actions';
import { HP } from '../models/hp';
import { cloneDeep } from 'lodash';
import { Skill } from '../models/skill';

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
  }),
  on(
    GameActions.saveInitiativeAction,
    (state: GameState, props: { initiativeMod: number }) => {
      const gameStateCopy = cloneDeep(state);
      gameStateCopy.character.initiativeMod = cloneDeep(props.initiativeMod);

      return gameStateCopy;
    }
  ),
  on(
    GameActions.saveArmorClassAction,
    (state: GameState, props: { armorClass: number }) => {
      const gameStateCopy = cloneDeep(state);
      gameStateCopy.character.armorClass = cloneDeep(props.armorClass);

      return gameStateCopy;
    }
  ),
  on(
    GameActions.saveSavingThrowsAction,
    (state: GameState, props: { savingThrows: any }) => {
      const gameStateCopy = cloneDeep(state);
      gameStateCopy.character.savingThrows = cloneDeep(props.savingThrows);

      return gameStateCopy;
    }
  ),
  on(
    GameActions.saveAllSkillsAction,
    (state: GameState, props: { skills: Skill[] }) => {
      const gameStateCopy = cloneDeep(state);
      gameStateCopy.character.skills = cloneDeep(props.skills);

      return gameStateCopy;
    }
  ),
  on(
    GameActions.saveSkillAction,
    (state: GameState, props: { skill: Skill }) => {
      const gameStateCopy = cloneDeep(state);
      gameStateCopy.character.skills = gameStateCopy.character.skills.map(
        skill => (skill.name === props.skill.name ? props.skill : skill)
      );

      return gameStateCopy;
    }
  )
);

export const gameFeature = createFeature({
  name: 'gameData',
  reducer: gameReducer,
});
