export interface Game {
  id: string;
  name: string;
  characters: string[];
  users: string[];
  gameMaster: string;
  description?: string;
}
