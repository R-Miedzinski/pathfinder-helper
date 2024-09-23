import { createFeature, createReducer, on } from '@ngrx/store';
import * as GameActions from './game-actions';
import { cloneDeep, isEqual } from 'lodash';
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
  newCharacter,
} from 'rpg-app-shared-package/dist/public-api';

export interface GameState {
  mode: CharacterSheetMode;
  character: Character;
  newCharacter: Character;
}

const initialGameState: GameState = {
  mode: CharacterSheetMode.view,
  character: newCharacter(),
  newCharacter: newCharacter(),
};

const gameReducer = createReducer(
  initialGameState,
  on(
    GameActions.setMode,
    (state: GameState, props: { mode: CharacterSheetMode }) => {
      const gameStateCopy = cloneDeep(state);
      gameStateCopy.mode = props.mode;
      if (!isEqual(gameStateCopy.character, gameStateCopy.newCharacter)) {
        gameStateCopy.newCharacter = cloneDeep(gameStateCopy.character);
      }

      return gameStateCopy;
    }
  ),
  on(
    GameActions.saveCharacterAction,
    (state: GameState, props: { character: Character }) => {
      const gameStateCopy = cloneDeep(state);
      gameStateCopy.character = cloneDeep(props.character);
      gameStateCopy.newCharacter = cloneDeep(props.character);

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
    (state: GameState, props: { savingThrows: SavingThrow[] }) => {
      const gameStateCopy = cloneDeep(state);
      gameStateCopy.character.savingThrows = cloneDeep(props.savingThrows);

      return gameStateCopy;
    }
  ),
  on(
    GameActions.saveSavingThrowAction,
    (state: GameState, props: { savingThrow: SavingThrow }) => {
      const gameStateCopy = cloneDeep(state);
      gameStateCopy.character.savingThrows =
        gameStateCopy.character.savingThrows.map(savingThrow =>
          savingThrow.name === props.savingThrow.name
            ? props.savingThrow
            : savingThrow
        );

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
  ),
  on(
    GameActions.saveAbilitiesAction,
    (state: GameState, props: { abilities: Ability[] }) => {
      const gameStateCopy = cloneDeep(state);
      gameStateCopy.character.abilities = cloneDeep(props.abilities);

      return gameStateCopy;
    }
  ),
  on(
    GameActions.saveFeatsAction,
    (state: GameState, props: { feats: Feat[] }) => {
      const gameStateCopy = cloneDeep(state);
      gameStateCopy.character.feats = props.feats.map(feat => feat._id);

      return gameStateCopy;
    }
  ),
  on(GameActions.addFeatAction, (state: GameState, props: { feat: Feat }) => {
    const gameStateCopy = cloneDeep(state);
    gameStateCopy.character.feats.push(props.feat._id);

    return gameStateCopy;
  }),
  on(
    GameActions.saveAbilityAction,
    (state: GameState, props: { ability: Ability }) => {
      const gameStateCopy = cloneDeep(state);
      gameStateCopy.character.abilities = gameStateCopy.character.abilities.map(
        ability =>
          ability.name === props.ability.name ? props.ability : ability
      );

      return gameStateCopy;
    }
  ),
  on(
    GameActions.saveNameAction,
    (state: GameState, props: { name: string }) => {
      const gameStateCopy = cloneDeep(state);
      gameStateCopy.character.characterName = props.name;

      return gameStateCopy;
    }
  ),
  on(GameActions.saveRaceAction, (state: GameState, props: { race: Race }) => {
    const gameStateCopy = cloneDeep(state);
    gameStateCopy.character.race = props.race;

    return gameStateCopy;
  }),
  on(
    GameActions.saveBackstoryAction,
    (state: GameState, props: { backstory: Backstory }) => {
      const gameStateCopy = cloneDeep(state);
      gameStateCopy.character.backstory = props.backstory;

      return gameStateCopy;
    }
  )
);

export const gameFeature = createFeature({
  name: 'gameData',
  reducer: gameReducer,
});
