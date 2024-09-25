import { NgModule } from '@angular/core';
import { EnterDataRoutingModule } from './enter-data-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddFeatComponent } from './add-feat/add-feat.component';
import { AddEffectComponent } from './add-effect/add-effect.component';
import { AddTraitComponent } from './add-trait/add-trait.component';
import { AddActionComponent } from './add-action/add-action.component';
import { AddBackgroundComponent } from './add-background/add-background.component';
import { AddItemComponent } from './add-item/add-item.component';
import { AddSpellComponent } from './add-spell/add-spell.component';
import { EnterDataFormComponent } from './enter-data/enter-data-form.component';

@NgModule({
  declarations: [
    EnterDataFormComponent,
    AddFeatComponent,
    AddEffectComponent,
    AddTraitComponent,
    AddActionComponent,
    AddBackgroundComponent,
    AddItemComponent,
    AddSpellComponent,
  ],
  imports: [SharedModule, EnterDataRoutingModule],
})
export class EnterDataModule {}
