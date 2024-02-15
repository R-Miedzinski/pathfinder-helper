import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Feat } from '../models/interfaces/feat';
import { FeatCategory } from '../models/enums/feat-category';

@Component({
  selector: 'app-feats',
  templateUrl: './feats.component.html',
  styleUrls: ['./feats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatsComponent implements OnInit {
  @Input() rowHeight!: number;
  @Input() featList: Feat[] | null = [];
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
}
