import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewCharacterComponent } from '../game/new-character/new-character.component';

const routes: Routes = [
  {
    path: '*',
    component: NewCharacterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewCharacterRoutingModule {}
