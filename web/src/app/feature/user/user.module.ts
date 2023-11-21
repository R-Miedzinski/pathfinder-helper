import { NgModule } from '@angular/core';

import { PrivateLibraryComponent } from './private-library/private-library.component';
import { GameMenuComponent } from './game-menu/game-menu.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserRoutingModule } from './user-routing.module';
import { NewGameComponent } from './new-game/new-game.component';

@NgModule({
  declarations: [
    PrivateLibraryComponent,
    GameMenuComponent,
    UserSettingsComponent,
    NewGameComponent,
  ],
  imports: [UserRoutingModule, SharedModule],
})
export class UserModule {}
