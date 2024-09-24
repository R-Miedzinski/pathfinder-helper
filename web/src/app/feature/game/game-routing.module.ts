import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelComponent } from './panel/panel.component';
import { userAuthGuard } from 'src/app/shared/guards/user-auth.guard';

const routes: Routes = [
  {
    path: 'new',
    loadChildren: () =>
      import('../new-character/new-character.module').then(
        m => m.NewCharacterModule
      ),
    canActivate: [userAuthGuard],
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
