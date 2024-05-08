import { Character } from 'rpg-app-shared-package/dist/public-api'

export abstract class FeatHandler {
  protected _id: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected _payload: any

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(id: string, payload: any) {
    this._id = id
    this._payload = payload
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static identifyFeat(feat: { id: string; payload: any }): FeatType {
    switch (feat.payload?.type) {
      case FeatType.proficiency:
        return FeatType.proficiency
      case FeatType.action:
        return FeatType.action
      default:
        return FeatType.description
    }
  }

  abstract handleFeat(character: Character): void
}

export enum FeatType {
  proficiency = 'Proficiency',
  description = 'Description',
  action = 'Action',
}
