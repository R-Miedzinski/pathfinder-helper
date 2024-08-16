import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogInComponent } from './core/log-in/log-in.component';
import { InfoAndLicensesComponent } from './core/info-and-licenses/info-and-licenses.component';
import { LibraryComponent } from './core/library/library.component';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';
import { MainComponent } from './core/main/main.component';
import { SharedModule } from './shared/shared.module';
import { FormsModule } from '@angular/forms';
import { AppStoreModule } from './core/ngrx/app-store.module';
import { ToolbarComponent } from './core/toolbar/toolbar.component';
import { SideNavComponent } from './core/side-nav/side-nav.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpCacheClientService } from './shared/services/http-cache-client.service';
import { EnterDataFormComponent } from './core/enter-data-form/enter-data-form.component';
import { AddFeatComponent } from './core/enter-data-form/add-feat/add-feat.component';
import { AddEffectComponent } from './core/enter-data-form/add-effect/add-effect.component';
import { AddTraitComponent } from './core/enter-data-form/add-trait/add-trait.component';
import { AddActionComponent } from './core/enter-data-form/add-action/add-action.component';
import { AddBackgroundComponent } from './core/enter-data-form/add-background/add-background.component';
import { AddItemComponent } from './core/enter-data-form/add-item/add-item.component';
import { AddSpellComponent } from './core/enter-data-form/add-spell/add-spell.component';
import { HttpRedirectInterceptor } from './shared/interceptors/http-redirect.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    InfoAndLicensesComponent,
    LibraryComponent,
    PageNotFoundComponent,
    MainComponent,
    ToolbarComponent,
    SideNavComponent,
    EnterDataFormComponent,
    AddFeatComponent,
    AddEffectComponent,
    AddTraitComponent,
    AddActionComponent,
    AddBackgroundComponent,
    AddItemComponent,
    AddSpellComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    FormsModule,
    AppStoreModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [
    HttpCacheClientService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRedirectInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
