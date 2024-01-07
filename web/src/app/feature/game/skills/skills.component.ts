import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { Skill } from '../models/skill';
import { cloneDeep } from 'lodash';
import stringSort from 'src/app/shared/helpers/string-sort';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsComponent implements OnChanges {
  @Input() skills: Skill[] = [];

  ngOnChanges(): void {
    this.skills = cloneDeep(this.skills).sort((a, b) =>
      stringSort(a.name, b.name)
    );
  }
}
