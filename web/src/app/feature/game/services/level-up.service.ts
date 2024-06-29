import { Injectable } from '@angular/core';
import { LevelUpBonusesService } from './level-up-bonuses.service';
import { SeedCharacterData } from 'rpg-app-shared-package/dist/public-api';
import { GameDataService } from './game-data.service';
import { Observable, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LevelUpService {
  private _characterSeedData?: SeedCharacterData;

  constructor(
    private levelUpBonusesService: LevelUpBonusesService,
    private gameDataService: GameDataService
  ) {}

  public getNewCharacterData(): Observable<SeedCharacterData> {
    return this.gameDataService.getSeedData().pipe(
      map(seedData => {
        seedData.level += 1;

        this.updateBoosts(seedData);
        this.updateFeats(seedData);
        this.updateEffects(seedData);
        this.updateSkills(seedData);

        return seedData;
      })
    );
  }

  private updateBoosts(characterData: SeedCharacterData): void {
    characterData.boosts.push(...this.levelUpBonusesService.boosts);
  }

  private updateFeats(characterData: SeedCharacterData): void {
    characterData.feats.push(...this.levelUpBonusesService.feats);

    this.levelUpBonusesService.featReplacements.forEach(entry => {
      const index = characterData.feats.indexOf(entry.toReplace);

      if (index !== -1) {
        characterData.feats[index] = entry.replacement;
      }

      const choices = characterData.featChoices.filter(
        item => item.featId === entry.toReplace
      );

      if (choices.length) {
        characterData.featChoices = characterData.featChoices
          .filter(item => item.featId !== entry.toReplace)
          .concat(entry.choices ?? []);
      }
    });
  }

  private updateEffects(characterData: SeedCharacterData): void {
    characterData.featChoices.push(...this.levelUpBonusesService.effects);
  }

  private updateSkills(characterData: SeedCharacterData): void {
    this.levelUpBonusesService.skills.forEach(skill => {
      const id = characterData.skills.findIndex(
        item => item.name === skill.name && item?.specialty === skill?.specialty
      );

      if (id !== -1) {
        characterData.skills[id] = skill;
      } else {
        characterData.skills.push(skill);
      }
    });
  }
}
