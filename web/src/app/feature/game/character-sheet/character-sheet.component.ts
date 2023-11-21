import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-character-sheet',
  templateUrl: './character-sheet.component.html',
  styleUrls: ['./character-sheet.component.scss'],
})
export class CharacterSheetComponent implements OnInit {
  character: any = null;

  ngOnInit(): void {
    this.character = {
      name: 'Character name',
      // class names in enum?
      class: 'className',
      level: 69,
      abilityScores: {
        // put abilities to enum?
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
    };
  }
}
