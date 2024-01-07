import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SavingThrow } from '../models/saving-throw';

@Component({
  selector: 'app-saving-throws',
  templateUrl: './saving-throws.component.html',
  styleUrls: ['./saving-throws.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SavingThrowsComponent {
  @Input() savingThrows: SavingThrow[] = [];
}
