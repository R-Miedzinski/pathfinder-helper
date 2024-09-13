import { createAction, props } from '@ngrx/store';

export const toggleSideNav = createAction('[App] ToggleSideNav');

export const setCurrentGame = createAction(
  '[User] SetCurrentGame',
  props<{ id: string; name: string }>()
);
