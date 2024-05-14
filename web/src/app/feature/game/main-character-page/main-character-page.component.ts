import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  Character,
  CharacterAction,
  CharacterSheetMode,
} from 'rpg-app-shared-package/dist/public-api';
@Component({
  selector: 'app-main-character-page',
  templateUrl: './main-character-page.component.html',
  styleUrls: ['./main-character-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainCharacterPageComponent implements OnInit {
  @Input() rowHeight!: number;
  @Input() character: Character = {} as Character;
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
