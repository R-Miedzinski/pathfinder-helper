export enum DataCategory {
  Feat = 'Feat',
  Trait = 'Trait',
  Action = 'Action',
  Background = 'Background',
  Item = 'Item',
  Spell = 'Spell',
}

export const DataCategoryUrl: Record<DataCategory, string> = {
  [DataCategory.Feat]: '/api/feats',
  [DataCategory.Trait]: '/api/traits',
  [DataCategory.Action]: '/api/actions',
  [DataCategory.Background]: '/api/backgrounds',
  [DataCategory.Item]: '/api/items',
  [DataCategory.Spell]: '/api/spells',
};

export const dataCategories = [
  DataCategory.Feat,
  DataCategory.Trait,
  DataCategory.Action,
  DataCategory.Background,
  DataCategory.Item,
  DataCategory.Spell,
];
