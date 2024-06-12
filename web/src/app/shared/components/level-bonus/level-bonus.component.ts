import { Component, Input, OnInit } from '@angular/core';
import {
  AddFeatLevelBonus,
  LevelBonus,
  LevelBonusCategory,
} from 'rpg-app-shared-package/dist/public-api';

@Component({
  selector: 'app-level-bonus',
  templateUrl: './level-bonus.component.html',
  styleUrls: ['./level-bonus.component.scss'],
})
export class LevelBonusComponent implements OnInit {
  @Input() levelBonus?: LevelBonus;

  protected readonly bonusCategory = LevelBonusCategory;

  public ngOnInit(): void {
    // TODO: identify bonus type
    // TODO: create form for identified data type
  }
}
