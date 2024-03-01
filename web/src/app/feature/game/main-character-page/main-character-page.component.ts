import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Character } from '../../../shared/models/interfaces/character';
import { CharacterAction } from '../../../shared/models/interfaces/character-action';
import { CharacterSheetMode } from '../../../shared/models/enums/character-sheet-mode';

@Component({
  selector: 'app-main-character-page',
  templateUrl: './main-character-page.component.html',
  styleUrls: ['./main-character-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainCharacterPageComponent implements OnInit {
  @Input() rowHeight!: number;
  @Input() character!: Character;
  @Input() actionsList!: CharacterAction[] | null;
  @Input() mode!: CharacterSheetMode;
  @Output() healthChange: EventEmitter<{
    change: number;
    addTemp: boolean;
  }> = new EventEmitter<{ change: number; addTemp: boolean }>();
  protected modes = CharacterSheetMode;

  public ngOnInit(): void {
    if (this.rowHeight === undefined) {
      this.rowHeight = 19.6;
    }
    if (this.character === undefined) {
      this.character = {} as Character;
    }
    if (!this.actionsList) {
      this.actionsList = [];
    }
  }

  protected handleHealthChange(event: {
    change: number;
    addTemp: boolean;
  }): void {
    this.healthChange.emit(event);
  }
}
