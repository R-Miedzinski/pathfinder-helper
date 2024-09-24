import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';
import { MainComponent } from './core/main/main.component';
import { InfoAndLicensesComponent } from './core/info-and-licenses/info-and-licenses.component';
import { LogInComponent } from './core/log-in/log-in.component';
import { postDataGuard } from './shared/guards/post-data.guard';
import { userAuthGuard } from './shared/guards/user-auth.guard';

const routes: Routes = [
  {
    path: 'user',
    loadChildren: () =>
      import('./feature/user/user.module').then(m => m.UserModule),
    canActivate: [userAuthGuard],
  },
  { path: 'log-in', component: LogInComponent },
  {
    path: 'enter-data',
    loadChildren: () =>
      import('./feature/enter-data/enter-data.module').then(
        m => m.EnterDataModule
      ),
    canActivate: [postDataGuard],
  },
  { path: 'info', component: InfoAndLicensesComponent },
  { path: 'main', component: MainComponent },
  { path: '', pathMatch: 'full', redirectTo: 'main' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
