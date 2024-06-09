import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FeatChoice } from 'rpg-app-shared-package/dist/models/game/interfaces/feat-choice';
import { Feat, FeatCategory } from 'rpg-app-shared-package/dist/public-api';

@Component({
  selector: 'app-feats',
  templateUrl: './feats.component.html',
  styleUrls: ['./feats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatsComponent implements OnInit, OnChanges {
  @Input() rowHeight!: number;
  @Input() featList: Feat[] | null = [];
  @Input() featChoices: Map<string, FeatChoice> = new Map();
  classFeats: Feat[] = [];
  ancestryFeats: Feat[] = [];
  skillFeats: Feat[] = [];
  generalFeats: Feat[] = [];
  bonusFeats: Feat[] = [];

  public ngOnInit(): void {
    this.classFeats =
      this.featList
        ?.filter(
          feat =>
            feat.category === FeatCategory.class ||
            feat.category === FeatCategory.feature
        )
        .sort((a, b) => a.level - b.level) || [];
    this.ancestryFeats =
      this.featList
        ?.filter(
          feat =>
            feat.category === FeatCategory.heritage ||
            feat.category === FeatCategory.ancestry
        )
        .sort((a, b) => a.level - b.level) || [];
    this.skillFeats =
      this.featList
        ?.filter(feat => feat.category === FeatCategory.skill)
        .sort((a, b) => a.level - b.level) || [];
    this.generalFeats =
      this.featList
        ?.filter(feat => feat.category === FeatCategory.general)
        .sort((a, b) => a.level - b.level) || [];
    this.bonusFeats =
      this.featList
        ?.filter(
          feat =>
            feat.category === FeatCategory.special ||
            feat.category === FeatCategory.bonus
        )
        .sort((a, b) => a.level - b.level) || [];
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['featList']) {
      this.classFeats =
        this.featList
          ?.filter(
            feat =>
              feat.category === FeatCategory.class ||
              feat.category === FeatCategory.feature
          )
          .sort((a, b) => a.level - b.level) || [];
      this.ancestryFeats =
        this.featList
          ?.filter(
            feat =>
              feat.category === FeatCategory.heritage ||
              feat.category === FeatCategory.ancestry
          )
          .sort((a, b) => a.level - b.level) || [];
      this.skillFeats =
        this.featList
          ?.filter(feat => feat.category === FeatCategory.skill)
          .sort((a, b) => a.level - b.level) || [];
      this.generalFeats =
        this.featList
          ?.filter(feat => feat.category === FeatCategory.general)
          .sort((a, b) => a.level - b.level) || [];
      this.bonusFeats =
        this.featList
          ?.filter(
            feat =>
              feat.category === FeatCategory.special ||
              feat.category === FeatCategory.bonus
          )
          .sort((a, b) => a.level - b.level) || [];
    }
  }
}
