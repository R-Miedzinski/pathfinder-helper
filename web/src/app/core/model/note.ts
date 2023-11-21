export interface Note {
  id: string;
  title: string;
  author: string;
  privacy: NotePrivacy;
  content: string;
}

export enum NotePrivacy {
  Public = 'public',
  Private = 'private',
  DM = 'dm',
}
