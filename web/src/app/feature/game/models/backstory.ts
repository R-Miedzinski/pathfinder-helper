import { Alignment } from './enums/alignment';

export interface Backstory {
  id: string;
  alignment: Alignment;
  story: string;
  notes?: string;
  image?: string;
  nationality?: string;
  ethnicity?: string;
  age?: number | string;
  gender?: string;
  pronouns?: string;
  height?: number | string;
  weight?: number | string;
  appearence?: string;
  attitude?: string;
  beliefs?: string;
  likes?: string;
  dislikes?: string;
  deity?: string;
}
