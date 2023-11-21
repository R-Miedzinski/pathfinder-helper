import { createSelector } from '@ngrx/store';
import { AppState } from '../interfaces/app-state';

export const getAppState = (state: any) => state.AppState;

export const getShowSideNav = createSelector(
  getAppState,
  (state: AppState) => state.showSideNav
);

export const getCurrentGame = createSelector(
  getAppState,
  (state: AppState) => state.currentGame
);
