import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing-module';
import { RouterModule, Routes } from '@angular/router';

import { App } from './app';
import { Meteo } from './meteo/meteo';
import { MeteoDetail } from './meteo-detail/meteo-detail';
import { MeteoService } from './services/meteo.service';

// --- Routes ajoutées  ---
const appRoutes: Routes = [
  { 
    path: 'meteo/:name',
    component: MeteoDetail
  },
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full'
  },
  {
    path: '',
    component: Meteo
  }
];

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    App,       
    Meteo,      
    MeteoDetail 
    // Ajout RouterModule 
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
    ),

    FormsModule,          
    ReactiveFormsModule   
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),

    // service 
    MeteoService
  ],
  bootstrap: [App]
})
export class AppModule { }
