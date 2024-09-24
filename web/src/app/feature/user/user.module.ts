import { NgModule } from '@angular/core';

import { PrivateLibraryComponent } from './private-library/private-library.component';
import { GameMenuComponent } from './game-menu/game-menu.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserRoutingModule } from './user-routing.module';
import { NewGameComponent } from './new-game/new-game.component';
import { JoinGameComponent } from './join-game/join-game.component';
import { CreateGameComponent } from './create-game/create-game.component';

@NgModule({
  declarations: [
    PrivateLibraryComponent,
    GameMenuComponent,
    UserSettingsComponent,
    NewGameComponent,
    JoinGameComponent,
    CreateGameComponent,
  ],
  imports: [UserRoutingModule, SharedModule],
})
export class UserModule {}
