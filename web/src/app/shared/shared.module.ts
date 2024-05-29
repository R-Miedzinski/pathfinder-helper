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
    SkillProficienciesFormComponent,
    SkillInputComponent,
  ],
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  exports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CastPipe,
    ToFormControlPipe,
    SanitazeHTMLPipe,
    ItemComponent,
    SpellComponent,
    HoverCardComponent,
    TraitComponent,
    BoostChoiceComponent,
    SkillProficienciesFormComponent,
    SkillInputComponent,
  ],
})
export class SharedModule {}
