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
  @Input() health!: HP;
  @Output() healthChange: EventEmitter<number> = new EventEmitter<number>();
  hpChange: number = 0;

  public hpChangeHandler(): void {
    this.healthChange.emit(this.hpChange);
    this.hpChange = 0;
  }
}
