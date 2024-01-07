import { Component, Input } from '@angular/core';
import keepOrder from 'src/app/shared/helpers/keepOrder';

@Component({
  selector: 'app-various-stats',
  templateUrl: './various-stats.component.html',
  styleUrls: ['./various-stats.component.scss'],
})
export class VariousStatsComponent {
  @Input() rowHeight!: number;
  @Input() speed: any;
  @Input() initiativeMod?: number;
  @Input() armorClass?: number;
  keepOrderLocal = keepOrder;
}
