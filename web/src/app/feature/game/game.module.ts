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
import { StoreModule } from '@ngrx/store';
import { gameFeature } from './ngrx/game-reducer';
import { ModifierPlusMinusPipe } from './pipes/modifier-plus-minus.pipe';
import { ItemsService } from './services/items.service';
import { SpellsService } from './services/spells.service';
import { SavingThrowsComponent } from './saving-throws/saving-throws.component';
import { SpellBookComponent } from './spell-book/spell-book.component';
import { FeatsComponent } from './feats/feats.component';
import { FeatsService } from './services/feats.service';
import { NewCharacterComponent } from './new-character/new-character.component';
import { BackstoryComponent } from './backstory/backstory.component';
import { ActionsComponent } from './actions/actions.component';
import { ActionService } from './services/action.service';
import { ActionListComponent } from './actions/action-list/action-list.component';
import { MainCharacterPageComponent } from './main-character-page/main-character-page.component';
import { SkillsService } from './services/skills.service';
import { AbilitiesService } from './services/abilities.service';
import { ChooseRaceFormComponent } from './new-character/choose-race-form/choose-race-form.component';
import { ChooseBackgroundFormComponent } from './new-character/choose-background-form/choose-background-form.component';
import { ChooseClassFormComponent } from './new-character/choose-class-form/choose-class-form.component';
import { BackstoryFormComponent } from './new-character/backstory-form/backstory-form.component';
import { LevelUpModalComponent } from './level-up-modal/level-up-modal.component';

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
    SavingThrowsComponent,
    SpellBookComponent,
    FeatsComponent,
    NewCharacterComponent,
    BackstoryComponent,
    ActionsComponent,
    ActionListComponent,
    MainCharacterPageComponent,
    ModifierPlusMinusPipe,
    ChooseRaceFormComponent,
    ChooseBackgroundFormComponent,
    ChooseClassFormComponent,
    BackstoryFormComponent,
    LevelUpModalComponent,
  ],
  providers: [
    ItemsService,
    SpellsService,
    FeatsService,
    ActionService,
    SkillsService,
    AbilitiesService,
  ],
  imports: [
    GameRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    StoreModule.forFeature(gameFeature),
  ],
})
export class GameModule {}
