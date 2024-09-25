import { createReducer, on } from '@ngrx/store';
import * as AppActions from './actions/app.actions';
import { initialState, AppState } from './interfaces/app-state';
import { cloneDeep } from 'lodash';

export const AppReducer = createReducer(
  initialState,
  on(AppActions.toggleSideNav, (state: AppState) => {
    const stateCopy = cloneDeep(state);
    stateCopy.showSideNav = !state.showSideNav;

    return stateCopy;
  }),
  on(AppActions.setCurrentGame, (state, props) => {
    const stateCopy = cloneDeep(state);
    stateCopy.currentGame = { id: props.id, name: props.name };

    return stateCopy;
  })
);
