import { Injectable, OnDestroy } from '@angular/core';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { cloneDeep } from 'lodash';
import {
  Armor,
  ArmorCategory,
  ArmorGroup,
  DamageType,
  Dice,
  Item,
  ItemType,
  Weapon,
  WeaponGroup,
} from 'rpg-app-shared-package';

const itemsList: Item[] = [
  {
    id: '1',
    equippable: false,
    itemType: ItemType.item,
    name: 'testItem1',
    level: 1,
    description: 'descritpion of testItem1',
    usage: 'usage',
    activate: 3,
  },
  {
    id: '2',
    equippable: false,
    itemType: ItemType.item,
    name: 'testItem2',
    level: 2,
    description: 'descritpion of testItem2',
    traits: ['with', 'traits'],
    type: 'with type',
  },
  {
    id: '3',
    equippable: true,
    itemType: ItemType.item,
    name: 'testItem3',
    level: 3,
    price: 10,
    description: 'descritpion of testItem3',
    craftRequirenments: 'some craft reqs',
  },
  <Weapon>{
    id: '4',
    equippable: true,
    itemType: ItemType.weapon,
    name: 'testItem4',
    level: 4,
    damage: new Dice(1, 8),
    group: WeaponGroup.sword,
    damageType: DamageType.slashing,
    hands: 1,
    description: `descritpion of testItem4. This one is quite long. Let's even say this one is a weapon.
    Deals <strong>${new Dice(1, 8)}</strong> dmg `,
    craftRequirenments: 'some craft reqs, maybe some ore and wood.',
  },
  <Armor>{
    id: '5',
    equippable: true,
    itemType: ItemType.armor,
    name: 'testItem5',
    level: 6,
    category: ArmorCategory.medium,
    group: ArmorGroup.leather,
    ACbonus: 3,
    DexcCap: 2,
    checkPenalty: 3,
    speedPenalty: 5,
    minStrenght: 14,
    description: 'descritpion of testItem5. Test armor',
  },
  {
    id: '6',
    equippable: false,
    itemType: ItemType.item,
    name: 'testItem6',
    level: 3,
    price: 10,
    description: `descritpion of testItem6, which is really, really long. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris lacinia faucibus urna, eget lacinia sem suscipit non. Curabitur convallis placerat est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus iaculis tincidunt augue. Sed sollicitudin a justo sit amet sagittis. In non magna vitae nisi accumsan sagittis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla imperdiet dignissim nisi, et venenatis turpis pellentesque laoreet. Integer id libero tortor. Donec efficitur rutrum sapien, ac faucibus sem iaculis venenatis.
      Interdum et malesuada fames ac ante ipsum primis in faucibus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nunc eget eros suscipit, imperdiet nisi ac, ullamcorper risus. Suspendisse tempus massa nisl, ut varius risus lobortis sit amet. Mauris mauris tellus, fringilla id faucibus ut, semper placerat nulla. Mauris ac tortor in ex feugiat aliquet. Aenean velit dui, imperdiet quis porta a, tristique a urna. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam eget diam tincidunt, pharetra arcu nec, porttitor lacus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.`,
    craftRequirenments: 'some craft reqs',
  },
];

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
        const item = itemsList.filter(it => it.id === itemId)[0];
        return { item, count };
      })
    );
  }

  public equipItem(newItem: { itemId: string; count: number }): void {
    if (
      this.equipped.findIndex(({ item }) => item.id === newItem.itemId) !== -1
    ) {
      this.equippedItems$.next(
        cloneDeep(
          this.equipped.map(({ item, count }) =>
            item.id === newItem.itemId
              ? {
                  item,
                  count: count + newItem.count,
                }
              : { item, count }
          )
        )
      );
    } else if (
      this.allItems.findIndex(({ item }) => item.id === newItem.itemId) !== -1
    ) {
      const item = this.allItems.find(
        ({ item }) => item.id === newItem.itemId
      )!.item;
      this.equippedItems$.next(
        cloneDeep(this.equipped.concat({ item, count: newItem.count }))
      );
    }
  }

  public deequipItem(itemId: string): void {
    if (this.equipped.findIndex(({ item }) => item.id === itemId) !== -1) {
      const equippedToEmit = cloneDeep(this.equipped)
        .map(({ item, count }) =>
          item.id === itemId ? { item, count: count - 1 } : { item, count }
        )
        .filter(({ count }) => count > 0);
      this.equippedItems$.next(equippedToEmit);
    }
  }

  public investItem(newItem: { itemId: string; count: number }): void {
    if (
      this.invested.findIndex(({ item }) => item.id === newItem.itemId) !== -1
    ) {
      this.investedItems$.next(
        cloneDeep(
          this.invested.map(({ item, count }) =>
            item.id === newItem.itemId
              ? {
                  item,
                  count: count + newItem.count,
                }
              : { item, count }
          )
        )
      );
    } else if (
      this.allItems.findIndex(({ item }) => item.id === newItem.itemId) !== -1
    ) {
      const item = this.allItems.find(
        ({ item }) => item.id === newItem.itemId
      )!.item;
      this.investedItems$.next(
        cloneDeep(this.invested.concat({ item, count: newItem.count }))
      );
    }
  }

  public deinvestItem(itemId: string): void {
    if (this.invested.findIndex(({ item }) => item.id === itemId) !== -1) {
      const investedToEmit = cloneDeep(this.invested)
        .map(({ item, count }) =>
          item.id === itemId ? { item, count: count - 1 } : { item, count }
        )
        .filter(({ count }) => count > 0);
      this.investedItems$.next(investedToEmit);
    }
  }
}
