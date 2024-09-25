import { Injectable, OnDestroy } from '@angular/core';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { cloneDeep } from 'lodash';
import { Item } from 'rpg-app-shared-package';

const itemsList: Item[] = [];

@Injectable()
export class ItemsService implements OnDestroy {
  public readonly itemsInInventory$: ReplaySubject<
    { item: Item; count: number }[]
  > = new ReplaySubject();
  public readonly equippedItems$: ReplaySubject<
    { item: Item; count: number }[]
  > = new ReplaySubject();
  public readonly investedItems$: ReplaySubject<
    { item: Item; count: number }[]
  > = new ReplaySubject();
  private allItems: { item: Item; count: number }[] = [];
  private equipped: { item: Item; count: number }[] = [];
  private invested: { item: Item; count: number }[] = [];
  private readonly ngOnDestroy$: Subject<void> = new Subject();

  constructor() {
    this.itemsInInventory$.pipe(takeUntil(this.ngOnDestroy$)).subscribe({
      next: items => (this.allItems = cloneDeep(items)),
    });
    this.equippedItems$.pipe(takeUntil(this.ngOnDestroy$)).subscribe({
      next: items => (this.equipped = cloneDeep(items)),
    });
    this.investedItems$.pipe(takeUntil(this.ngOnDestroy$)).subscribe({
      next: items => (this.invested = cloneDeep(items)),
    });
  }

  public ngOnDestroy(): void {
    this.ngOnDestroy$.next();
    this.ngOnDestroy$.complete();
  }

  public getItems(
    itemIds: {
      itemId: string;
      count: number;
    }[]
  ): void {
    this.itemsInInventory$.next(
      itemIds.map(({ itemId, count }) => {
        const item = itemsList.filter(it => it._id === itemId)[0];
        return { item, count };
      })
    );
  }

  public equipItem(newItem: { itemId: string; count: number }): void {
    if (
      this.equipped.findIndex(({ item }) => item._id === newItem.itemId) !== -1
    ) {
      this.equippedItems$.next(
        cloneDeep(
          this.equipped.map(({ item, count }) =>
            item._id === newItem.itemId
              ? {
                  item,
                  count: count + newItem.count,
                }
              : { item, count }
          )
        )
      );
    } else if (
      this.allItems.findIndex(({ item }) => item._id === newItem.itemId) !== -1
    ) {
      const item = this.allItems.find(
        ({ item }) => item._id === newItem.itemId
      )!.item;
      this.equippedItems$.next(
        cloneDeep(this.equipped.concat({ item, count: newItem.count }))
      );
    }
  }

  public deequipItem(itemId: string): void {
    if (this.equipped.findIndex(({ item }) => item._id === itemId) !== -1) {
      const equippedToEmit = cloneDeep(this.equipped)
        .map(({ item, count }) =>
          item._id === itemId ? { item, count: count - 1 } : { item, count }
        )
        .filter(({ count }) => count > 0);
      this.equippedItems$.next(equippedToEmit);
    }
  }

  public investItem(newItem: { itemId: string; count: number }): void {
    if (
      this.invested.findIndex(({ item }) => item._id === newItem.itemId) !== -1
    ) {
      this.investedItems$.next(
        cloneDeep(
          this.invested.map(({ item, count }) =>
            item._id === newItem.itemId
              ? {
                  item,
                  count: count + newItem.count,
                }
              : { item, count }
          )
        )
      );
    } else if (
      this.allItems.findIndex(({ item }) => item._id === newItem.itemId) !== -1
    ) {
      const item = this.allItems.find(
        ({ item }) => item._id === newItem.itemId
      )!.item;
      this.investedItems$.next(
        cloneDeep(this.invested.concat({ item, count: newItem.count }))
      );
    }
  }

  public deinvestItem(itemId: string): void {
    if (this.invested.findIndex(({ item }) => item._id === itemId) !== -1) {
      const investedToEmit = cloneDeep(this.invested)
        .map(({ item, count }) =>
          item._id === itemId ? { item, count: count - 1 } : { item, count }
        )
        .filter(({ count }) => count > 0);
      this.investedItems$.next(investedToEmit);
    }
  }
}
