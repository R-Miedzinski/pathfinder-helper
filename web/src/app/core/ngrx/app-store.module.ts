import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppReducer } from './app.reducer';

@NgModule({
  declarations: [],
  imports: [
    StoreModule.forRoot({ AppState: AppReducer }),
    StoreDevtoolsModule.instrument({}),
  ],
  exports: [StoreModule, StoreDevtoolsModule],
})
export class AppStoreModule {}
