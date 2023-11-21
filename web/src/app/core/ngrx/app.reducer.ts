import { createReducer, on } from '@ngrx/store';
import * as AppActions from './actions/app.actions';
import { initialState, AppState } from './interfaces/app-state';

export const AppReducer = createReducer(
  initialState,
  on(AppActions.toggleSideNav, (state: AppState) => {
    const stateCopy = JSON.parse(JSON.stringify(state));
    stateCopy.showSideNav = !state.showSideNav;

    return stateCopy;
  }),
  on(AppActions.setCurrentGame, (state, props) => {
    const stateCopy = JSON.parse(JSON.stringify(state));
    stateCopy.currentGame = props.name;

    return stateCopy;
  })
);
