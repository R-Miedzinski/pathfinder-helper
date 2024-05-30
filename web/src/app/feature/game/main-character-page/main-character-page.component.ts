import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  Character,
  CharacterAction,
  CharacterSheetMode,
} from 'rpg-app-shared-package/dist/public-api';
@Component({
  selector: 'app-main-character-page',
  templateUrl: './main-character-page.component.html',
  styleUrls: ['./main-character-page.component.scss'],
})
export class MainCharacterPageComponent implements OnInit {
  @Input() rowHeight!: number;
  @Input() character: Character = {} as Character;
  @Output() healthChange: EventEmitter<{
    change: number;
    addTemp: boolean;
  }> = new EventEmitter<{ change: number; addTemp: boolean }>();

  public ngOnInit(): void {
    if (this.rowHeight === undefined) {
      this.rowHeight = 19.6;
    }
  }

  protected handleHealthChange(event: {
    change: number;
    addTemp: boolean;
  }): void {
    this.healthChange.emit(event);
  }
}
