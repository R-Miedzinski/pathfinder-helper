import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { Skill } from '../models/skill';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsComponent implements OnChanges {
  @Input() skills: Skill[] = [];

  ngOnChanges(): void {
    this.skills.sort((a, b) => a.name.localeCompare(b.name));
  }
}
