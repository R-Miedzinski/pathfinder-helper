export class Dice {
  size?: number;
  count?: number;

  constructor(count: number, size: number) {
    this.count = count;
    this.size = size;
  }

  public toString(): string {
    return `${this.count}d${this.size}`;
  }
}
