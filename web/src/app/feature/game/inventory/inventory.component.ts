import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Item } from '../models/interfaces/item';
import { Observable, Subject, takeUntil } from 'rxjs';
import { cloneDeep } from 'lodash';
import stringSort from 'src/app/shared/helpers/string-sort';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryComponent implements OnInit, OnDestroy {
  @Input() inventory!: Observable<{ item: Item; count: number }[]>;
  @Input() equippedItems!: Observable<{ item: Item; count: number }[]>;
  @Input() investedItems!: Observable<{ item: Item; count: number }[]>;
  @Output() equipmentChange: EventEmitter<{ action: string; itemId: string }> =
    new EventEmitter();
  inventoryLocal: { item: Item; count: number }[] = [];
  equippedLocal: { item: Item; count: number }[] = [];
  investedLocal: { item: Item; count: number }[] = [];
  private readonly ngOnDestroy$: Subject<void> = new Subject();

  public ngOnInit(): void {
    this.inventory.pipe(takeUntil(this.ngOnDestroy$)).subscribe({
      next: data =>
        (this.inventoryLocal = cloneDeep(data).sort((a, b) =>
          stringSort(a.item.name, b.item.name)
        )),
    });
    this.equippedItems.pipe(takeUntil(this.ngOnDestroy$)).subscribe({
      next: data =>
        (this.equippedLocal = cloneDeep(data).sort((a, b) =>
          stringSort(a.item.name, b.item.name)
        )),
    });
    this.investedItems.pipe(takeUntil(this.ngOnDestroy$)).subscribe({
      next: data =>
        (this.investedLocal = cloneDeep(data).sort((a, b) =>
          stringSort(a.item.name, b.item.name)
        )),
    });
  }

  public ngOnDestroy(): void {
    this.ngOnDestroy$.next();
    this.ngOnDestroy$.complete();
  }

  public equip(itemId: string): void {
    this.equipmentChange.emit({ action: 'equip', itemId });
  }

  public deequip(itemId: string): void {
    this.equipmentChange.emit({ action: 'deequip', itemId });
  }

  public invest(itemId: string): void {
    this.equipmentChange.emit({ action: 'invest', itemId });
  }

  public deinvest(itemId: string): void {
    this.equipmentChange.emit({ action: 'deinvest', itemId });
  }
}
