export class EquipmentSlots {
  helmet: boolean;
  torso: boolean;
  leftBracelet: boolean;
  leftArm: boolean;
  leftHand: boolean;
  rightBracelet: boolean;
  rightArm: boolean;
  rightHand: boolean;
  belt: boolean;
  pants: boolean;
  shoes: boolean;
  necklace: boolean;
  rings: number;
  invested: number;

  constructor() {
    this.helmet = false;
    this.torso = false;
    this.leftBracelet = false;
    this.leftArm = false;
    this.leftHand = false;
    this.rightBracelet = false;
    this.rightArm = false;
    this.rightHand = false;
    this.belt = false;
    this.pants = false;
    this.shoes = false;
    this.necklace = false;
    this.rings = 0;
    this.invested = 0;
  }
}
