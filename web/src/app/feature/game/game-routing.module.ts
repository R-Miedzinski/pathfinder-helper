import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelComponent } from './panel/panel.component';
import { NewCharacterComponent } from './new-character/new-character.component';

const routes: Routes = [
  {
    path: 'new',
    component: NewCharacterComponent,
  },
  {
    path: ':id',
    component: PanelComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '0',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameRoutingModule {}
