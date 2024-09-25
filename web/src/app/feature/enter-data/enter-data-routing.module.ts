import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnterDataFormComponent } from './enter-data/enter-data-form.component';

const routes: Routes = [
  {
    path: '**',
    component: EnterDataFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnterDataRoutingModule {}
