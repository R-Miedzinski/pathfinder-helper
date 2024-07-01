import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';
import { MainComponent } from './core/main/main.component';
import { InfoAndLicensesComponent } from './core/info-and-licenses/info-and-licenses.component';
import { LogInComponent } from './core/log-in/log-in.component';
import { EnterDataFormComponent } from './core/enter-data-form/enter-data-form.component';

const routes: Routes = [
  {
    path: 'user',
    loadChildren: () =>
      import('./feature/user/user.module').then(m => m.UserModule),
  },
  { path: 'log-in', component: LogInComponent },
  { path: 'enter-data', component: EnterDataFormComponent },
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
