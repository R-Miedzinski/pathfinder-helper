export interface AppState {
  showSideNav: Boolean;
  currentGame: { id: string; name: string };
}

export const initialState: AppState = {
  showSideNav: false,
  currentGame: { id: '', name: '' },
};
