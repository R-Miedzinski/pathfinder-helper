import { Component, Input } from '@angular/core';
import keepOrder from 'src/app/shared/helpers/keepOrder';

@Component({
  selector: 'app-various-stats',
  templateUrl: './various-stats.component.html',
  styleUrls: ['./various-stats.component.scss'],
})
export class VariousStatsComponent {
  @Input() speed: any;
  @Input() initiativeMod?: number;
  @Input() armorClass?: number;
  @Input() savingThrows: any;
  keepOrderLocal = keepOrder;
}
