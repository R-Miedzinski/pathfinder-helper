import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CastPipe } from './pipes/cast.pipe';
import { ItemComponent } from './components/item/item.component';
import { SpellComponent } from './components/spell/spell.component';
import { HoverCardComponent } from './components/hover-card/hover-card.component';
import { TraitComponent } from './components/trait/trait.component';
import { SanitazeHTMLPipe } from './pipes/sanitaze-html.pipe';
import { BoostChoiceComponent } from './components/boost-choice/boost-choice.component';
import { ToFormControlPipe } from './pipes/to-form-control.pipe';
import { SkillProficienciesFormComponent } from './components/skill-proficiencies-form/skill-proficiencies-form.component';
import { SkillInputComponent } from './components/skill-input/skill-input.component';
import { LanguagesInputComponent } from './components/languages-input/languages-input.component';
import { FeatChoiceComponent } from './components/feat-choice/feat-choice.component';
import { FeatComponent } from './components/feat/feat.component';
import { LevelBonusComponent } from './components/level-bonus/level-bonus.component';
import { ToFormGroupPipe } from './pipes/to-form-group.pipe';
import { ToFormArrayPipe } from './pipes/to-form-array.pipe';
import { ExcludeForFreeBoostPipe } from './pipes/exclude-for-free-boost.pipe';

@NgModule({
  declarations: [
    CastPipe,
    ItemComponent,
    SpellComponent,
    HoverCardComponent,
    TraitComponent,
    SanitazeHTMLPipe,
    BoostChoiceComponent,
    ToFormControlPipe,
    ToFormGroupPipe,
    ToFormArrayPipe,
    SkillProficienciesFormComponent,
    SkillInputComponent,
    LanguagesInputComponent,
    FeatComponent,
    FeatChoiceComponent,
    LevelBonusComponent,
    ExcludeForFreeBoostPipe,
  ],
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  exports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CastPipe,
    ToFormControlPipe,
    ToFormGroupPipe,
    ToFormArrayPipe,
    SanitazeHTMLPipe,
    ItemComponent,
    SpellComponent,
    HoverCardComponent,
    TraitComponent,
    BoostChoiceComponent,
    SkillProficienciesFormComponent,
    SkillInputComponent,
    LanguagesInputComponent,
    FeatComponent,
    FeatChoiceComponent,
    LevelBonusComponent,
    ExcludeForFreeBoostPipe,
  ],
})
export class SharedModule {}
