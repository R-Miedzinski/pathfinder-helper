import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Item } from '../models/item';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryComponent {
  @Input() inventory: Item[] = [];
  @Input() equippedItems: { item: string; quantity: number }[] | undefined;
  @Input() investedItems: { item: string; quantity: number }[] | undefined;

  public isEquipped(item: Item): boolean | undefined {
    return item.equippable
      ? this.equippedItems !== undefined
        ? this.equippedItems.map(item => item.item).includes(item.name)
        : undefined
      : undefined;
  }

  public isInvested(item: Item): boolean | undefined {
    item?.traits?.includes('Invested');
    return this.investedItems !== undefined
      ? this.investedItems.map(item => item.item).includes(item.name)
      : undefined;
  }
}
