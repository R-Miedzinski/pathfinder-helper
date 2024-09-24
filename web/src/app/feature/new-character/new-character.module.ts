import { NgModule } from '@angular/core';
import { NewCharacterRoutingModule } from './new-character-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ChooseRaceFormComponent } from './choose-race-form/choose-race-form.component';
import { ChooseBackgroundFormComponent } from './choose-background-form/choose-background-form.component';
import { ChooseClassFormComponent } from './choose-class-form/choose-class-form.component';
import { BackstoryFormComponent } from './backstory-form/backstory-form.component';

@NgModule({
  declarations: [
    ChooseRaceFormComponent,
    ChooseBackgroundFormComponent,
    ChooseClassFormComponent,
    BackstoryFormComponent,
  ],
  imports: [NewCharacterRoutingModule, SharedModule, ReactiveFormsModule],
  exports: [
    ChooseRaceFormComponent,
    ChooseBackgroundFormComponent,
    ChooseClassFormComponent,
    BackstoryFormComponent,
  ],
})
export class NewCharacterModule {}
