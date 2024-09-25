import { UserRole } from 'rpg-app-shared-package/dist/public-api'

export function getEntitlementsForRole(role: string): string[] {
  const entitlements = []

  if (role === UserRole.USER || role === UserRole.ADMIN) {
    entitlements.push(Entitlements.CAN_PLAY)
  }

  if (role === UserRole.ADMIN) {
    entitlements.push(Entitlements.CAN_EDIT)
  }

  return entitlements
}

export enum Entitlements {
  CAN_PLAY = 'canPlay',
  CAN_EDIT = 'canEdit',
}
