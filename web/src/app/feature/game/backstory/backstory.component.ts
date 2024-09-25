import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Backstory, Race } from 'rpg-app-shared-package/dist/public-api';

@Component({
  selector: 'app-backstory',
  templateUrl: './backstory.component.html',
  styleUrls: ['./backstory.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackstoryComponent {
  @Input({ required: true }) backstory!: Backstory;
  @Input({ required: true }) race!: Race;
  @Input() rowHeight!: number;
  @Input() name: string = '';
}
