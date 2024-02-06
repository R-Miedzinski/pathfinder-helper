import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import { HP } from '../models/hp';

@Component({
  selector: 'app-health',
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthComponent {
  @Input() rowHeight!: number;
  @Input() health!: HP;
  @Output() healthChange: EventEmitter<{ change: number; addTemp: boolean }> =
    new EventEmitter<{ change: number; addTemp: boolean }>();
  public hpChange: number = 0;
  public addTemp: boolean = false;

  public hpChangeHandler(): void {
    this.healthChange.emit({
      change: this.hpChange,
      addTemp: this.addTemp,
    });
  }

  public restHandler(): void {
    console.error('rest not implemented yet');
  }
}
