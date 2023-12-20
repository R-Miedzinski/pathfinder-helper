import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Skill } from '../models/skill';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsComponent {
  @Input() skills: Skill[] = [];
}
