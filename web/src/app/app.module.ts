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
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
