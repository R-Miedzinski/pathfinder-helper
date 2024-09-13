import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameMenuComponent } from './game-menu/game-menu.component';
import { NewGameComponent } from './new-game/new-game.component';
import { CreateGameComponent } from './create-game/create-game.component';
import { JoinGameComponent } from './join-game/join-game.component';

const routes: Routes = [
  {
    path: 'new-game',
    component: NewGameComponent,
  },
  {
    path: 'create-game',
    component: CreateGameComponent,
  },
  {
    path: 'join-game',
    component: JoinGameComponent,
  },
  {
    path: 'game',
    loadChildren: () => import('../game/game.module').then(m => m.GameModule),
  },
  { path: '', component: GameMenuComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
