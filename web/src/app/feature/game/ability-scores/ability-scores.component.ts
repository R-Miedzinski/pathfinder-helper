import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ability-scores',
  templateUrl: './ability-scores.component.html',
  styleUrls: ['./ability-scores.component.scss'],
})
export class AbilityScoresComponent {
  @Input() abilityScores: any;

  keepOrder = (a: any, b: any) => a.key;
}
