export enum DataCategory {
  Feat = 'Feat',
}

export const DataCategoryUrl: Record<DataCategory, string> = {
  [DataCategory.Feat]: '/api/feats',
};

export const dataCategories = [DataCategory.Feat];
