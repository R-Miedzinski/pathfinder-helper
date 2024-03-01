import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Item } from 'src/app/shared/models/interfaces/item';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemComponent {
  @Input() item!: Item;

  get haveProperites(): boolean {
    return (
      !!this.item.price ||
      !!this.item.ammunition ||
      !!this.item.usage ||
      !!this.item.bulk ||
      !!this.item.activate ||
      !!this.item.onset
    );
  }
}
