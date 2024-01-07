import { NgModule } from '@angular/core';
import { NotesComponent } from './notes/notes.component';
import { CharacterSheetComponent } from './character-sheet/character-sheet.component';
import { GameRoutingModule } from './game-routing.module';
import { PanelComponent } from './panel/panel.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CheatSheetsComponent } from './cheat-sheets/cheat-sheets.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AbilityScoresComponent } from './ability-scores/ability-scores.component';
import { SkillsComponent } from './skills/skills.component';
import { HealthComponent } from './health/health.component';
import { VariousStatsComponent } from './various-stats/various-stats.component';
import { InventoryComponent } from './inventory/inventory.component';
import { GameDataService } from './services/game-data.service';
import { StoreModule } from '@ngrx/store';
import { gameFeature } from './ngrx/game-reducer';
import { ModifierPlusMinusPipe } from './pipes/modifier-plus-minus.pipe';
import { ItemsService } from './services/items.service';
import { SpellsService } from './services/spells.service';
import { SavingThrowsComponent } from './saving-throws/saving-throws.component';

@NgModule({
  declarations: [
    NotesComponent,
    CharacterSheetComponent,
    PanelComponent,
    CheatSheetsComponent,
    AbilityScoresComponent,
    SkillsComponent,
    HealthComponent,
    VariousStatsComponent,
    InventoryComponent,
    ModifierPlusMinusPipe,
    SavingThrowsComponent,
  ],
  providers: [GameDataService, ItemsService, SpellsService],
  imports: [
    GameRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    StoreModule.forFeature(gameFeature),
  ],
})
export class GameModule {}
