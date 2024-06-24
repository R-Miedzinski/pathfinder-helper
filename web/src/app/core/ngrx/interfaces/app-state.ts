export interface AppState {
  showSideNav: Boolean;
  currentGame?: string;
}

export const initialState: AppState = {
  showSideNav: false,
};
