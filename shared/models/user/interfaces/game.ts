export interface Game {
  _id: string;
  name: string;
  characters: {
    user: string;
    id: string;
  }[];
  users: string[];
  gameMaster: string;
  description?: string;
}
